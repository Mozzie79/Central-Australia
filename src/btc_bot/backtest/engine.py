"""Adapts our strategy interface (generate_signals -> Signal series) onto the
`backtesting.py` engine. The same `generate_signals` function that drives the
backtest will later drive the live order manager, so backtest and live logic
don't drift apart.

Position sizing and stop-loss are applied uniformly here via `btc_bot.risk`,
regardless of which strategy is running, so the resulting comparison
isolates signal quality rather than differing risk implementations.
"""

from __future__ import annotations

import numpy as np
import pandas as pd
from backtesting import Strategy as BTStrategy
from backtesting.lib import FractionalBacktest

from btc_bot.config import settings
from btc_bot.risk import position_sizing, stop_loss
from btc_bot.strategies.base import Signal
from btc_bot.strategies.base import Strategy as SignalStrategy

MAX_POSITION_FRACTION = 0.999
DEFAULT_FRACTIONAL_UNIT = 1e-8  # satoshi; FractionalBacktest scales price/volume by this


def _to_backtesting_frame(df: pd.DataFrame) -> pd.DataFrame:
    renamed = df.rename(
        columns={"open": "Open", "high": "High", "low": "Low", "close": "Close", "volume": "Volume"}
    )
    return renamed[["Open", "High", "Low", "Close", "Volume"]]


def _build_adapter(
    signals: pd.Series,
    atr_series: pd.Series,
    risk_per_trade_pct: float,
    max_position_pct: float,
    atr_multiplier: float,
    fractional_unit: float,
) -> type[BTStrategy]:
    signal_values = signals.to_numpy()
    # FractionalBacktest scales Open/High/Low/Close by fractional_unit internally, so
    # self.data.Close below is in scaled units. ATR must be scaled the same way for the
    # stop-price math (price - multiplier*ATR) to stay in a consistent unit space. The
    # resulting size-as-fraction-of-equity is scale-invariant, so sizing is unaffected.
    atr_values = atr_series.to_numpy() * fractional_unit

    class _SignalAdapter(BTStrategy):
        def init(self) -> None:
            pass

        def _sized_fraction(self, equity: float, entry_price: float, stop_price: float) -> float:
            size_units = position_sizing.position_size(
                equity, entry_price, stop_price, risk_per_trade_pct, max_position_pct
            )
            return min(size_units * entry_price / equity, MAX_POSITION_FRACTION)

        def next(self) -> None:
            i = len(self.data) - 1
            signal = signal_values[i]
            atr_value = atr_values[i]
            price = self.data.Close[-1]

            if signal == Signal.FLAT:
                if self.position:
                    self.position.close()
                return

            if np.isnan(atr_value):
                return  # not enough warmup yet to compute a stop distance

            equity = self.equity

            if signal == Signal.LONG:
                if self.position.is_long:
                    return
                if self.position.is_short:
                    self.position.close()
                stop_price = stop_loss.long_stop_price(price, atr_value, atr_multiplier)
                fraction = self._sized_fraction(equity, price, stop_price)
                if fraction > 0:
                    self.buy(size=fraction, sl=stop_price)

            elif signal == Signal.SHORT:
                if self.position.is_short:
                    return
                if self.position.is_long:
                    self.position.close()
                stop_price = stop_loss.short_stop_price(price, atr_value, atr_multiplier)
                fraction = self._sized_fraction(equity, price, stop_price)
                if fraction > 0:
                    self.sell(size=fraction, sl=stop_price)

    return _SignalAdapter


def run_backtest(
    df: pd.DataFrame,
    strategy: SignalStrategy,
    cash: float = 10_000.0,
    commission: float | None = None,
    slippage_bps: float | None = None,
    atr_period: int = 14,
    fractional_unit: float = DEFAULT_FRACTIONAL_UNIT,
) -> pd.Series:
    """Run one strategy's backtest over `df` and return backtesting.py's stats Series."""
    commission_pct = settings.taker_fee_pct if commission is None else commission
    slippage_pct = (settings.slippage_bps if slippage_bps is None else slippage_bps) / 10_000

    signals = strategy.generate_signals(df)
    atr_series = stop_loss.atr(df["high"], df["low"], df["close"], period=atr_period)

    adapter_cls = _build_adapter(
        signals,
        atr_series,
        settings.risk_per_trade_pct,
        settings.max_position_pct,
        settings.atr_stop_multiplier,
        fractional_unit,
    )
    bt = FractionalBacktest(
        _to_backtesting_frame(df),
        adapter_cls,
        cash=cash,
        commission=commission_pct,
        spread=slippage_pct,
        fractional_unit=fractional_unit,
    )
    return bt.run()
