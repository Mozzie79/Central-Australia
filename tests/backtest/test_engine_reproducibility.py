from __future__ import annotations

from btc_bot.backtest.engine import run_backtest
from btc_bot.strategies.ema_crossover import EmaCrossoverStrategy


def test_same_inputs_produce_identical_stats(uptrend_df):
    stats_a = run_backtest(uptrend_df, EmaCrossoverStrategy())
    stats_b = run_backtest(uptrend_df, EmaCrossoverStrategy())

    for key in ("Return [%]", "Sharpe Ratio", "Sortino Ratio", "Max. Drawdown [%]", "# Trades"):
        a, b = stats_a.get(key), stats_b.get(key)
        if a != a and b != b:  # both NaN
            continue
        assert a == b, f"{key} differs between runs: {a} vs {b}"


def test_backtest_produces_at_least_one_trade_on_a_clean_trend(uptrend_df):
    stats = run_backtest(uptrend_df, EmaCrossoverStrategy())
    assert stats["# Trades"] >= 1
