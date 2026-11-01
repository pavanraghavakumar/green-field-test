# SQLite API Calculator

A small calculator web app: a React screen built with Vite, a Python API with FastAPI and Uvicorn, and SQLite for the saved calculations. It adds, subtracts, multiplies and divides two numbers, shows the result at once, and keeps a history of every successful calculation.

## Build and run

Install: npm install
Test: npm test
Run locally: yes
Dev: npm run dev
Port variable: PORT
Health path: /api/health
Deploy: local-server

- `npm install` installs the web app's packages and the Python API's packages into `server/.venv`.
- `npm test` runs the API tests with pytest and the web app tests with vitest once each and exits.
- `npm run dev` creates the SQLite file if it is missing, starts the API on a port it picks, and starts Vite on `PORT`, which forwards `/api` to the API.

The API answers the health check at `GET /api/health` with `200` and `{"status": "ok"}`.

## Layout

- `web/` — the React web app, built with Vite. `web/src/styles.css` holds the shared colours and font as CSS variables.
- `server/` — the FastAPI API. `server/db.py` creates the SQLite file and the `calculations` table on startup.
- `e2e/` — end-to-end journeys with `@playwright/test`, run only against the running app.
