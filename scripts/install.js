// Creates the Python virtual environment in server/.venv and installs the API's
// packages there. `npm install` runs this after the web app's packages are in.
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const serverDir = path.join(root, "server");
const venvDir = path.join(serverDir, ".venv");
const isWindows = process.platform === "win32";
const venvPython = path.join(venvDir, isWindows ? "Scripts" : "bin", isWindows ? "python.exe" : "python");

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { stdio: "inherit", cwd: root, ...options });
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    process.exit(result.status === null ? 1 : result.status);
  }
}

function findPython() {
  const candidates = isWindows ? ["python", "py"] : ["python3", "python"];
  for (const candidate of candidates) {
    const probe = spawnSync(candidate, ["--version"], { stdio: "ignore" });
    if (!probe.error && probe.status === 0) {
      return candidate;
    }
  }
  console.error("Python 3 was not found on PATH; install it to run the API.");
  process.exit(1);
}

if (!fs.existsSync(venvPython)) {
  console.log("Creating the Python virtual environment in server/.venv ...");
  run(findPython(), ["-m", "venv", venvDir]);
}

console.log("Installing the API's Python packages ...");
run(venvPython, ["-m", "pip", "install", "--disable-pip-version-check", "-r", path.join(serverDir, "requirements.txt")]);
