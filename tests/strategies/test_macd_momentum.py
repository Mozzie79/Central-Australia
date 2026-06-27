from __future__ import annotations

from btc_bot.strategies.base import Signal
from btc_bot.strategies.macd_momentum import MacdMomentumStrategy


def test_uptrend_never_shorts_and_long_dominates_in_trend(uptrend_df):
    sig = MacdMomentumStrategy().generate_signals(uptrend_df)
    trend_part = sig.iloc[260:]

    assert (trend_part == Signal.SHORT).sum() == 0
    assert (trend_part == Signal.LONG).mean() > 0.5


def test_downtrend_never_longs_and_short_dominates_in_trend(downtrend_df):
    sig = MacdMomentumStrategy().generate_signals(downtrend_df)
    trend_part = sig.iloc[260:]

    assert (trend_part == Signal.LONG).sum() == 0
    assert (trend_part == Signal.SHORT).mean() > 0.5


def test_signal_index_matches_input(uptrend_df):
    sig = MacdMomentumStrategy().generate_signals(uptrend_df)
    assert list(sig.index) == list(uptrend_df.index)
