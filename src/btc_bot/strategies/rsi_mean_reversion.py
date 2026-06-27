from __future__ import annotations

import pandas as pd
from ta.momentum import RSIIndicator
from ta.trend import ADXIndicator

from btc_bot.strategies.base import Signal, Strategy


class RsiMeanReversionStrategy(Strategy):
    """Fades RSI extremes, but only in non-trending regimes (ADX filter) so it
    doesn't fight strong trends the way naive mean-reversion would."""

    name = "rsi_mean_reversion"
    default_params = {
        "rsi_period": 14,
        "oversold": 30,
        "overbought": 70,
        "adx_period": 14,
        "adx_threshold": 20,
    }
    # adx_threshold is the most impactful knob (how strict the "non-trending" regime
    # filter is); rsi_period/oversold/overbought held at sane defaults to bound the
    # grid search to a tractable number of combinations.
    param_grid = [{"adx_threshold": t} for t in (15, 20, 25)]

    def generate_signals(self, df: pd.DataFrame) -> pd.Series:
        rsi = RSIIndicator(df["close"], window=self.params["rsi_period"]).rsi()
        adx = ADXIndicator(
            df["high"], df["low"], df["close"], window=self.params["adx_period"]
        ).adx()

        oversold = self.params["oversold"]
        overbought = self.params["overbought"]
        non_trending = adx < self.params["adx_threshold"]

        long_entry = (rsi > oversold) & (rsi.shift(1) <= oversold) & non_trending
        short_entry = (rsi < overbought) & (rsi.shift(1) >= overbought) & non_trending
        midline_exit = (rsi - 50) * (rsi.shift(1) - 50) < 0  # crossed 50 since last bar

        events = [
            (midline_exit, Signal.FLAT),
            (long_entry, Signal.LONG),
            (short_entry, Signal.SHORT),
        ]
        return self._events_to_position_series(df.index, events)
