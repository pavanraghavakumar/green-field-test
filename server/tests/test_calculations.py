"""Saving a calculation and reading the history.

Each test runs on its own SQLite file in a temporary folder (the `client`
fixture), so it asserts only on the rows it writes.
"""

import sqlite3


def _post(client, left, operator, right):
    return client.post(
        "/api/calculations",
        json={"left": left, "operator": operator, "right": right},
    )


def test_addition(client):
    response = _post(client, 2, "+", 3)

    assert response.status_code == 201
    assert response.json()["result"] == 5
    assert response.json()["expression"] == "2 + 3"


def test_subtraction(client):
    response = _post(client, 9, "−", 4)

    assert response.status_code == 201
    assert response.json()["result"] == 5
    assert response.json()["expression"] == "9 − 4"


def test_multiplication(client):
    response = _post(client, 7, "×", 8)

    assert response.status_code == 201
    assert response.json()["result"] == 56
    assert response.json()["expression"] == "7 × 8"


def test_division(client):
    response = _post(client, 8, "÷", 2)

    assert response.status_code == 201
    assert response.json()["result"] == 4
    assert response.json()["expression"] == "8 ÷ 2"


def test_zero_divided_by_five(client):
    response = _post(client, 0, "÷", 5)

    assert response.status_code == 201
    assert response.json()["result"] == 0
    assert response.json()["expression"] == "0 ÷ 5"


def test_division_by_zero_is_refused_and_writes_nothing(client, database):
    response = _post(client, 5, "÷", 0)

    assert response.status_code == 400
    assert response.json() == {"error": "Division by zero is not allowed"}

    with sqlite3.connect(database) as connection:
        rows = connection.execute("SELECT COUNT(*) FROM calculations").fetchone()

    assert rows[0] == 0


def test_unknown_operator_is_refused(client):
    response = _post(client, 2, "%", 3)

    assert response.status_code == 400


def test_body_that_is_not_two_numbers_is_refused(client):
    response = client.post(
        "/api/calculations",
        json={"left": "two", "operator": "+", "right": 3},
    )

    assert response.status_code == 400


def test_missing_field_is_refused(client):
    response = client.post("/api/calculations", json={"left": 2, "operator": "+"})

    assert response.status_code == 400


def test_saved_row_holds_expression_result_and_utc_time(client, database):
    response = _post(client, 7, "×", 8)
    saved = response.json()

    with sqlite3.connect(database) as connection:
        connection.row_factory = sqlite3.Row
        row = connection.execute(
            "SELECT expression, result, created_at FROM calculations WHERE id = ?",
            (saved["id"],),
        ).fetchone()

    assert row["expression"] == "7 × 8"
    assert row["result"] == 56
    assert row["created_at"] == saved["created_at"]
    assert row["created_at"].endswith("+00:00")


def test_history_is_newest_first(client):
    first = _post(client, 2, "+", 3).json()
    second = _post(client, 7, "×", 8).json()

    response = client.get("/api/history")

    assert response.status_code == 200
    history = response.json()
    ids = [row["id"] for row in history]
    assert ids.index(second["id"]) < ids.index(first["id"])
    assert history[0]["expression"] == "7 × 8"
    assert history[0]["result"] == 56
