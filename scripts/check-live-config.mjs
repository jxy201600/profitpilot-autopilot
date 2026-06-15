import { getConfig } from "../src/config.mjs";

const config = getConfig();
const key = config.qwen.apiKey || "";
const diagnostics = {
  ok: true,
  hasDASHSCOPE_API_KEY: Boolean(key),
  keyFormat: {
    length: key.length,
    startsWithSkDash: key.startsWith("sk-"),
    hasWhitespaceInside: /\s/.test(key),
    hasUrlLikeText: /^https?:/i.test(key),
    looksLikePlaceholder: key === "..." || /your|replace|example|changeme/i.test(key),
  },
  demoMode: config.demoMode,
  model: config.qwen.model,
  hasBaseUrl: Boolean(config.qwen.baseUrl),
  baseUrlHost: (() => {
    try {
      return new URL(config.qwen.baseUrl).host;
    } catch {
      return "";
    }
  })(),
  issues: [],
};

if (!key) diagnostics.issues.push("DASHSCOPE_API_KEY is missing.");
if (diagnostics.keyFormat.looksLikePlaceholder) diagnostics.issues.push("DASHSCOPE_API_KEY still looks like a placeholder.");
if (diagnostics.keyFormat.hasWhitespaceInside) diagnostics.issues.push("DASHSCOPE_API_KEY contains whitespace.");
if (diagnostics.keyFormat.hasUrlLikeText) diagnostics.issues.push("DASHSCOPE_API_KEY looks like a URL, not an API key.");
if (key && !diagnostics.keyFormat.startsWithSkDash) diagnostics.issues.push("DASHSCOPE_API_KEY does not start with sk-.");
if (key && key.length < 32) diagnostics.issues.push("DASHSCOPE_API_KEY looks too short.");
if (!config.qwen.baseUrl) diagnostics.issues.push("QWEN_BASE_URL is missing.");
if (!config.qwen.model) diagnostics.issues.push("QWEN_MODEL is missing.");

diagnostics.ok = diagnostics.issues.length === 0;
process.stdout.write(`${JSON.stringify(diagnostics, null, 2)}\n`);
if (!diagnostics.ok) process.exitCode = 1;
