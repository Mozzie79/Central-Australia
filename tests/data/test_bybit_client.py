from __future__ import annotations

from unittest.mock import patch

import pytest

from btc_bot.data.bybit_client import BybitApiError, BybitRateLimitError, get_kline


def test_get_kline_returns_rows_on_success():
    resp = {"retCode": 0, "retMsg": "OK", "result": {"list": [["1", "2", "3", "4", "5", "6", "7"]]}}
    with patch("btc_bot.data.bybit_client._client") as mock_client:
        mock_client.return_value.get_kline.return_value = resp
        rows = get_kline(symbol="BTCUSDT", category="linear", interval="240", start=0, end=1000)
    assert rows == resp["result"]["list"]


def test_get_kline_raises_api_error_on_non_rate_limit_failure():
    resp = {"retCode": 10001, "retMsg": "invalid request"}
    with patch("btc_bot.data.bybit_client._client") as mock_client:
        mock_client.return_value.get_kline.return_value = resp
        with pytest.raises(BybitApiError):
            get_kline(symbol="BTCUSDT", category="linear", interval="240", start=0, end=1000)


def test_get_kline_retries_then_raises_on_persistent_rate_limit():
    resp = {"retCode": 10006, "retMsg": "rate limit exceeded"}
    with patch("btc_bot.data.bybit_client._client") as mock_client, \
            patch("btc_bot.data.bybit_client.get_kline.retry.wait", lambda *_: 0):
        mock_client.return_value.get_kline.return_value = resp
        with pytest.raises(BybitRateLimitError):
            get_kline(symbol="BTCUSDT", category="linear", interval="240", start=0, end=1000)
    assert mock_client.return_value.get_kline.call_count == 5
