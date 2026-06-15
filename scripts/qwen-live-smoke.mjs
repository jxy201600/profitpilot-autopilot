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
  if (result.ok !== true) process.exit(1);
} catch (error) {
  process.stdout.write(`${JSON.stringify({
    ok: false,
    error: error.message,
    model: config.qwen.model,
  }, null, 2)}\n`);
  process.exit(1);
}
