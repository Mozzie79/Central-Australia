"""Fixed-fractional position sizing.

Position size is derived from how much account equity should be at risk if
the stop-loss is hit, not from leverage. This keeps strategy comparison in
the backtester and (later) live sizing consistent and risk-based rather than
leverage-based.
"""

from __future__ import annotations


def position_size(
    equity: float,
    entry_price: float,
    stop_price: float,
    risk_per_trade_pct: float,
    max_position_pct: float,
) -> float:
    """Return position size in base-asset units (e.g. BTC).

    Raises ValueError if entry_price == stop_price (zero stop distance is
    not a valid sizing input).
    """
    if entry_price == stop_price:
        raise ValueError("entry_price and stop_price must differ to size a position")
    if equity <= 0:
        return 0.0

    stop_distance = abs(entry_price - stop_price)
    risk_amount = equity * risk_per_trade_pct
    size_by_risk = risk_amount / stop_distance

    max_notional = equity * max_position_pct
    max_size_by_cap = max_notional / entry_price

    return min(size_by_risk, max_size_by_cap)
