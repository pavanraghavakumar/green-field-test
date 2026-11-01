"""Settings of the API, read from the environment.

DATABASE_PATH is where the SQLite file lives; it defaults to `calculations.db`
beside this file. PORT is read by Uvicorn's start command, not here.
"""

import os
from pathlib import Path

SERVER_DIR = Path(__file__).resolve().parent


def database_path() -> Path:
    """The SQLite file the API reads and writes."""
    configured = os.environ.get("DATABASE_PATH")
    if configured:
        return Path(configured).expanduser().resolve()
    return SERVER_DIR / "calculations.db"
