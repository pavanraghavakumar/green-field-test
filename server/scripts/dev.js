// Runs the API alone with Uvicorn, on PORT when it is set.
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const serverDir = path.resolve(__dirname, "..");
const isWindows = process.platform === "win32";
const venvPython = path.join(serverDir, ".venv", isWindows ? "Scripts" : "bin", isWindows ? "python.exe" : "python");

if (!fs.existsSync(venvPython)) {
  console.error("server/.venv is missing; run `npm install` first.");
  process.exit(1);
}

const port = process.env.PORT || "8000";
const child = spawn(venvPython, ["-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", port], {
  stdio: "inherit",
  cwd: serverDir,
});

child.on("exit", (code) => process.exit(code === null ? 1 : code));
