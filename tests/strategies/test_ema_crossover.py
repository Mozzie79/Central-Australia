from __future__ import annotations

from btc_bot.strategies.base import Signal
from btc_bot.strategies.ema_crossover import EmaCrossoverStrategy


def test_uptrend_ends_long_and_never_shorts_in_trend(uptrend_df):
    sig = EmaCrossoverStrategy().generate_signals(uptrend_df)
    trend_part = sig.iloc[260:]

    assert sig.iloc[-1] == Signal.LONG
    assert (trend_part == Signal.SHORT).sum() == 0
    assert (trend_part == Signal.LONG).mean() > 0.5


def test_downtrend_ends_short_and_never_longs_in_trend(downtrend_df):
    sig = EmaCrossoverStrategy().generate_signals(downtrend_df)
    trend_part = sig.iloc[260:]

    assert sig.iloc[-1] == Signal.SHORT
    assert (trend_part == Signal.LONG).sum() == 0
    assert (trend_part == Signal.SHORT).mean() > 0.5


def test_signal_index_matches_input(uptrend_df):
    sig = EmaCrossoverStrategy().generate_signals(uptrend_df)
    assert list(sig.index) == list(uptrend_df.index)
