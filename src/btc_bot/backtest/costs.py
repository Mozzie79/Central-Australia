"""Cost model for backtests.

Taker fee and slippage are applied directly by `backtesting.py`'s `commission`
and `spread` parameters (wired up in `engine.run_backtest`) since those are
native, per-fill costs the engine already simulates correctly.

Funding rate is different: Bybit perpetuals settle funding every 8h
(00:00/08:00/16:00 UTC) for *held* positions, and `backtesting.py` has no
native hook for a cost that accrues over time rather than per-fill. Rather
than monkeypatch the broker, this module estimates total funding cost/credit
post-hoc from the closed-trade list and reports it as a separate, clearly
labeled line item — an approximation using a flat assumed average funding
rate, not a precise historical replay.
"""

from __future__ import annotations

import pandas as pd

DEFAULT_FUNDING_RATE_PER_8H = 0.0001  # 0.01%, a typical long-run BTC perpetual average


def _funding_settlements_in_window(entry: pd.Timestamp, exit_: pd.Timestamp) -> int:
    if pd.isna(entry) or pd.isna(exit_) or exit_ <= entry:
        return 0
    settlements = pd.date_range(entry.floor("8h"), exit_.ceil("8h"), freq="8h")
    return int(((settlements > entry) & (settlements <= exit_)).sum())


def estimate_funding_cost(
    trades: pd.DataFrame, funding_rate_per_8h: float = DEFAULT_FUNDING_RATE_PER_8H
) -> float:
    """Approximate total funding paid (positive) or received (negative is not
    modeled here — longs and shorts are both charged for simplicity, since
    funding sign flips unpredictably; this is a conservative cost estimate,
    not a precise PnL adjustment)."""
    if trades.empty:
        return 0.0

    total = 0.0
    for _, trade in trades.iterrows():
        periods = _funding_settlements_in_window(trade["EntryTime"], trade["ExitTime"])
        notional = abs(trade["Size"]) * trade["EntryPrice"]
        total += periods * notional * funding_rate_per_8h
    return total
