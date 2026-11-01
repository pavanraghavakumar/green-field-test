// Starts the API on a port it picks and Vite on PORT, which forwards /api to the API.
// The API creates the SQLite file and its table on startup.
const { spawn } = require("node:child_process");
const fs = require("node:fs");
const net = require("node:net");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const serverDir = path.join(root, "server");
const webDir = path.join(root, "web");
const isWindows = process.platform === "win32";
const venvPython = path.join(serverDir, ".venv", isWindows ? "Scripts" : "bin", isWindows ? "python.exe" : "python");
// Vite's own entry point, run with this Node binary: spawning `npm.cmd` needs a
// shell on Windows, and a shell would not forward the signal that stops it.
const viteBin = path.join(root, "node_modules", "vite", "bin", "vite.js");

if (!fs.existsSync(venvPython)) {
  console.error("server/.venv is missing; run `npm install` first.");
  process.exit(1);
}

if (!fs.existsSync(viteBin)) {
  console.error("node_modules/vite is missing; run `npm install` first.");
  process.exit(1);
}

function freePort() {
  return new Promise((resolve, reject) => {
    const probe = net.createServer();
    probe.unref();
    probe.on("error", reject);
    probe.listen(0, "127.0.0.1", () => {
      const { port } = probe.address();
      probe.close(() => resolve(port));
    });
  });
}

const children = [];
let stopping = false;

function start(command, args, options) {
  const child = spawn(command, args, { stdio: "inherit", cwd: root, ...options });
  children.push(child);
  child.on("error", (error) => {
    console.error(`Could not start ${command}: ${error.message}`);
    stopAll();
    process.exit(1);
  });
  child.on("exit", (code) => {
    if (stopping) {
      return;
    }
    stopAll();
    process.exit(code === null ? 1 : code);
  });
  return child;
}

function stopAll() {
  stopping = true;
  for (const child of children) {
    if (child.exitCode === null && !child.killed) {
      child.kill();
    }
  }
}

for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"]) {
  process.on(signal, () => {
    stopAll();
    process.exit(0);
  });
}

(async () => {
  const apiPort = await freePort();
  const webPort = process.env.PORT || "5173";

  console.log(`Starting the API on http://127.0.0.1:${apiPort} ...`);
  start(venvPython, ["-m", "uvicorn", "main:app", "--host", "127.0.0.1", "--port", String(apiPort)], {
    cwd: serverDir,
    env: { ...process.env, PORT: String(apiPort) },
  });

  console.log(`Starting Vite on http://localhost:${webPort} ...`);
  start(process.execPath, [viteBin], {
    cwd: webDir,
    env: { ...process.env, PORT: String(webPort), API_URL: `http://127.0.0.1:${apiPort}` },
  });
})();
