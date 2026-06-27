"""Shared strategy interface.

Every strategy turns an OHLCV DataFrame into a Series of `Signal` values
aligned to the same index, representing the desired position to be in as of
each bar's close. Position sizing and stop-loss are *not* the strategy's
job — they live in `btc_bot.risk` and are applied uniformly by the backtest
adapter and (later) the live order manager, so comparing strategies isolates
signal quality rather than differing risk implementations.
"""

from __future__ import annotations

from enum import Enum

import pandas as pd


class Signal(Enum):
    LONG = "LONG"
    SHORT = "SHORT"
    FLAT = "FLAT"


class Strategy:
    name: str = "base"
    default_params: dict = {}
    # Parameter grid used by walk-forward optimization/selection (btc_bot.backtest).
    param_grid: dict = {}

    def __init__(self, **params):
        self.params = {**self.default_params, **params}

    def generate_signals(self, df: pd.DataFrame) -> pd.Series:
        """Return a pd.Series of Signal enum values, indexed like df."""
        raise NotImplementedError

    @staticmethod
    def _events_to_position_series(
        index: pd.Index, events: list[tuple[pd.Series, Signal]]
    ) -> pd.Series:
        """Build a position series from sparse (boolean_mask, Signal) entry/exit
        events (applied in order, later entries win on overlapping bars),
        forward-filled between events and defaulting to FLAT before the
        first event."""
        raw = pd.Series([None] * len(index), index=index, dtype=object)
        for mask, signal in events:
            raw.loc[mask] = signal
        return raw.ffill().fillna(Signal.FLAT)
