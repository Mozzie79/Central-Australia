from __future__ import annotations

import math

import pandas as pd

from btc_bot.backtest.metrics import BacktestMetrics


def _stats(**overrides) -> pd.Series:
    base = {
        "Return [%]": 12.5,
        "Sharpe Ratio": 1.2,
        "Sortino Ratio": 1.8,
        "Calmar Ratio": 0.9,
        "Max. Drawdown [%]": -8.0,
        "Win Rate [%]": 55.0,
        "Profit Factor": 1.6,
        "# Trades": 20,
    }
    base.update(overrides)
    return pd.Series(base)


def test_from_stats_maps_fields_correctly():
    m = BacktestMetrics.from_stats(_stats())
    assert m.return_pct == 12.5
    assert m.sharpe == 1.2
    assert m.sortino == 1.8
    assert m.calmar == 0.9
    assert m.max_drawdown_pct == -8.0
    assert m.win_rate_pct == 55.0
    assert m.profit_factor == 1.6
    assert m.num_trades == 20


def test_from_stats_handles_missing_fields_as_nan():
    m = BacktestMetrics.from_stats(pd.Series({}))
    assert math.isnan(m.return_pct)
    assert math.isnan(m.sharpe)
    assert m.num_trades == 0


def test_score_returns_metric_value():
    m = BacktestMetrics.from_stats(_stats())
    assert m.score("sortino") == 1.8
    assert m.score("return_pct") == 12.5


def test_score_treats_nan_as_negative_infinity_so_it_never_wins_selection():
    m = BacktestMetrics.from_stats(_stats(**{"Sortino Ratio": float("nan")}))
    assert m.score("sortino") == float("-inf")
