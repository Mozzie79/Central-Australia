"""Parquet on-disk cache for fetched OHLCV data, keyed by symbol/category/interval/range.

Caching makes backtests reproducible offline: once a date range has been
fetched, every subsequent run reads the same cached file rather than hitting
Bybit's API again.
"""

from __future__ import annotations

from pathlib import Path

import pandas as pd

DEFAULT_CACHE_DIR = Path(__file__).resolve().parents[3] / "data" / "cache"


def cache_path(
    symbol: str,
    category: str,
    interval: str,
    start_ms: int,
    end_ms: int,
    cache_dir: Path = DEFAULT_CACHE_DIR,
) -> Path:
    filename = f"{symbol}_{category}_{interval}_{start_ms}_{end_ms}.parquet"
    return cache_dir / filename


def load(path: Path) -> pd.DataFrame | None:
    if not path.exists():
        return None
    return pd.read_parquet(path)


def save(df: pd.DataFrame, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    df.to_parquet(path)
