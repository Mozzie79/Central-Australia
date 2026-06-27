"""Paginated historical kline fetch.

Bybit's kline endpoint returns at most `limit` rows per call (max 1000),
newest-first, within a [start, end] window. To fetch a long history we walk
the window backwards from `end`, each time requesting up to the oldest
timestamp seen so far, until we reach `start` or the API stops returning new
rows.
"""

from __future__ import annotations

import pandas as pd

from btc_bot.data import bybit_client

OHLCV_COLUMNS = ["open_time", "open", "high", "low", "close", "volume", "turnover"]


def fetch_klines(
    symbol: str,
    category: str,
    interval: str,
    start_ms: int,
    end_ms: int,
    limit: int = 1000,
) -> pd.DataFrame:
    """Fetch all klines in [start_ms, end_ms], returned ascending by open_time, deduped."""
    rows: list[list[str]] = []
    cursor_end = end_ms

    while cursor_end > start_ms:
        page = bybit_client.get_kline(
            symbol=symbol,
            category=category,
            interval=interval,
            start=start_ms,
            end=cursor_end,
            limit=limit,
        )
        if not page:
            break
        rows.extend(page)
        oldest_ts = min(int(row[0]) for row in page)
        if oldest_ts >= cursor_end:
            # No progress would be made on the next page; stop to avoid looping forever.
            break
        cursor_end = oldest_ts - 1

    return _rows_to_dataframe(rows, start_ms, end_ms)


def _rows_to_dataframe(rows: list[list[str]], start_ms: int, end_ms: int) -> pd.DataFrame:
    if not rows:
        return pd.DataFrame(columns=OHLCV_COLUMNS).set_index("open_time")

    df = pd.DataFrame(rows, columns=OHLCV_COLUMNS)
    df["open_time"] = pd.to_numeric(df["open_time"]).astype("int64")
    for col in ["open", "high", "low", "close", "volume", "turnover"]:
        df[col] = pd.to_numeric(df[col])

    df = df.drop_duplicates(subset="open_time")
    df = df[(df["open_time"] >= start_ms) & (df["open_time"] <= end_ms)]
    df = df.sort_values("open_time").set_index("open_time")
    df.index = pd.to_datetime(df.index, unit="ms", utc=True)
    df.index.name = "open_time"
    return df
