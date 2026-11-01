"""Shared fixtures: each test runs the app on its own SQLite file in a temporary folder."""

import sys
from pathlib import Path

import pytest

SERVER_DIR = Path(__file__).resolve().parents[1]
if str(SERVER_DIR) not in sys.path:
    sys.path.insert(0, str(SERVER_DIR))


@pytest.fixture
def database(tmp_path, monkeypatch):
    """Point the app at a SQLite file in a temporary folder that pytest removes."""
    path = tmp_path / "calculations.db"
    monkeypatch.setenv("DATABASE_PATH", str(path))
    return path


@pytest.fixture
def client(database):
    """A TestClient whose startup creates the temporary SQLite file and its table."""
    from fastapi.testclient import TestClient

    from main import app

    with TestClient(app) as test_client:
        yield test_client
