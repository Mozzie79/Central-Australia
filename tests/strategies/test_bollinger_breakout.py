from __future__ import annotations

from btc_bot.strategies.base import Signal
from btc_bot.strategies.bollinger_breakout import BollingerBreakoutStrategy


def test_volume_confirmed_breakout_enters_long_and_persists(breakout_df):
    sig = BollingerBreakoutStrategy().generate_signals(breakout_df)

    # LONG fires right at the breakout bar and holds for a while; it eventually
    # exits to FLAT once the rolling mid-band catches up to the new price level
    # (this is the strategy's designed exit, not noise), but should never flip
    # to SHORT since price never reverses below the lower band in this fixture.
    assert sig.iloc[80] == Signal.LONG
    assert (sig.iloc[80:95] == Signal.LONG).all()
    assert (sig.iloc[:80] == Signal.FLAT).all()
    assert (sig == Signal.SHORT).sum() == 0


def test_breakout_without_volume_confirmation_does_not_enter(breakout_df):
    df = breakout_df.copy()
    df["volume"] = 100.0  # remove the volume spike on the breakout bar
    sig = BollingerBreakoutStrategy().generate_signals(df)

    assert (sig == Signal.LONG).sum() == 0
    assert (sig == Signal.SHORT).sum() == 0


def test_signal_index_matches_input(breakout_df):
    sig = BollingerBreakoutStrategy().generate_signals(breakout_df)
    assert list(sig.index) == list(breakout_df.index)
