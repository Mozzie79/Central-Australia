from __future__ import annotations

import numpy as np
import pandas as pd
import pytest

from btc_bot.risk.stop_loss import atr, long_stop_price, short_stop_price


def test_long_stop_price_is_below_entry():
    assert long_stop_price(entry_price=30_000, atr_value=200, multiplier=2.0) == 30_000 - 400


def test_short_stop_price_is_above_entry():
    assert short_stop_price(entry_price=30_000, atr_value=200, multiplier=2.0) == 30_000 + 400


def test_atr_is_nonnegative_and_nan_during_warmup():
    rng = np.random.default_rng(0)
    n = 50
    close = 100 + rng.normal(0, 1, n).cumsum()
    high = close + rng.uniform(1, 3, n)
    low = close - rng.uniform(1, 3, n)
    series = atr(pd.Series(high), pd.Series(low), pd.Series(close), period=14)

    assert series.iloc[0] != series.iloc[0] or series.iloc[0] >= 0  # NaN or non-negative
    valid = series.dropna()
    assert len(valid) > 0
    assert (valid >= 0).all()


def test_atr_reflects_higher_volatility():
    n = 60
    idx = pd.RangeIndex(n)
    calm_close = pd.Series(100.0, index=idx)
    calm_high = calm_close + 1.0
    calm_low = calm_close - 1.0

    volatile_close = pd.Series(100.0, index=idx)
    volatile_high = volatile_close + 10.0
    volatile_low = volatile_close - 10.0

    calm_atr = atr(calm_high, calm_low, calm_close, period=14).iloc[-1]
    volatile_atr = atr(volatile_high, volatile_low, volatile_close, period=14).iloc[-1]

    assert volatile_atr > calm_atr
