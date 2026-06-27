"""Typed runtime configuration.

This phase (backtesting only) never requires Bybit API credentials —
the kline endpoint used for historical data is public. Credential
fields are included now so the config shape is stable for the later
live-execution phase, but they default to empty and nothing in this
phase reads them.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    bybit_symbol: str = "BTCUSDT"
    bybit_category: str = "linear"
    bybit_interval: str = "240"  # 4h candles, per Bybit kline interval codes

    # Risk defaults for the later live-execution phase.
    risk_per_trade_pct: float = 0.01
    max_position_pct: float = 0.25
    max_daily_loss_pct: float = 0.03
    atr_stop_multiplier: float = 2.0

    # Backtest cost model defaults.
    taker_fee_pct: float = 0.00055
    slippage_bps: float = 3.0

    log_level: str = "INFO"

    # Unused in this phase; kept for forward-compatible config shape.
    bybit_api_key: str = ""
    bybit_api_secret: str = ""
    bybit_testnet: bool = True


settings = Settings()
