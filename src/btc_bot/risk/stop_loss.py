"""ATR-based stop-loss price calculation, shared by backtest exits and the
later live execution module so strategy comparisons use identical risk logic."""

from __future__ import annotations

import pandas as pd
from ta.volatility import AverageTrueRange


def atr(high: pd.Series, low: pd.Series, close: pd.Series, period: int = 14) -> pd.Series:
    return AverageTrueRange(high=high, low=low, close=close, window=period).average_true_range()


def long_stop_price(entry_price: float, atr_value: float, multiplier: float) -> float:
    return entry_price - multiplier * atr_value


def short_stop_price(entry_price: float, atr_value: float, multiplier: float) -> float:
    return entry_price + multiplier * atr_value
