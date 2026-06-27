from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path

import pandas as pd
import typer

from btc_bot.backtest.report import evaluate_strategy, render_markdown_report, write_report
from btc_bot.config import settings
from btc_bot.data.loader import load_ohlcv
from btc_bot.strategies.registry import STRATEGIES

DEFAULT_REPORT_PATH = Path("reports/backtests/strategy_comparison.md")


def _parse_date(value: str) -> datetime:
    return datetime.strptime(value, "%Y-%m-%d").replace(tzinfo=timezone.utc)


def select_strategy(
    start: str = typer.Option(..., help="Start date, YYYY-MM-DD (UTC)."),
    end: str = typer.Option(..., help="End date, YYYY-MM-DD (UTC)."),
    symbol: str = typer.Option(settings.bybit_symbol, help="Bybit symbol."),
    category: str = typer.Option(settings.bybit_category, help="Bybit product category."),
    interval: str = typer.Option(settings.bybit_interval, help="Bybit kline interval code."),
    train_days: int = typer.Option(120, help="Walk-forward train window length, in days."),
    test_days: int = typer.Option(30, help="Walk-forward test window length, in days."),
    lockbox_days: int = typer.Option(60, help="Held-out lockbox window length, in days, taken from the end."),
    selection_metric: str = typer.Option("sortino", help="Metric used to rank candidates and folds."),
    output: Path = typer.Option(DEFAULT_REPORT_PATH, help="Path to write the markdown report."),
) -> None:
    """Walk-forward evaluate every registered strategy and write a ranked comparison report."""
    df = load_ohlcv(symbol, category, interval, _parse_date(start), _parse_date(end))

    train_period = pd.Timedelta(days=train_days)
    test_period = pd.Timedelta(days=test_days)
    lockbox_period = pd.Timedelta(days=lockbox_days)

    evaluations = []
    for name, strategy_cls in STRATEGIES.items():
        typer.echo(f"Evaluating {name}...")
        evaluations.append(
            evaluate_strategy(
                df,
                strategy_cls,
                strategy_cls.param_grid,
                train_period,
                test_period,
                lockbox_period,
                selection_metric=selection_metric,
            )
        )

    report_path = write_report(evaluations, output, selection_metric=selection_metric)
    typer.echo(f"\nReport written to {report_path}\n")
    typer.echo(render_markdown_report(evaluations, selection_metric=selection_metric))
