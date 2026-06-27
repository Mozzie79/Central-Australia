"""Single entrypoint used by everything downstream (CLI, backtests, tests)
to get OHLCV data in a consistent shape, using the on-disk cache when present.
"""

from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path

import pandas as pd

from btc_bot.data import cache, fetch


def _to_ms(dt: datetime) -> int:
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return int(dt.timestamp() * 1000)


def load_ohlcv(
    symbol: str,
    category: str,
    interval: str,
    start: datetime,
    end: datetime,
    cache_dir: Path = cache.DEFAULT_CACHE_DIR,
) -> pd.DataFrame:
    """Return OHLCV data for [start, end], fetching from Bybit only on a cache miss."""
    start_ms, end_ms = _to_ms(start), _to_ms(end)
    path = cache.cache_path(symbol, category, interval, start_ms, end_ms, cache_dir)

    cached = cache.load(path)
    if cached is not None:
        return cached

    df = fetch.fetch_klines(symbol, category, interval, start_ms, end_ms)
    cache.save(df, path)
    return df
