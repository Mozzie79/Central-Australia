from __future__ import annotations

from datetime import datetime, timezone

import typer

from btc_bot.backtest import engine
from btc_bot.backtest.costs import estimate_funding_cost
from btc_bot.backtest.metrics import BacktestMetrics
from btc_bot.config import settings
from btc_bot.data.loader import load_ohlcv
from btc_bot.strategies.registry import get_strategy


def _parse_date(value: str) -> datetime:
    return datetime.strptime(value, "%Y-%m-%d").replace(tzinfo=timezone.utc)


def backtest(
    strategy: str = typer.Option(..., help="Strategy name (see registry)."),
    start: str = typer.Option(..., help="Start date, YYYY-MM-DD (UTC)."),
    end: str = typer.Option(..., help="End date, YYYY-MM-DD (UTC)."),
    symbol: str = typer.Option(settings.bybit_symbol, help="Bybit symbol."),
    category: str = typer.Option(settings.bybit_category, help="Bybit product category."),
    interval: str = typer.Option(settings.bybit_interval, help="Bybit kline interval code."),
    cash: float = typer.Option(10_000.0, help="Starting cash for the backtest."),
) -> None:
    """Run one strategy's backtest over [start, end] and print its metrics."""
    df = load_ohlcv(symbol, category, interval, _parse_date(start), _parse_date(end))
    strat = get_strategy(strategy)
    stats = engine.run_backtest(df, strat, cash=cash)
    metrics = BacktestMetrics.from_stats(stats)

    typer.echo(f"Strategy: {strategy}  Params: {strat.params}")
    typer.echo(f"Bars: {len(df)}  Range: {df.index.min()} -> {df.index.max()}")
    typer.echo(f"Return: {metrics.return_pct:.2f}%  Sharpe: {metrics.sharpe:.2f}  Sortino: {metrics.sortino:.2f}")
    typer.echo(f"Calmar: {metrics.calmar:.2f}  Max DD: {metrics.max_drawdown_pct:.2f}%")
    typer.echo(f"Win rate: {metrics.win_rate_pct:.1f}%  Profit factor: {metrics.profit_factor:.2f}")
    typer.echo(f"Trades: {metrics.num_trades}")

    trades = stats.get("_trades")
    if trades is not None and len(trades):
        funding_cost = estimate_funding_cost(trades)
        typer.echo(f"Estimated funding cost (not included above): ${funding_cost:,.2f}")
