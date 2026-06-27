"""Synthetic OHLCV fixtures.

Each fixture is tuned (not just plausible-looking) so the targeted strategy
produces the expected signal: e.g. the trend fixtures use a long, low-noise
warm-up segment before the move starts so trend-filter EMAs and ADX have
settled by the time the move begins, and noise amplitude is kept small
relative to the per-bar trend slope so the move isn't noise-dominated.
"""

from __future__ import annotations

import numpy as np
import pandas as pd
import pytest


def _ohlcv_from_close(close: np.ndarray, rng: np.random.Generator, start: str, freq: str = "4h") -> pd.DataFrame:
    n = len(close)
    idx = pd.date_range(start, periods=n, freq=freq, tz="UTC")
    high = close + rng.uniform(2, 8, n)
    low = close - rng.uniform(2, 8, n)
    open_ = close + rng.normal(0, 2, n)
    volume = rng.uniform(100, 200, n)
    return pd.DataFrame({"open": open_, "high": high, "low": low, "close": close, "volume": volume}, index=idx)


@pytest.fixture
def uptrend_df() -> pd.DataFrame:
    """260 flat bars (warm up the 200-EMA trend filter / ADX), then a clean
    300-bar uptrend with noise much smaller than the per-bar slope."""
    rng = np.random.default_rng(1)
    flat = np.full(260, 20000.0) + rng.normal(0, 1.0, 260)
    trend = 20000.0 + 15.0 * np.arange(1, 301) + rng.normal(0, 3.0, 300)
    close = np.concatenate([flat, trend])
    return _ohlcv_from_close(close, rng, "2023-01-01")


@pytest.fixture
def downtrend_df() -> pd.DataFrame:
    """Mirror of uptrend_df: 260 flat bars then a clean 300-bar downtrend."""
    rng = np.random.default_rng(1)
    flat = np.full(260, 20000.0) + rng.normal(0, 1.0, 260)
    trend = 20000.0 - 15.0 * np.arange(1, 301) + rng.normal(0, 3.0, 300)
    close = np.concatenate([flat, trend])
    return _ohlcv_from_close(close, rng, "2023-01-01")


@pytest.fixture
def choppy_df() -> pd.DataFrame:
    """400 bars oscillating in a band (16-bar-period sine, amplitude tuned so
    RSI swings through both 35/65 thresholds while ADX stays in the
    non-trending regime almost throughout)."""
    rng = np.random.default_rng(3)
    n = 400
    t = np.arange(n)
    close = 20000.0 + 1300.0 * np.sin(2 * np.pi * t / 16) + rng.normal(0, 15.0, n)
    return _ohlcv_from_close(close, rng, "2023-01-01")


@pytest.fixture
def breakout_df() -> pd.DataFrame:
    """120 calm bars, then a sustained upward price jump at bar 80 paired
    with a volume spike on the breakout bar."""
    rng = np.random.default_rng(5)
    n = 120
    close = 20000.0 + rng.normal(0, 15.0, n)
    close[80:] += 600.0
    df = _ohlcv_from_close(close, rng, "2023-01-01")
    df.loc[df.index[80], "volume"] *= 3.0
    return df
