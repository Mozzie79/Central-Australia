# btc-bot — BTC Strategy Backtester (Phase 1)

Backtests several candidate trading strategies for BTCUSDT (Bybit linear
perpetual, 4h candles) against real historical price data, scores them with
risk-adjusted metrics, validates with walk-forward out-of-sample testing, and
produces a comparison report. **No live trading code is included in this
phase** — that's a deliberate, separate follow-up once a strategy is chosen.

## Setup

```bash
pip install -e ".[dev]"
```

No API keys are required for anything in this phase — historical kline data
comes from Bybit's public market-data endpoint.

## Usage

```bash
# Fetch and cache historical BTCUSDT 4h candles
btc-bot fetch-data --start 2021-01-01 --end 2024-12-31

# Backtest a single strategy
btc-bot backtest --strategy ema_crossover --start 2021-01-01 --end 2024-12-31

# Run all strategies through walk-forward validation and produce a comparison report
btc-bot select-strategy --start 2021-01-01 --end 2024-12-31
```

Reports are written to `reports/backtests/`.

## Strategies

1. **EMA crossover** — trend-following, fast/slow EMA cross filtered by a
   200-period trend EMA.
2. **RSI mean-reversion** — fades RSI extremes, but only in non-trending
   regimes (ADX filter), so it doesn't fight strong trends.
3. **Bollinger breakout** — trades band breaks confirmed by a volume spike.
4. **MACD momentum** — MACD/signal cross with histogram-slope and zero-line
   confirmation.

## Important caveat

No backtested strategy is a guarantee of future profitability. The
walk-forward report shows out-of-sample performance across multiple rolling
windows plus a final untouched lockbox period specifically so this can't be
glossed over — read the full report, not just the headline ranking, before
deciding to trade real money on any of this.

## Testing

```bash
pytest --cov=src/btc_bot
```

All tests run offline against synthetic or cached fixture data — no network
access or API keys required.
