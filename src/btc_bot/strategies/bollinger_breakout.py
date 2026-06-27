from __future__ import annotations

import pandas as pd
from ta.volatility import BollingerBands

from btc_bot.strategies.base import Signal, Strategy


class BollingerBreakoutStrategy(Strategy):
    """Momentum breakout: trades a close beyond the Bollinger Bands, confirmed
    by a volume spike to filter out low-conviction false breakouts."""

    name = "bollinger_breakout"
    default_params = {"period": 20, "std_dev": 2.0, "volume_multiplier": 1.5}
    param_grid = [{"volume_multiplier": m} for m in (1.2, 1.5, 2.0)]

    def generate_signals(self, df: pd.DataFrame) -> pd.Series:
        bb = BollingerBands(df["close"], window=self.params["period"], window_dev=self.params["std_dev"])
        upper = bb.bollinger_hband()
        lower = bb.bollinger_lband()
        mid = bb.bollinger_mavg()

        avg_volume = df["volume"].rolling(self.params["period"]).mean()
        volume_confirmed = df["volume"] > self.params["volume_multiplier"] * avg_volume

        long_entry = (df["close"] > upper) & (df["close"].shift(1) <= upper.shift(1)) & volume_confirmed
        short_entry = (df["close"] < lower) & (df["close"].shift(1) >= lower.shift(1)) & volume_confirmed

        crossed_mid = (df["close"] - mid) * (df["close"].shift(1) - mid.shift(1)) < 0

        events = [
            (crossed_mid, Signal.FLAT),
            (long_entry, Signal.LONG),
            (short_entry, Signal.SHORT),
        ]
        return self._events_to_position_series(df.index, events)
