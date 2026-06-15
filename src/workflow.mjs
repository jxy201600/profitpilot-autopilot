import { complianceCheck } from "./compliance.mjs";
import { deterministicPlan } from "./deterministicAgent.mjs";
import { callQwenJson } from "./qwenClient.mjs";

const systemPrompt = `You are ProfitPilot Autopilot, a Qwen Cloud powered business workflow agent.
Your job is to turn a small-business inquiry into a safe quote/order workflow packet.
Return strict JSON only. Do not provide legal, medical, financial, gambling, crypto, exploit, or restricted-industry services.
The JSON shape must include:
language, customerSegment, service, urgency, riskLevel, missingInputs, quote, customerReply, operatorChecklist.
The quote object must include title, price, currency, deliveryTime, scope, assumptions.`;

function fallbackIfInvalid(value, inquiry, compliance) {
  if (!value || typeof value !== "object") return deterministicPlan(inquiry, compliance);
  const base = deterministicPlan(inquiry, compliance);
  return {
    ...base,
    ...value,
    quote: { ...base.quote, ...(value.quote || {}) },
    missingInputs: Array.isArray(value.missingInputs) ? value.missingInputs : base.missingInputs,
    operatorChecklist: Array.isArray(value.operatorChecklist) ? value.operatorChecklist : base.operatorChecklist,
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
