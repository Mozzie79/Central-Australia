"""Walk-forward validation harness.

Rolls a train/test window forward across the full history. For each fold,
candidate parameters are optimized on the train window only, then the
*chosen* parameters (never re-fit) are evaluated out-of-sample on the
immediately following test window. This directly guards against reporting
an in-sample-optimized number as if it were predictive: the metric that
matters for strategy selection is the aggregate of out-of-sample fold
results, not any single backtest.
"""

from __future__ import annotations

from dataclasses import dataclass

import pandas as pd

from btc_bot.backtest import engine
from btc_bot.backtest.metrics import BacktestMetrics
from btc_bot.strategies.base import Strategy


@dataclass(frozen=True)
class WalkForwardFold:
    train_start: pd.Timestamp
    train_end: pd.Timestamp
    test_start: pd.Timestamp
    test_end: pd.Timestamp
    best_params: dict
    train_metrics: BacktestMetrics
    test_metrics: BacktestMetrics


def generate_fold_windows(
    start: pd.Timestamp, end: pd.Timestamp, train_period: pd.Timedelta, test_period: pd.Timedelta
) -> list[tuple[pd.Timestamp, pd.Timestamp, pd.Timestamp, pd.Timestamp]]:
    windows = []
    train_start = start
    while True:
        train_end = train_start + train_period
        test_start = train_end
        test_end = test_start + test_period
        if test_end > end:
            break
        windows.append((train_start, train_end, test_start, test_end))
        train_start = train_start + test_period
    return windows


def walk_forward_validate(
    df: pd.DataFrame,
    strategy_cls: type[Strategy],
    candidate_params: list[dict],
    train_period: pd.Timedelta,
    test_period: pd.Timedelta,
    selection_metric: str = "sortino",
    min_bars: int = 30,
) -> list[WalkForwardFold]:
    windows = generate_fold_windows(df.index.min(), df.index.max(), train_period, test_period)
    folds: list[WalkForwardFold] = []

    for train_start, train_end, test_start, test_end in windows:
        train_df = df.loc[(df.index >= train_start) & (df.index < train_end)]
        test_df = df.loc[(df.index >= test_start) & (df.index < test_end)]
        if len(train_df) < min_bars or len(test_df) < min_bars:
            continue

        best_params, best_train_metrics, best_score = None, None, float("-inf")
        for params in candidate_params:
            stats = engine.run_backtest(train_df, strategy_cls(**params))
            train_metrics = BacktestMetrics.from_stats(stats)
            score = train_metrics.score(selection_metric)
            if score > best_score:
                best_params, best_train_metrics, best_score = params, train_metrics, score

        if best_params is None:
            continue

        test_stats = engine.run_backtest(test_df, strategy_cls(**best_params))
        test_metrics = BacktestMetrics.from_stats(test_stats)

        folds.append(
            WalkForwardFold(
                train_start, train_end, test_start, test_end, best_params, best_train_metrics, test_metrics
            )
        )

    return folds


def aggregate_out_of_sample(folds: list[WalkForwardFold], metric: str = "sortino") -> dict:
    if not folds:
        return {
            "mean_score": float("nan"),
            "profitable_fold_fraction": float("nan"),
            "num_folds": 0,
            "max_fold_drawdown_pct": float("nan"),
            "total_trades": 0,
        }
    scores = [f.test_metrics.score(metric) for f in folds]
    profitable = [f.test_metrics.return_pct > 0 for f in folds]
    drawdowns = [f.test_metrics.max_drawdown_pct for f in folds]
    return {
        "mean_score": sum(scores) / len(scores),
        "profitable_fold_fraction": sum(profitable) / len(profitable),
        "num_folds": len(folds),
        "max_fold_drawdown_pct": min(drawdowns),  # drawdowns are negative; min = worst
        "total_trades": sum(f.test_metrics.num_trades for f in folds),
    }
