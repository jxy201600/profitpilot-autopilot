import { complianceCheck } from "./compliance.mjs";
import { deterministicPlan } from "./deterministicAgent.mjs";
import { callQwenJson } from "./qwenClient.mjs";

const systemPrompt = `You are ProfitPilot Autopilot, a Qwen Cloud powered business workflow agent.
Your job is to turn a small-business inquiry into a safe quote/order workflow packet.
Return strict JSON only. Do not provide legal, medical, financial, gambling, crypto, exploit, or restricted-industry services.
The JSON shape must include:
language, customerSegment, service, urgency, riskLevel, missingInputs, quote, customerReply, operatorChecklist.
The quote object must include title, price, currency, deliveryTime, scope, assumptions.
scope, assumptions, missingInputs, and operatorChecklist must be JSON arrays of short strings.`;

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
      scope: toStringArray(quote.scope, base.quote.scope),
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
