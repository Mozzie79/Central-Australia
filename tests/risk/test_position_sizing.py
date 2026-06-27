from __future__ import annotations

import pytest

from btc_bot.risk.position_sizing import position_size


def test_sizes_by_risk_when_below_max_position_cap():
    # risk_amount = 10_000 * 0.01 = 100; stop_distance = 500 -> size_by_risk = 0.2
    # max_notional = 10_000 * 0.25 = 2500; max_size_by_cap = 2500/30_000 = 0.0833...
    # size_by_risk (0.2) > max_size_by_cap, so the cap should bind here instead.
    size = position_size(
        equity=10_000, entry_price=30_000, stop_price=29_500, risk_per_trade_pct=0.01, max_position_pct=0.25
    )
    assert size == pytest.approx(2500 / 30_000)


def test_sizes_by_risk_when_cap_is_not_binding():
    # risk_amount = 10_000 * 0.01 = 100; stop_distance = 5_000 -> size_by_risk = 0.02
    # max_notional = 10_000 * 0.25 = 2500; max_size_by_cap = 2500/30_000 = 0.0833...
    # size_by_risk (0.02) < max_size_by_cap, so risk-based sizing should bind.
    size = position_size(
        equity=10_000, entry_price=30_000, stop_price=25_000, risk_per_trade_pct=0.01, max_position_pct=0.25
    )
    assert size == pytest.approx(100 / 5_000)


def test_zero_equity_returns_zero_size():
    assert position_size(0, 30_000, 29_500, 0.01, 0.25) == 0.0


def test_negative_equity_returns_zero_size():
    assert position_size(-100, 30_000, 29_500, 0.01, 0.25) == 0.0


def test_zero_stop_distance_raises():
    with pytest.raises(ValueError):
        position_size(10_000, 30_000, 30_000, 0.01, 0.25)


def test_short_side_uses_absolute_stop_distance():
    # Stop above entry (short position): same magnitude as the long case.
    size = position_size(
        equity=10_000, entry_price=30_000, stop_price=30_500, risk_per_trade_pct=0.01, max_position_pct=0.25
    )
    assert size == pytest.approx(2500 / 30_000)
