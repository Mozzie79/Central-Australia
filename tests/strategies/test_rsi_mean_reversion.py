from __future__ import annotations

from btc_bot.strategies.base import Signal
from btc_bot.strategies.rsi_mean_reversion import RsiMeanReversionStrategy


def test_chop_fires_both_directions_in_non_trending_regime(choppy_df):
    # Looser oversold/overbought than production defaults so this fixture's RSI
    # swings clear both thresholds; the point of this test is the ADX-gated
    # entry/exit logic, not reproducing the exact default parameter values.
    sig = RsiMeanReversionStrategy(oversold=35, overbought=65).generate_signals(choppy_df)

    assert (sig == Signal.LONG).sum() > 0
    assert (sig == Signal.SHORT).sum() > 0


def test_no_trades_when_adx_threshold_is_zero(choppy_df):
    # adx_threshold=0 means "non_trending" (adx < 0) is never true, so the
    # regime filter should suppress every entry regardless of RSI extremes.
    sig = RsiMeanReversionStrategy(oversold=35, overbought=65, adx_threshold=0).generate_signals(choppy_df)
    assert (sig == Signal.FLAT).all()


def test_signal_index_matches_input(choppy_df):
    sig = RsiMeanReversionStrategy().generate_signals(choppy_df)
    assert list(sig.index) == list(choppy_df.index)
