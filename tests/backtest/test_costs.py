from __future__ import annotations

import pandas as pd

from btc_bot.backtest.costs import estimate_funding_cost


def test_empty_trades_cost_zero():
    assert estimate_funding_cost(pd.DataFrame(columns=["EntryTime", "ExitTime", "Size", "EntryPrice"])) == 0.0


def test_funding_cost_charges_per_settlement_in_holding_window():
    # Held from 00:00 to 16:00 (UTC) crosses two settlements: 08:00 and 16:00.
    trades = pd.DataFrame(
        {
            "EntryTime": [pd.Timestamp("2023-01-01 00:00:00", tz="UTC")],
            "ExitTime": [pd.Timestamp("2023-01-01 16:00:00", tz="UTC")],
            "Size": [1.0],
            "EntryPrice": [30_000.0],
        }
    )
    cost = estimate_funding_cost(trades, funding_rate_per_8h=0.0001)
    assert cost == 2 * 30_000.0 * 0.0001


def test_funding_cost_scales_with_notional_and_is_nonnegative_for_short_size():
    trades = pd.DataFrame(
        {
            "EntryTime": [pd.Timestamp("2023-01-01 00:00:00", tz="UTC")],
            "ExitTime": [pd.Timestamp("2023-01-01 08:00:00", tz="UTC")],
            "Size": [-2.0],  # short position
            "EntryPrice": [10_000.0],
        }
    )
    cost = estimate_funding_cost(trades, funding_rate_per_8h=0.0001)
    assert cost == 1 * 20_000.0 * 0.0001


def test_no_settlement_crossed_means_zero_cost():
    trades = pd.DataFrame(
        {
            "EntryTime": [pd.Timestamp("2023-01-01 01:00:00", tz="UTC")],
            "ExitTime": [pd.Timestamp("2023-01-01 02:00:00", tz="UTC")],
            "Size": [1.0],
            "EntryPrice": [30_000.0],
        }
    )
    assert estimate_funding_cost(trades) == 0.0
