"""The SQLite file and its schema.

`init_db()` creates the file and the `calculations` table when they are missing,
and the API calls it on startup.
"""

import sqlite3
from pathlib import Path

from config import database_path

SCHEMA = """
CREATE TABLE IF NOT EXISTS calculations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  expression TEXT NOT NULL,
  result REAL NOT NULL,
  created_at TEXT NOT NULL
);
"""


def connect(path: Path | None = None) -> sqlite3.Connection:
    """Open a connection to the SQLite file, creating its folder when needed."""
    target = Path(path) if path is not None else database_path()
    target.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(target)
    connection.row_factory = sqlite3.Row
    return connection


def init_db(path: Path | None = None) -> None:
    """Create the SQLite file and the `calculations` table if they are missing."""
    with connect(path) as connection:
        connection.executescript(SCHEMA)
        connection.commit()
