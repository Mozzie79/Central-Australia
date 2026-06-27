from __future__ import annotations

import typer

from btc_bot.cli.backtest_cmd import backtest
from btc_bot.cli.fetch_data_cmd import fetch_data
from btc_bot.cli.select_cmd import select_strategy
from btc_bot.logging_setup import configure_logging

app = typer.Typer(help="BTC strategy backtesting toolkit.")
app.command("fetch-data")(fetch_data)
app.command("backtest")(backtest)
app.command("select-strategy")(select_strategy)


@app.callback()
def _setup() -> None:
    configure_logging()


if __name__ == "__main__":
    app()
