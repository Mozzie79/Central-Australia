from __future__ import annotations

import pandas as pd

from btc_bot.backtest.metrics import BacktestMetrics
from btc_bot.backtest.report import (
    StrategyEvaluation,
    evaluate_strategy,
    render_markdown_report,
    write_report,
)
from btc_bot.strategies.bollinger_breakout import BollingerBreakoutStrategy


def _metrics(**overrides) -> BacktestMetrics:
    base = dict(
        return_pct=10.0,
        sharpe=1.0,
        sortino=1.5,
        calmar=0.8,
        max_drawdown_pct=-5.0,
        win_rate_pct=55.0,
        profit_factor=1.4,
        num_trades=40,
    )
    base.update(overrides)
    return BacktestMetrics(**base)


def _survivor(name: str, mean_score: float) -> StrategyEvaluation:
    return StrategyEvaluation(
        name=name,
        aggregate={
            "mean_score": mean_score,
            "profitable_fold_fraction": 0.75,
            "num_folds": 4,
            "max_fold_drawdown_pct": -10.0,
            "total_trades": 40,
        },
        final_params={"fast": 10},
        lockbox_metrics=_metrics(sortino=mean_score),
        disqualified=False,
    )


def _disqualified(name: str, reason: str) -> StrategyEvaluation:
    return StrategyEvaluation(
        name=name,
        aggregate={
            "mean_score": float("nan"),
            "profitable_fold_fraction": float("nan"),
            "num_folds": 0,
            "max_fold_drawdown_pct": float("nan"),
            "total_trades": 0,
        },
        final_params={},
        lockbox_metrics=_metrics(num_trades=0),
        disqualified=True,
        disqualification_reasons=[reason],
    )


def test_render_report_ranks_survivors_above_disqualified_by_mean_score():
    weaker = _survivor("weak_strategy", mean_score=1.0)
    stronger = _survivor("strong_strategy", mean_score=2.0)
    disqualified = _disqualified("bad_strategy", "too few trades")

    report = render_markdown_report([weaker, disqualified, stronger])

    assert report.index("strong_strategy") < report.index("weak_strategy")
    assert report.index("weak_strategy") < report.index("bad_strategy")
    assert "Selected strategy: `strong_strategy`" in report
    assert "too few trades" not in report  # only shown when nobody survives


def test_render_report_shows_disqualification_reasons_when_nobody_survives():
    report = render_markdown_report([_disqualified("bad_strategy", "too few trades")])
    assert "No strategy passed the disqualification filters" in report
    assert "too few trades" in report


def test_render_report_includes_caveat_section():
    report = render_markdown_report([_survivor("strategy_a", mean_score=1.0)])
    assert "not a guarantee of future performance" in report


def test_write_report_creates_file_with_rendered_content(tmp_path):
    evaluations = [_survivor("strategy_a", mean_score=1.0)]
    path = write_report(evaluations, tmp_path / "nested" / "report.md")

    assert path.exists()
    assert path.read_text() == render_markdown_report(evaluations)


def test_evaluate_strategy_disqualifies_when_no_folds_fit_in_window(choppy_df):
    # train/test windows far larger than the fixture's history -> zero folds.
    evaluation = evaluate_strategy(
        choppy_df,
        BollingerBreakoutStrategy,
        BollingerBreakoutStrategy.param_grid,
        train_period=pd.Timedelta(days=365),
        test_period=pd.Timedelta(days=365),
        lockbox_period=pd.Timedelta(days=10),
    )
    assert evaluation.disqualified
    assert "no walk-forward folds" in evaluation.disqualification_reasons[0]
