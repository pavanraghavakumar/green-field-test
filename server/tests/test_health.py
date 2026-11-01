"""The health check answers 200 with {"status": "ok"}."""

import sqlite3


def test_health_answers_ok(client):
    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_startup_creates_the_calculations_table(client, database):
    assert database.exists()

    with sqlite3.connect(database) as connection:
        columns = [row[1] for row in connection.execute("PRAGMA table_info(calculations)")]

    assert columns == ["id", "expression", "result", "created_at"]
