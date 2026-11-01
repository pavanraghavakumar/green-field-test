// Runs the API's pytest suite with the virtual environment's Python.
// A bare word such as `npm run test --workspace server -- health` filters the
// tests by name; anything else (a path, a flag) is passed to pytest as it is.
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const serverDir = path.resolve(__dirname, "..");
const isWindows = process.platform === "win32";
const venvPython = path.join(serverDir, ".venv", isWindows ? "Scripts" : "bin", isWindows ? "python.exe" : "python");

if (!fs.existsSync(venvPython)) {
  console.error("server/.venv is missing; run `npm install` first.");
  process.exit(1);
}

const args = [];
const filters = [];
for (const argument of process.argv.slice(2)) {
  if (argument.startsWith("-") || argument.includes("/") || argument.includes("\\") || argument.includes(".")) {
    args.push(argument);
  } else {
    filters.push(argument);
  }
}
if (filters.length > 0) {
  args.push("-k", filters.join(" or "));
}

const result = spawnSync(venvPython, ["-m", "pytest", ...args], {
  stdio: "inherit",
  cwd: serverDir,
});

if (result.error) {
  throw result.error;
}
process.exit(result.status === null ? 1 : result.status);
