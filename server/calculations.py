"""The arithmetic and the saved calculations.

`calculate()` does the arithmetic for the four operators and refuses division by
zero. `save_calculation()` writes a successful calculation to SQLite and
`list_calculations()` reads the history newest first.
"""

from datetime import datetime, timezone
from pathlib import Path

from db import connect

OPERATORS = ("+", "−", "×", "÷")

DIVISION_BY_ZERO = "Division by zero is not allowed"


class CalculationError(ValueError):
    """A calculation the API refuses with 400."""


def calculate(left: float, operator: str, right: float) -> float:
    """Do the arithmetic for `left operator right`, refusing division by zero."""
    if operator == "+":
        return left + right
    if operator == "−":
        return left - right
    if operator == "×":
        return left * right
    if operator == "÷":
        if right == 0:
            raise CalculationError(DIVISION_BY_ZERO)
        return left / right
    raise CalculationError(f"Unknown operator: {operator}")


def format_number(value: float) -> str:
    """Show a whole number without a trailing `.0`, as the display does."""
    if value == int(value):
        return str(int(value))
    return repr(value)


def expression_for(left: float, operator: str, right: float) -> str:
    """The calculation as the User sees it, such as `7 × 8`."""
    return f"{format_number(left)} {operator} {format_number(right)}"


def save_calculation(
    left: float, operator: str, right: float, path: Path | None = None
) -> dict:
    """Do the arithmetic, save the row and return the saved calculation."""
    result = calculate(left, operator, right)
    expression = expression_for(left, operator, right)
    created_at = datetime.now(timezone.utc).isoformat()

    with connect(path) as connection:
        cursor = connection.execute(
            "INSERT INTO calculations (expression, result, created_at) VALUES (?, ?, ?)",
            (expression, result, created_at),
        )
        connection.commit()
        row_id = cursor.lastrowid

    return {
        "id": row_id,
        "expression": expression,
        "result": result,
        "created_at": created_at,
    }


def list_calculations(path: Path | None = None) -> list[dict]:
    """The saved calculations, newest first."""
    with connect(path) as connection:
        rows = connection.execute(
            "SELECT id, expression, result, created_at FROM calculations ORDER BY id DESC"
        ).fetchall()

    return [
        {
            "id": row["id"],
            "expression": row["expression"],
            "result": row["result"],
            "created_at": row["created_at"],
        }
        for row in rows
    ]
