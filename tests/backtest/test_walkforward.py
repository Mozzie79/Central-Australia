from __future__ import annotations

import pandas as pd

from btc_bot.backtest.walkforward import (
    aggregate_out_of_sample,
    generate_fold_windows,
    walk_forward_validate,
)
from btc_bot.strategies.ema_crossover import EmaCrossoverStrategy


def test_fold_windows_do_not_overlap_train_and_test():
    start = pd.Timestamp("2023-01-01", tz="UTC")
    end = pd.Timestamp("2023-12-01", tz="UTC")
    windows = generate_fold_windows(start, end, pd.Timedelta(days=60), pd.Timedelta(days=20))

    assert len(windows) > 0
    for train_start, train_end, test_start, test_end in windows:
        assert train_start < train_end
        assert train_end == test_start  # test window starts exactly where train ends
        assert test_start < test_end
        assert test_end <= end


def test_fold_windows_advance_by_test_period_each_step():
    start = pd.Timestamp("2023-01-01", tz="UTC")
    end = pd.Timestamp("2023-12-01", tz="UTC")
    test_period = pd.Timedelta(days=20)
    windows = generate_fold_windows(start, end, pd.Timedelta(days=60), test_period)

    for (train_start_a, *_), (train_start_b, *_) in zip(windows, windows[1:]):
        assert train_start_b - train_start_a == test_period


def test_walk_forward_validate_uses_disjoint_data_per_fold(uptrend_df):
    # Small fast/slow/trend_filter so the indicators warm up within a 15-day
    # train window (the EMA-crossover production param_grid's trend_filter of
    # 150-200 bars wouldn't fit in a window this small).
    candidate_params = [{"fast": 5, "slow": 20, "trend_filter": 30}]
    folds = walk_forward_validate(
        uptrend_df,
        EmaCrossoverStrategy,
        candidate_params,
        train_period=pd.Timedelta(days=15),
        test_period=pd.Timedelta(days=10),
        min_bars=10,
    )

    assert len(folds) > 0
    for fold in folds:
        assert fold.train_end <= fold.test_start
        assert fold.test_start < fold.test_end
        # The single candidate param set should be the chosen one (only option).
        assert fold.best_params == candidate_params[0]


def test_aggregate_out_of_sample_empty_folds_returns_nan_safe_defaults():
    agg = aggregate_out_of_sample([])
    assert agg["num_folds"] == 0
    assert agg["total_trades"] == 0
    assert agg["mean_score"] != agg["mean_score"]  # NaN
