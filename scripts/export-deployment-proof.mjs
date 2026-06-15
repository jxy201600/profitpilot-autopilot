import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { rootDir } from "../src/config.mjs";

const outDir = path.join(rootDir, "out", "deployment-proof");
const publicEvidenceDir = path.join(rootDir, "docs", "evidence");
fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(publicEvidenceDir, { recursive: true });

function run(command, args) {
  try {
    return execFileSync(command, args, { cwd: rootDir, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  } catch (error) {
    return `command failed: ${error.message}`;
  }
}

function npmVersion() {
  const result = process.platform === "win32"
    ? run("cmd.exe", ["/d", "/s", "/c", "npm --version"])
    : run("npm", ["--version"]);
  return result.startsWith("command failed:") ? "not captured" : result;
}

const proof = {
  generatedAt: new Date().toISOString(),
  declaredCloudProvider: "Alibaba Cloud ECS",
  host: {
    hostname: os.hostname(),
    platform: os.platform(),
    release: os.release(),
    arch: os.arch(),
    cpus: os.cpus().length,
    memoryGb: Number((os.totalmem() / 1024 / 1024 / 1024).toFixed(2)),
  },
  runtime: {
    node: process.version,
    npm: npmVersion(),
  },
  app: {
    name: "ProfitPilot Autopilot",
    bindDefault: "127.0.0.1:8787",
    publicExposure: "Use HTTPS reverse proxy only for public judging access.",
    qwenLiveMode: "Set DASHSCOPE_API_KEY and PROFITPILOT_DEMO_MODE=false.",
  },
  verificationCommands: [
    "npm run validate",
    "npm run live:smoke",
    "npm run start",
  ],
  securityNotes: [
    "No .env file is committed.",
    "Payment confirmation remains a human or official merchant API gate.",
    "Restricted requests are blocked before quote generation.",
    "The app binds to localhost by default.",
  ],
};

const jsonPath = path.join(outDir, "deployment-proof.json");
const mdPath = path.join(outDir, "deployment-proof.md");
const publicMdPath = path.join(publicEvidenceDir, "deployment-proof.md");
fs.writeFileSync(jsonPath, JSON.stringify(proof, null, 2));
fs.writeFileSync(mdPath, `# Deployment Proof

- Generated at: ${proof.generatedAt}
- Declared cloud provider: ${proof.declaredCloudProvider}
- Hostname: ${proof.host.hostname}
- Platform: ${proof.host.platform} ${proof.host.release} ${proof.host.arch}
- Node: ${proof.runtime.node}
- npm: ${proof.runtime.npm}
- Default bind: ${proof.app.bindDefault}

## Verification Commands

${proof.verificationCommands.map((item) => `- \`${item}\``).join("\n")}

## Security Notes

${proof.securityNotes.map((item) => `- ${item}`).join("\n")}
`);
fs.writeFileSync(publicMdPath, `# Deployment Proof

This public proof summarizes the deployment environment without exposing hostnames, secrets, private network details, or credentials.

| Field | Value |
| --- | --- |
| Generated at | ${proof.generatedAt} |
| Declared cloud provider | ${proof.declaredCloudProvider} |
| Platform | ${proof.host.platform} ${proof.host.release} ${proof.host.arch} |
| CPU cores | ${proof.host.cpus} |
| Memory | ${proof.host.memoryGb} GB |
| Node | ${proof.runtime.node} |
| npm | ${proof.runtime.npm} |
| Default bind | ${proof.app.bindDefault} |

## Verification Commands

${proof.verificationCommands.map((item) => `- \`${item}\``).join("\n")}

## Security Notes

${proof.securityNotes.map((item) => `- ${item}`).join("\n")}
`);

process.stdout.write(`${JSON.stringify({ ok: true, jsonPath, mdPath, publicMdPath }, null, 2)}\n`);
