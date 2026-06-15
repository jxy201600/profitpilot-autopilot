import fs from "node:fs";
import path from "node:path";

export const rootDir = path.resolve(new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));

export function loadEnv(file = path.join(rootDir, ".env")) {
  const env = {};
  if (!fs.existsSync(file)) return env;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    let value = match[2].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    env[match[1]] = value;
  }
  return env;
}

function bool(value, fallback = false) {
  if (value === undefined || value === "") return fallback;
  return /^(1|true|yes|on)$/i.test(String(value));
}

function int(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function getConfig() {
  const env = { ...process.env, ...loadEnv() };
  return {
    host: env.HOST || "127.0.0.1",
    port: int(env.PORT, 8787),
    demoMode: bool(env.PROFITPILOT_DEMO_MODE, !env.DASHSCOPE_API_KEY),
    qwen: {
      apiKey: env.DASHSCOPE_API_KEY || "",
      model: env.QWEN_MODEL || "qwen3.7-plus",
      baseUrl: env.QWEN_BASE_URL || "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
      timeoutMs: int(env.QWEN_TIMEOUT_MS, 45000),
    },
    paymentMethod: env.PUBLIC_PAYMENT_METHOD || "manual-alipay",
  };
}
