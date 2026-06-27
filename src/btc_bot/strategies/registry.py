from __future__ import annotations

from btc_bot.strategies.base import Strategy
from btc_bot.strategies.bollinger_breakout import BollingerBreakoutStrategy
from btc_bot.strategies.ema_crossover import EmaCrossoverStrategy
from btc_bot.strategies.macd_momentum import MacdMomentumStrategy
from btc_bot.strategies.rsi_mean_reversion import RsiMeanReversionStrategy

STRATEGIES: dict[str, type[Strategy]] = {
    EmaCrossoverStrategy.name: EmaCrossoverStrategy,
    RsiMeanReversionStrategy.name: RsiMeanReversionStrategy,
    BollingerBreakoutStrategy.name: BollingerBreakoutStrategy,
    MacdMomentumStrategy.name: MacdMomentumStrategy,
}


def get_strategy(name: str, **params) -> Strategy:
    if name not in STRATEGIES:
        raise KeyError(f"Unknown strategy '{name}'. Available: {list(STRATEGIES)}")
    return STRATEGIES[name](**params)
