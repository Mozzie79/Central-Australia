"""Builds the strategy comparison report: runs walk-forward validation for
each candidate strategy, applies disqualification filters, ranks survivors,
and renders a markdown report. Selection is never silent — the report names
the winner, shows its lockbox (held-out) result, and states the caveat that
no backtest is a guarantee of future performance.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path

import pandas as pd

from btc_bot.backtest import engine
from btc_bot.backtest.metrics import BacktestMetrics
from btc_bot.backtest.walkforward import aggregate_out_of_sample, walk_forward_validate
from btc_bot.strategies.base import Strategy

MAX_DRAWDOWN_CAP_PCT = -30.0
MIN_TOTAL_TRADES = 30
MIN_PROFITABLE_FOLD_FRACTION = 0.5


@dataclass
class StrategyEvaluation:
    name: str
    aggregate: dict
    final_params: dict
    lockbox_metrics: BacktestMetrics
    disqualified: bool
    disqualification_reasons: list[str] = field(default_factory=list)


def _select_final_params(
    df: pd.DataFrame, strategy_cls: type[Strategy], candidate_params: list[dict], metric: str
) -> dict:
    best_params: dict = {}
    best_score = float("-inf")
    for params in candidate_params:
        stats = engine.run_backtest(df, strategy_cls(**params))
        score = BacktestMetrics.from_stats(stats).score(metric)
        if score > best_score:
            best_params, best_score = params, score
    return best_params


def evaluate_strategy(
    df: pd.DataFrame,
    strategy_cls: type[Strategy],
    candidate_params: list[dict],
    train_period: pd.Timedelta,
    test_period: pd.Timedelta,
    lockbox_period: pd.Timedelta,
    selection_metric: str = "sortino",
) -> StrategyEvaluation:
    split_point = df.index.max() - lockbox_period
    wf_df = df.loc[df.index <= split_point]
    lockbox_df = df.loc[df.index > split_point]

    folds = walk_forward_validate(
        wf_df, strategy_cls, candidate_params, train_period, test_period, selection_metric
    )
    aggregate = aggregate_out_of_sample(folds, selection_metric)

    final_params = _select_final_params(wf_df, strategy_cls, candidate_params, selection_metric)
    lockbox_stats = engine.run_backtest(lockbox_df, strategy_cls(**final_params))
    lockbox_metrics = BacktestMetrics.from_stats(lockbox_stats)

    reasons = []
    if aggregate["num_folds"] == 0:
        reasons.append("no walk-forward folds produced (insufficient data for the configured windows)")
    else:
        if aggregate["max_fold_drawdown_pct"] < MAX_DRAWDOWN_CAP_PCT:
            reasons.append(
                f"a walk-forward fold drew down {aggregate['max_fold_drawdown_pct']:.1f}%, "
                f"beyond the {MAX_DRAWDOWN_CAP_PCT:.0f}% cap"
            )
        if aggregate["total_trades"] < MIN_TOTAL_TRADES:
            reasons.append(
                f"only {aggregate['total_trades']} total out-of-sample trades, "
                f"below the minimum of {MIN_TOTAL_TRADES}"
            )
        if aggregate["profitable_fold_fraction"] < MIN_PROFITABLE_FOLD_FRACTION:
            reasons.append(
                f"only {aggregate['profitable_fold_fraction']:.0%} of out-of-sample folds were "
                f"profitable, below the {MIN_PROFITABLE_FOLD_FRACTION:.0%} threshold"
            )

    return StrategyEvaluation(
        name=strategy_cls.name,
        aggregate=aggregate,
        final_params=final_params,
        lockbox_metrics=lockbox_metrics,
        disqualified=bool(reasons),
        disqualification_reasons=reasons,
    )


def rank_strategies(evaluations: list[StrategyEvaluation]) -> list[StrategyEvaluation]:
    survivors = sorted(
        (e for e in evaluations if not e.disqualified), key=lambda e: e.aggregate["mean_score"], reverse=True
    )
    disqualified = [e for e in evaluations if e.disqualified]
    return survivors + disqualified


def render_markdown_report(evaluations: list[StrategyEvaluation], selection_metric: str = "sortino") -> str:
    ranked = rank_strategies(evaluations)
    metric_label = selection_metric.title()

    lines = ["# Strategy Comparison Report", ""]
    lines.append(
        f"| Strategy | Status | OOS {metric_label} | Profitable folds | Worst fold DD % | "
        "Total OOS trades | Lockbox Return % |"
    )
    lines.append("|---|---|---|---|---|---|---|")
    for e in ranked:
        status = "DISQUALIFIED" if e.disqualified else "OK"
        agg = e.aggregate
        lines.append(
            f"| {e.name} | {status} | {agg['mean_score']:.2f} | "
            f"{agg['profitable_fold_fraction']:.0%} ({agg['num_folds']} folds) | "
            f"{agg['max_fold_drawdown_pct']:.1f}% | {agg['total_trades']} | "
            f"{e.lockbox_metrics.return_pct:.1f}% |"
        )
    lines.append("")

    survivors = [e for e in ranked if not e.disqualified]
    if survivors:
        winner = survivors[0]
        lines.append(f"## Selected strategy: `{winner.name}`")
        lines.append("")
        lines.append(f"Final parameters: `{winner.final_params}`")
        lines.append("")
        lines.append(
            f"Lockbox (held-out, never used for selection) performance: "
            f"Return {winner.lockbox_metrics.return_pct:.1f}%, "
            f"Sortino {winner.lockbox_metrics.sortino:.2f}, "
            f"Max DD {winner.lockbox_metrics.max_drawdown_pct:.1f}%, "
            f"{winner.lockbox_metrics.num_trades} trades."
        )
        lockbox_score = winner.lockbox_metrics.score(selection_metric)
        agg_score = winner.aggregate["mean_score"]
        if agg_score == agg_score and abs(lockbox_score - agg_score) > abs(agg_score) * 0.5 + 1:
            lines.append("")
            lines.append(
                "**Caution:** lockbox performance diverges materially from the walk-forward "
                "out-of-sample aggregate — treat this as a possible overfitting signal, not "
                "confirmation the strategy works."
            )
    else:
        lines.append("## No strategy passed the disqualification filters.")
        for e in ranked:
            lines.append(f"- `{e.name}`: {'; '.join(e.disqualification_reasons)}")

    lines.append("")
    lines.append("## Caveat")
    lines.append(
        "Backtested performance, including walk-forward out-of-sample results, is not a "
        "guarantee of future performance. Markets regime-shift. Recommended next step: run "
        "the selected strategy on Bybit testnet (paper funds) for an extended observation "
        "period before considering real money, regardless of how strong these numbers look."
    )
    return "\n".join(lines)


def write_report(
    evaluations: list[StrategyEvaluation], path: Path, selection_metric: str = "sortino"
) -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(render_markdown_report(evaluations, selection_metric))
    return path
