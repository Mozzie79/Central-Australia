from __future__ import annotations

from pathlib import Path
from unittest.mock import patch

import numpy as np
import pandas as pd
from typer.testing import CliRunner

from btc_bot.cli.main import app

runner = CliRunner()


def _synthetic_df() -> pd.DataFrame:
    rng = np.random.default_rng(7)
    n = 600
    idx = pd.date_range("2023-01-01", periods=n, freq="4h", tz="UTC")
    flat = np.full(260, 20000.0) + rng.normal(0, 1.0, 260)
    trend = 20000.0 + 15.0 * np.arange(1, n - 259) + rng.normal(0, 3.0, n - 260)
    close = np.concatenate([flat, trend])
    high = close + rng.uniform(2, 8, n)
    low = close - rng.uniform(2, 8, n)
    open_ = close + rng.normal(0, 2, n)
    volume = rng.uniform(100, 200, n)
    return pd.DataFrame({"open": open_, "high": high, "low": low, "close": close, "volume": volume}, index=idx)


def test_fetch_data_command_reports_loaded_bars():
    with patch("btc_bot.data.loader.fetch.fetch_klines", return_value=_synthetic_df()), \
            patch("btc_bot.data.loader.cache.load", return_value=None), \
            patch("btc_bot.data.loader.cache.save"):
        result = runner.invoke(
            app, ["fetch-data", "--start", "2023-01-01", "--end", "2023-04-01"]
        )

    assert result.exit_code == 0, result.output
    assert "Loaded 600 bars" in result.output


def test_backtest_command_reports_metrics():
    with patch("btc_bot.data.loader.fetch.fetch_klines", return_value=_synthetic_df()), \
            patch("btc_bot.data.loader.cache.load", return_value=None), \
            patch("btc_bot.data.loader.cache.save"):
        result = runner.invoke(
            app,
            [
                "backtest",
                "--strategy",
                "ema_crossover",
                "--start",
                "2023-01-01",
                "--end",
                "2023-04-01",
            ],
        )

    assert result.exit_code == 0, result.output
    assert "Strategy: ema_crossover" in result.output
    assert "Sharpe" in result.output
    assert "Trades" in result.output


def test_select_strategy_command_writes_report(tmp_path: Path):
    output_path = tmp_path / "strategy_comparison.md"

    with patch("btc_bot.data.loader.fetch.fetch_klines", return_value=_synthetic_df()), \
            patch("btc_bot.data.loader.cache.load", return_value=None), \
            patch("btc_bot.data.loader.cache.save"):
        result = runner.invoke(
            app,
            [
                "select-strategy",
                "--start",
                "2023-01-01",
                "--end",
                "2023-04-01",
                "--train-days",
                "20",
                "--test-days",
                "10",
                "--lockbox-days",
                "10",
                "--output",
                str(output_path),
            ],
        )

    assert result.exit_code == 0, result.output
    assert output_path.exists()
    report = output_path.read_text()
    assert "Strategy Comparison Report" in report
    assert "not a guarantee of future performance" in report
