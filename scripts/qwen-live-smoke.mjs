import { getConfig } from "../src/config.mjs";
import { callQwenJson } from "../src/qwenClient.mjs";

const config = getConfig();

if (!config.qwen.apiKey) {
  process.stdout.write(`${JSON.stringify({
    ok: false,
    skipped: true,
    reason: "DASHSCOPE_API_KEY is not configured",
  }, null, 2)}\n`);
  process.exit(0);
}

const keyFormatIssues = [];
if (/\s/.test(config.qwen.apiKey)) keyFormatIssues.push("DASHSCOPE_API_KEY contains whitespace.");
if (config.qwen.apiKey === "..." || /your|replace|example|changeme/i.test(config.qwen.apiKey)) {
  keyFormatIssues.push("DASHSCOPE_API_KEY looks like a placeholder.");
}
if (config.qwen.apiKey.length < 32) keyFormatIssues.push("DASHSCOPE_API_KEY looks too short.");
if (!config.qwen.apiKey.startsWith("sk-")) keyFormatIssues.push("DASHSCOPE_API_KEY does not start with sk-.");

if (keyFormatIssues.length) {
  process.stdout.write(`${JSON.stringify({
    ok: false,
    error: "api-key-format-invalid",
    issues: keyFormatIssues,
    model: config.qwen.model,
  }, null, 2)}\n`);
  process.exitCode = 1;
} else {
try {
  const result = await callQwenJson(config, {
    system: "Return strict JSON only.",
    user: "Return {\"ok\":true,\"provider\":\"qwen-cloud\"}.",
    temperature: 0,
  });
  process.stdout.write(`${JSON.stringify({
    ok: result.ok === true,
    provider: result.provider || "",
    model: config.qwen.model,
  }, null, 2)}\n`);
  if (result.ok !== true) process.exitCode = 1;
} catch (error) {
  process.stdout.write(`${JSON.stringify({
    ok: false,
    error: error.message,
    model: config.qwen.model,
  }, null, 2)}\n`);
  process.exitCode = 1;
}
}
