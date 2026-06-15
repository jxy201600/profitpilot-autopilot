import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const rootDir = path.resolve(new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const targets = ["src", "test"]
  .flatMap((dir) => fs.readdirSync(path.join(rootDir, dir))
    .filter((file) => file.endsWith(".mjs"))
    .map((file) => path.join(rootDir, dir, file)));

for (const target of targets) {
  execFileSync(process.execPath, ["--check", target], { stdio: "inherit" });
}

console.log(`Checked ${targets.length} JavaScript modules.`);
