import fs from "node:fs";
import path from "node:path";
import { rootDir, getConfig } from "../src/config.mjs";
import { callQwenJson } from "../src/qwenClient.mjs";

const outDir = path.join(rootDir, "out", "live-proof");
fs.mkdirSync(outDir, { recursive: true });

function keyIssues(apiKey) {
  const issues = [];
  if (!apiKey) issues.push("DASHSCOPE_API_KEY is missing.");
  if (/\s/.test(apiKey)) issues.push("DASHSCOPE_API_KEY contains whitespace.");
  if (apiKey === "..." || /your|replace|example|changeme/i.test(apiKey)) issues.push("DASHSCOPE_API_KEY looks like a placeholder.");
  if (apiKey && apiKey.length < 32) issues.push("DASHSCOPE_API_KEY looks too short.");
  if (apiKey && !apiKey.startsWith("sk-")) issues.push("DASHSCOPE_API_KEY does not start with sk-.");
  return issues;
}

function publicConfig(config) {
  return {
    model: config.qwen.model,
    baseUrlHost: (() => {
      try {
        return new URL(config.qwen.baseUrl).host;
      } catch {
        return "";
      }
    })(),
    demoMode: config.demoMode,
  };
}

const config = getConfig();
const issues = keyIssues(config.qwen.apiKey);
let proof;

if (issues.length) {
  proof = {
    ok: false,
    checkedAt: new Date().toISOString(),
    reason: "live-config-not-ready",
    issues,
    config: publicConfig(config),
  };
} else {
  try {
    const result = await callQwenJson(config, {
      system: "Return strict JSON only.",
      user: "Return {\"ok\":true,\"provider\":\"qwen-cloud\",\"workflow\":\"profitpilot-live-proof\"}.",
      temperature: 0,
    });
    proof = {
      ok: result.ok === true,
      checkedAt: new Date().toISOString(),
      provider: result.provider || "",
      workflow: result.workflow || "",
      config: publicConfig(config),
    };
  } catch (error) {
    proof = {
      ok: false,
      checkedAt: new Date().toISOString(),
      reason: "live-smoke-failed",
      error: error.message,
      config: publicConfig(config),
    };
  }
}

const jsonPath = path.join(outDir, "qwen-live-proof.json");
const mdPath = path.join(outDir, "qwen-live-proof.md");
fs.writeFileSync(jsonPath, JSON.stringify(proof, null, 2));
fs.writeFileSync(mdPath, `# Qwen Cloud Live Proof

- Checked at: ${proof.checkedAt}
- OK: ${proof.ok ? "yes" : "no"}
- Provider: ${proof.provider || "not confirmed"}
- Model: ${proof.config.model}
- Endpoint host: ${proof.config.baseUrlHost || "not configured"}
- Demo mode: ${proof.config.demoMode ? "true" : "false"}

${proof.ok ? "Live Qwen Cloud smoke test passed." : `Live proof is not ready: ${proof.reason || "unknown"}${proof.issues?.length ? `\n\nIssues:\n${proof.issues.map((issue) => `- ${issue}`).join("\n")}` : ""}`}
`);

process.stdout.write(`${JSON.stringify({ ok: proof.ok, jsonPath, mdPath, reason: proof.reason || "", provider: proof.provider || "" }, null, 2)}\n`);
if (!proof.ok) process.exitCode = 1;
