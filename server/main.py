"""The FastAPI app of the SQLite API Calculator."""

import json
from contextlib import asynccontextmanager
from typing import Any

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from calculations import (
    DIVISION_BY_ZERO,
    OPERATORS,
    CalculationError,
    list_calculations,
    save_calculation,
)
from db import init_db


@asynccontextmanager
async def lifespan(_app: FastAPI):
    # Create the SQLite file and its table before the first request.
    init_db()
    yield


app = FastAPI(title="SQLite API Calculator", lifespan=lifespan)


@app.get("/api/health")
def health() -> dict[str, str]:
    """Answer the health check so the app's availability can be watched."""
    return {"status": "ok"}


def _is_number(value: Any) -> bool:
    """A JSON number, but not a bool (which Python counts as an int)."""
    return isinstance(value, (int, float)) and not isinstance(value, bool)


@app.post("/api/calculations")
async def create_calculation(request: Request):
    """Do the arithmetic, save the calculation and answer 201 with the saved row."""
    try:
        body = json.loads(await request.body())
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JSONResponse(status_code=400, content={"error": "Invalid calculation"})

    if not isinstance(body, dict):
        return JSONResponse(status_code=400, content={"error": "Invalid calculation"})

    left = body.get("left")
    operator = body.get("operator")
    right = body.get("right")

    if not _is_number(left) or not _is_number(right):
        return JSONResponse(
            status_code=400, content={"error": "Left and right must be numbers"}
        )
    if operator not in OPERATORS:
        return JSONResponse(status_code=400, content={"error": "Unknown operator"})

    try:
        saved = save_calculation(left, operator, right)
    except CalculationError as error:
        return JSONResponse(status_code=400, content={"error": str(error)})

    return JSONResponse(status_code=201, content=saved)


@app.get("/api/history")
def history() -> list[dict]:
    """The saved calculations, newest first."""
    return list_calculations()
