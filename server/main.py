"""The FastAPI app of the SQLite API Calculator."""

from contextlib import asynccontextmanager

from fastapi import FastAPI

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
