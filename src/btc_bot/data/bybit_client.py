"""Thin wrapper around pybit's public market-data endpoints.

Only the public kline endpoint is used in this phase, which needs no API
key/secret. Mainnet's public data is used regardless of where a future bot
ultimately trades, since it's the deepest/most complete history.
"""

from __future__ import annotations

import logging

from pybit.unified_trading import HTTP
from tenacity import retry, retry_if_exception_type, stop_after_attempt, wait_exponential

logger = logging.getLogger(__name__)

# Bybit v5 returns retCode 10006 for rate-limit-exceeded errors.
RATE_LIMIT_RET_CODE = 10006


class BybitRateLimitError(Exception):
    pass


class BybitApiError(Exception):
    pass


def _client() -> HTTP:
    return HTTP(testnet=False)


@retry(
    retry=retry_if_exception_type((BybitRateLimitError, ConnectionError, TimeoutError)),
    wait=wait_exponential(multiplier=1, min=1, max=30),
    stop=stop_after_attempt(5),
    reraise=True,
)
def get_kline(
    symbol: str,
    category: str,
    interval: str,
    start: int,
    end: int,
    limit: int = 1000,
) -> list[list[str]]:
    """Fetch one page of klines. Returns raw rows, newest-first, as Bybit returns them."""
    client = _client()
    resp = client.get_kline(
        category=category,
        symbol=symbol,
        interval=interval,
        start=start,
        end=end,
        limit=limit,
    )
    ret_code = resp.get("retCode")
    if ret_code == RATE_LIMIT_RET_CODE:
        logger.warning("Bybit rate limit hit, retrying with backoff")
        raise BybitRateLimitError(resp.get("retMsg"))
    if ret_code != 0:
        raise BybitApiError(f"Bybit API error {ret_code}: {resp.get('retMsg')}")
    return resp["result"]["list"]
