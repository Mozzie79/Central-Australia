from __future__ import annotations

from datetime import datetime, timezone

import typer

from btc_bot.config import settings
from btc_bot.data.loader import load_ohlcv


def _parse_date(value: str) -> datetime:
    return datetime.strptime(value, "%Y-%m-%d").replace(tzinfo=timezone.utc)


def fetch_data(
    start: str = typer.Option(..., help="Start date, YYYY-MM-DD (UTC)."),
    end: str = typer.Option(..., help="End date, YYYY-MM-DD (UTC)."),
    symbol: str = typer.Option(settings.bybit_symbol, help="Bybit symbol."),
    category: str = typer.Option(settings.bybit_category, help="Bybit product category."),
    interval: str = typer.Option(settings.bybit_interval, help="Bybit kline interval code."),
) -> None:
    """Fetch OHLCV history, writing/reading the on-disk parquet cache."""
    df = load_ohlcv(symbol, category, interval, _parse_date(start), _parse_date(end))
    typer.echo(f"Loaded {len(df)} bars for {symbol} [{interval}] from {start} to {end}.")
    typer.echo(f"Range in data: {df.index.min()} -> {df.index.max()}")
