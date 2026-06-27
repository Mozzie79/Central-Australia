from __future__ import annotations

import pytest

from btc_bot.strategies.bollinger_breakout import BollingerBreakoutStrategy
from btc_bot.strategies.ema_crossover import EmaCrossoverStrategy
from btc_bot.strategies.macd_momentum import MacdMomentumStrategy
from btc_bot.strategies.registry import STRATEGIES, get_strategy
from btc_bot.strategies.rsi_mean_reversion import RsiMeanReversionStrategy


def test_all_strategies_registered_under_their_own_name():
    for cls in (EmaCrossoverStrategy, RsiMeanReversionStrategy, BollingerBreakoutStrategy, MacdMomentumStrategy):
        assert STRATEGIES[cls.name] is cls


def test_get_strategy_returns_instance_of_correct_class():
    strat = get_strategy("ema_crossover")
    assert isinstance(strat, EmaCrossoverStrategy)


def test_get_strategy_passes_through_params():
    strat = get_strategy("ema_crossover", fast=5, slow=20)
    assert strat.params["fast"] == 5
    assert strat.params["slow"] == 20


def test_get_strategy_raises_key_error_for_unknown_name():
    with pytest.raises(KeyError):
        get_strategy("not_a_real_strategy")
