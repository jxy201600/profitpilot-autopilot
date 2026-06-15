function extractJson(text) {
  const raw = String(text || "").trim();
  if (!raw) throw new Error("empty-model-response");
  try {
    return JSON.parse(raw);
  } catch {
    const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fenced) return JSON.parse(fenced[1]);
    const object = raw.match(/\{[\s\S]*\}/);
    if (object) return JSON.parse(object[0]);
    throw new Error("model-response-not-json");
  }
}

export async function callQwenJson(config, { system, user, temperature = 0.2 } = {}) {
  if (!config.qwen.apiKey) throw new Error("qwen-api-key-missing");
  const endpoint = `${config.qwen.baseUrl.replace(/\/$/, "")}/chat/completions`;
  const timeoutMs = Number.isFinite(Number(config.qwen.timeoutMs)) ? Number(config.qwen.timeoutMs) : 45000;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.qwen.apiKey}`,
      "Content-Type": "application/json",
    },
    signal: AbortSignal.timeout(timeoutMs),
    body: JSON.stringify({
      model: config.qwen.model,
      temperature,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    }),
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`qwen-api-error-${response.status}: ${detail.slice(0, 500)}`);
  }
  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content || "";
  return extractJson(content);
}
