"""Standardized metrics extracted from backtesting.py's stats Series.

backtesting.py already computes Sharpe/Sortino/Calmar correctly from the
equity curve (period-adjusted, annualized), so this module reuses that
rather than re-deriving the math — it just gives the rest of the codebase a
stable, typed shape to depend on instead of indexing into a raw pandas
Series by string keys everywhere.
"""

from __future__ import annotations

from dataclasses import dataclass

import pandas as pd


def _safe_float(value: object) -> float:
    try:
        return float(value)  # type: ignore[arg-type]
    except (TypeError, ValueError):
        return float("nan")


@dataclass(frozen=True)
class BacktestMetrics:
    return_pct: float
    sharpe: float
    sortino: float
    calmar: float
    max_drawdown_pct: float
    win_rate_pct: float
    profit_factor: float
    num_trades: int

    @classmethod
    def from_stats(cls, stats: pd.Series) -> "BacktestMetrics":
        return cls(
            return_pct=_safe_float(stats.get("Return [%]")),
            sharpe=_safe_float(stats.get("Sharpe Ratio")),
            sortino=_safe_float(stats.get("Sortino Ratio")),
            calmar=_safe_float(stats.get("Calmar Ratio")),
            max_drawdown_pct=_safe_float(stats.get("Max. Drawdown [%]")),
            win_rate_pct=_safe_float(stats.get("Win Rate [%]")),
            profit_factor=_safe_float(stats.get("Profit Factor")),
            num_trades=int(stats.get("# Trades") or 0),
        )

    def score(self, metric: str) -> float:
        value = getattr(self, metric)
        return value if value == value else float("-inf")  # NaN-safe: NaN never wins selection
