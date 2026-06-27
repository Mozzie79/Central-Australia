from __future__ import annotations

import pandas as pd
from ta.trend import EMAIndicator

from btc_bot.strategies.base import Signal, Strategy


class EmaCrossoverStrategy(Strategy):
    """Trend-following: fast/slow EMA cross, filtered by a longer-term trend EMA
    to avoid taking counter-trend whipsaw trades."""

    name = "ema_crossover"
    default_params = {"fast": 20, "slow": 50, "trend_filter": 200}
    param_grid = [
        {"fast": fast, "slow": slow, "trend_filter": trend_filter}
        for fast in (10, 20)
        for slow in (50, 100)
        for trend_filter in (150, 200)
        if fast < slow
    ]

    def generate_signals(self, df: pd.DataFrame) -> pd.Series:
        close = df["close"]
        fast_ema = EMAIndicator(close, window=self.params["fast"]).ema_indicator()
        slow_ema = EMAIndicator(close, window=self.params["slow"]).ema_indicator()
        trend_ema = EMAIndicator(close, window=self.params["trend_filter"]).ema_indicator()

        bullish_cross = (fast_ema > slow_ema) & (fast_ema.shift(1) <= slow_ema.shift(1))
        bearish_cross = (fast_ema < slow_ema) & (fast_ema.shift(1) >= slow_ema.shift(1))

        long_ok = close > trend_ema
        short_ok = close < trend_ema

        long_entry = bullish_cross & long_ok
        long_exit_to_flat = bullish_cross & ~long_ok
        short_entry = bearish_cross & short_ok
        short_exit_to_flat = bearish_cross & ~short_ok

        events = [
            (long_exit_to_flat, Signal.FLAT),
            (short_exit_to_flat, Signal.FLAT),
            (long_entry, Signal.LONG),
            (short_entry, Signal.SHORT),
        ]
        return self._events_to_position_series(df.index, events)
