from __future__ import annotations

from pathlib import Path
from unittest.mock import patch

import pandas as pd
import pytest

from btc_bot.data import cache, fetch, loader


def _row(open_time_ms: int, price: float = 100.0) -> list[str]:
    return [str(open_time_ms), str(price), str(price + 1), str(price - 1), str(price), "10", "1000"]


def test_fetch_klines_paginates_backward_and_dedupes():
    # Bybit returns newest-first pages; simulate two pages that overlap by one row.
    page_1 = [_row(3000), _row(2000), _row(1000)]
    page_2 = [_row(1000), _row(0)]

    calls = {"n": 0}

    def fake_get_kline(**kwargs):
        calls["n"] += 1
        return page_1 if calls["n"] == 1 else page_2

    with patch("btc_bot.data.fetch.bybit_client.get_kline", side_effect=fake_get_kline):
        df = fetch.fetch_klines("BTCUSDT", "linear", "240", start_ms=0, end_ms=3000)

    assert calls["n"] == 2
    assert list(df.index) == sorted(df.index)  # ascending
    assert len(df) == 4  # 0, 1000, 2000, 3000 deduped


def test_fetch_klines_filters_to_requested_range():
    page = [_row(5000), _row(3000), _row(1000)]
    with patch("btc_bot.data.fetch.bybit_client.get_kline", return_value=page):
        df = fetch.fetch_klines("BTCUSDT", "linear", "240", start_ms=2000, end_ms=5000)

    lo = pd.Timestamp(2000, unit="ms", tz="UTC")
    hi = pd.Timestamp(5000, unit="ms", tz="UTC")
    assert ((df.index >= lo) & (df.index <= hi)).all()


def test_fetch_klines_returns_empty_frame_when_no_data():
    with patch("btc_bot.data.fetch.bybit_client.get_kline", return_value=[]):
        df = fetch.fetch_klines("BTCUSDT", "linear", "240", start_ms=0, end_ms=1000)
    assert df.empty
    assert list(df.columns) == [c for c in fetch.OHLCV_COLUMNS if c != "open_time"]


def test_cache_round_trip(tmp_path: Path):
    idx = pd.date_range("2023-01-01", periods=3, freq="4h", tz="UTC", name="open_time")
    df = pd.DataFrame({"open": [1.0, 2.0, 3.0], "close": [1.0, 2.0, 3.0]}, index=idx)
    path = cache.cache_path("BTCUSDT", "linear", "240", 0, 1000, cache_dir=tmp_path)

    assert cache.load(path) is None
    cache.save(df, path)
    loaded = cache.load(path)

    assert loaded is not None
    pd.testing.assert_frame_equal(loaded, df, check_freq=False)


def test_load_ohlcv_skips_fetch_on_cache_hit(tmp_path: Path):
    from datetime import datetime, timezone

    start, end = datetime(2023, 1, 1, tzinfo=timezone.utc), datetime(2023, 1, 2, tzinfo=timezone.utc)
    idx = pd.date_range("2023-01-01", periods=2, freq="4h", tz="UTC", name="open_time")
    cached_df = pd.DataFrame({"open": [1.0, 2.0], "close": [1.0, 2.0]}, index=idx)

    start_ms, end_ms = loader._to_ms(start), loader._to_ms(end)
    path = cache.cache_path("BTCUSDT", "linear", "240", start_ms, end_ms, tmp_path)
    cache.save(cached_df, path)

    with patch("btc_bot.data.loader.fetch.fetch_klines") as mock_fetch:
        result = loader.load_ohlcv("BTCUSDT", "linear", "240", start, end, cache_dir=tmp_path)

    mock_fetch.assert_not_called()
    pd.testing.assert_frame_equal(result, cached_df, check_freq=False)


def test_load_ohlcv_fetches_and_caches_on_miss(tmp_path: Path):
    from datetime import datetime, timezone

    start, end = datetime(2023, 1, 1, tzinfo=timezone.utc), datetime(2023, 1, 2, tzinfo=timezone.utc)
    idx = pd.date_range("2023-01-01", periods=2, freq="4h", tz="UTC", name="open_time")
    fetched_df = pd.DataFrame({"open": [1.0, 2.0], "close": [1.0, 2.0]}, index=idx)

    with patch("btc_bot.data.loader.fetch.fetch_klines", return_value=fetched_df) as mock_fetch:
        result = loader.load_ohlcv("BTCUSDT", "linear", "240", start, end, cache_dir=tmp_path)

    mock_fetch.assert_called_once()
    pd.testing.assert_frame_equal(result, fetched_df)

    start_ms, end_ms = loader._to_ms(start), loader._to_ms(end)
    path = cache.cache_path("BTCUSDT", "linear", "240", start_ms, end_ms, tmp_path)
    assert path.exists()
