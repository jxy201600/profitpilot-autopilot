import { complianceCheck } from "./compliance.mjs";
import { deterministicPlan } from "./deterministicAgent.mjs";
import { callQwenJson } from "./qwenClient.mjs";

const systemPrompt = `You are ProfitPilot Autopilot, a Qwen Cloud powered business workflow agent.
Your job is to turn a small-business inquiry into a safe quote/order workflow packet.
Return strict JSON only. Do not provide legal, medical, financial, gambling, crypto, exploit, or restricted-industry services.
The JSON shape must include:
language, customerSegment, service, urgency, riskLevel, missingInputs, quote, customerReply, operatorChecklist.
The quote object must include title, price, currency, deliveryTime, scope, assumptions.
scope, assumptions, missingInputs, and operatorChecklist must be JSON arrays of short strings.
The workflow must preserve human checkpoints for payment confirmation, restricted requests, and external account posting.`;

function toStringValue(value, fallback) {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return fallback;
}

function toNumberValue(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toStringArray(value, fallback) {
  if (Array.isArray(value)) {
    const items = value
      .map((item) => toStringValue(item, ""))
      .filter(Boolean);
    return items.length ? items : fallback;
  }
  if (typeof value === "string" && value.trim()) {
    const items = value
      .split(/\r?\n|;|,|、/)
      .map((item) => item.replace(/^[-*\d.\s]+/, "").trim())
      .filter(Boolean);
    return items.length ? items : [value.trim()];
  }
  return fallback;
}

function wantsBilingualOutput(inquiry, value) {
  return /bilingual|Chinese|English|EN\/ZH|ZH\/EN|双语|中文|英文/i.test(`${inquiry || ""} ${JSON.stringify(value || {})}`);
}

function ensureBilingualScope(scope, inquiry, value) {
  const items = toStringArray(scope, []);
  if (!wantsBilingualOutput(inquiry, value)) return items.length ? items : toStringArray(scope, []);
  const joined = items.join(" ");
  if (/Chinese and English|English and Chinese|EN\/ZH|ZH\/EN|bilingual|双语|中英文/i.test(joined)) return items;
  return [
    ...items,
    "Chinese and English customer response templates",
  ];
}

function buildToolPlan({ orderId, compliance, normalized }) {
  return [
    {
      id: "compliance-gate",
      tool: "policy-check",
      status: compliance.allowed ? "passed" : "blocked",
      input: "customer inquiry",
      output: compliance.policy,
      humanCheckpoint: compliance.requiresHumanReview ? "restricted-or-ambiguous-request" : "",
    },
    {
      id: "quote-ledger",
      tool: "spreadsheet-export",
      status: "prepared",
      input: "quote packet",
      output: "follow-up-status-ledger.csv",
      humanCheckpoint: "",
    },
    {
      id: "customer-reply",
      tool: "email-draft",
      status: "prepared",
      input: normalized.service,
      output: "customer-reply-templates.md",
      humanCheckpoint: "external-account-posting",
    },
    {
      id: "payment-check",
      tool: "merchant-api-or-manual-confirmation",
      status: "requires-human-confirmation",
      input: orderId,
      output: "payment-and-delivery-checklist.md",
      humanCheckpoint: "payment-confirmation",
    },
    {
      id: "delivery-preview",
      tool: "artifact-packager",
      status: "gated",
      input: "approved order draft",
      output: "delivery packet preview",
      humanCheckpoint: "payment-confirmation",
    },
  ];
}

function fallbackIfInvalid(value, inquiry, compliance) {
  if (!value || typeof value !== "object") return deterministicPlan(inquiry, compliance);
  const base = deterministicPlan(inquiry, compliance);
  const quote = { ...base.quote, ...(value.quote && typeof value.quote === "object" ? value.quote : {}) };
  return {
    ...base,
    ...value,
    language: toStringValue(value.language, base.language),
    customerSegment: toStringValue(value.customerSegment, base.customerSegment),
    service: toStringValue(value.service, base.service),
    urgency: toStringValue(value.urgency, base.urgency),
    riskLevel: toStringValue(value.riskLevel, base.riskLevel),
    quote: {
      ...quote,
      title: toStringValue(quote.title, base.quote.title),
      price: toNumberValue(quote.price, base.quote.price),
      currency: toStringValue(quote.currency, base.quote.currency),
      deliveryTime: toStringValue(quote.deliveryTime, base.quote.deliveryTime),
      scope: ensureBilingualScope(quote.scope || base.quote.scope, inquiry, value),
      assumptions: toStringArray(quote.assumptions, base.quote.assumptions),
    },
    customerReply: toStringValue(value.customerReply, base.customerReply),
    missingInputs: toStringArray(value.missingInputs, base.missingInputs),
    operatorChecklist: toStringArray(value.operatorChecklist, base.operatorChecklist),
  };
}

export async function runProfitPilot(inquiry, config) {
  const startedAt = new Date().toISOString();
  const compliance = complianceCheck(inquiry);
  if (!compliance.allowed) {
    return {
      ok: false,
      mode: "blocked",
      startedAt,
      completedAt: new Date().toISOString(),
      compliance,
      packet: null,
      message: "Request blocked by restricted-industry compliance gate.",
    };
  }

  let plan;
  let mode = "deterministic-demo";
  let modelError = "";
  if (!config.demoMode && config.qwen.apiKey) {
    try {
      plan = await callQwenJson(config, {
        system: systemPrompt,
        user: `Inquiry:\n${inquiry}\n\nCompliance JSON:\n${JSON.stringify(compliance)}`,
      });
      mode = "qwen-cloud";
    } catch (error) {
      modelError = error.message;
      plan = deterministicPlan(inquiry, compliance);
      mode = "deterministic-fallback";
    }
  } else {
    plan = deterministicPlan(inquiry, compliance);
  }

  const normalized = fallbackIfInvalid(plan, inquiry, compliance);
  const orderId = `pp_${Date.now().toString(36)}`;
  const toolPlan = buildToolPlan({ orderId, compliance, normalized });
  const packet = {
    orderDraft: {
      id: orderId,
      service: normalized.service,
      amount: normalized.quote.price,
      currency: normalized.quote.currency,
      paymentStatus: "pending-manual-confirmation",
      deliveryStatus: "not-started",
    },
    quote: normalized.quote,
    customerReply: normalized.customerReply,
    missingInputs: normalized.missingInputs,
    operatorChecklist: normalized.operatorChecklist,
    deliveryPreview: {
      files: [
        "quote-workflow-template.md",
        "customer-reply-templates.md",
        "follow-up-status-ledger.csv",
        "payment-and-delivery-checklist.md",
      ],
      releaseGate: "Release delivery packet after payment confirmation.",
    },
    toolPlan,
    humanCheckpoints: [
      "payment-confirmation",
      "restricted-or-ambiguous-request",
      "external-account-posting",
      "custom-scope-above-standard-price",
    ],
  };

  return {
    ok: true,
    mode,
    modelError,
    startedAt,
    completedAt: new Date().toISOString(),
    compliance,
    plan: normalized,
    packet,
  };
}
