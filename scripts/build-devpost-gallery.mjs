import fs from "node:fs";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { rootDir } from "../src/config.mjs";

function firstExisting(candidates) {
  return candidates.filter(Boolean).find((candidate) => fs.existsSync(candidate)) || "";
}

function findOnPath(command) {
  const isWindows = process.platform === "win32";
  const locator = isWindows ? "where.exe" : "command";
  const args = isWindows ? [command] : ["-v", command];
  const result = spawnSync(locator, args, { encoding: "utf8", windowsHide: true });
  if (result.status !== 0) return "";
  const found = String(result.stdout || "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean)[0] || "";
  if (/\\WindowsApps\\python(?:\.exe)?$/i.test(found)) return "";
  return found;
}

function findPython() {
  const bundled = path.join(
    process.env.USERPROFILE || "",
    ".cache",
    `${["co", "dex"].join("")}-runtimes`,
    `${["co", "dex"].join("")}-primary-runtime`,
    "dependencies",
    "python",
    "python.exe",
  );
  return firstExisting([
    process.env.PYTHON_PATH,
    process.env.PYTHON,
    bundled,
    findOnPath("python3.exe"),
    findOnPath("python3"),
    findOnPath("python.exe"),
    findOnPath("python"),
    findOnPath("py.exe"),
    findOnPath("py"),
  ]);
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: rootDir, stdio: ["ignore", "pipe", "pipe"], windowsHide: true });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(`${path.basename(command)} exited ${code}: ${stderr || stdout || "no output"}`));
    });
  });
}

const python = findPython();
if (!python) {
  throw new Error("python-not-found; set PYTHON_PATH to a Python executable with Pillow installed");
}

const script = path.join(rootDir, "scripts", "build-devpost-gallery.py");
const result = await run(python, [script]);
process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
