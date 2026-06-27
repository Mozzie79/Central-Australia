from __future__ import annotations

import pandas as pd
from ta.trend import MACD

from btc_bot.strategies.base import Signal, Strategy


class MacdMomentumStrategy(Strategy):
    """Momentum confirmation: MACD/signal cross, filtered by histogram slope
    (momentum accelerating) and zero-line position (confirms broader bias),
    making it slower to enter/exit than a raw EMA cross."""

    name = "macd_momentum"
    default_params = {"fast": 12, "slow": 26, "signal": 9}
    param_grid = [
        {"fast": 12, "slow": 26, "signal": 9},
        {"fast": 8, "slow": 21, "signal": 5},
        {"fast": 5, "slow": 35, "signal": 5},
    ]

    def generate_signals(self, df: pd.DataFrame) -> pd.Series:
        macd_ind = MACD(
            df["close"],
            window_fast=self.params["fast"],
            window_slow=self.params["slow"],
            window_sign=self.params["signal"],
        )
        macd_line = macd_ind.macd()
        signal_line = macd_ind.macd_signal()
        histogram = macd_ind.macd_diff()

        bullish_cross = (macd_line > signal_line) & (macd_line.shift(1) <= signal_line.shift(1))
        bearish_cross = (macd_line < signal_line) & (macd_line.shift(1) >= signal_line.shift(1))

        histogram_rising = histogram > histogram.shift(1)
        histogram_falling = histogram < histogram.shift(1)

        long_ok = (macd_line > 0) & histogram_rising
        short_ok = (macd_line < 0) & histogram_falling

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
