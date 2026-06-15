function detectLanguage(text) {
  return /[\u3400-\u9fff]/.test(text) ? "zh" : "en";
}

function includesAny(text, terms) {
  const lower = String(text || "").toLowerCase();
  return terms.some((term) => lower.includes(term));
}

export function deterministicPlan(inquiry, compliance) {
  const language = detectLanguage(inquiry);
  const b2b = includesAny(inquiry, ["wholesale", "distributor", "bulk", "quote", "批发", "团购", "报价", "客户"]);
  const needsBilingual = includesAny(inquiry, ["english", "英语", "英文", "bilingual", "双语"]);
  const urgency = includesAny(inquiry, ["this week", "urgent", "asap", "本周", "尽快", "马上"]) ? "fast" : "standard";
  const service = b2b ? "Quote and order workflow automation" : "Customer response and task workflow automation";
  const currency = language === "zh" ? "CNY" : "USD";
  const price = language === "zh" ? 699 : 149;
  const missing = [
    "product or service catalog",
    "required quote fields",
    "payment confirmation method",
    "delivery channel",
  ];
  return {
    language,
    customerSegment: b2b ? "small-b2b-merchant" : "small-business",
    service,
    urgency,
    riskLevel: compliance.allowed ? (compliance.requiresHumanReview ? "medium" : "low") : "blocked",
    missingInputs: missing,
    quote: {
      title: service,
      price,
      currency,
      deliveryTime: urgency === "fast" ? "2-3 business days" : "3-5 business days",
      scope: [
        "Inquiry intake fields",
        "Quote draft template",
        "Follow-up status checklist",
        "Payment status gate",
        needsBilingual ? "Chinese and English customer response templates" : "Customer response template",
      ],
      assumptions: [
        "No direct posting to third-party private messages.",
        "Payment is confirmed manually unless an official merchant API is configured.",
        "Restricted or legally ambiguous industries are blocked or routed to human review.",
      ],
    },
    customerReply: language === "zh"
      ? "您好，我们可以为您搭建一个轻量的询盘到报价工作流。第一版会包含报价字段、客户回复话术、缺失信息提醒、付款状态门禁和交付清单。预计交付时间为2-5个工作日，开始前需要您提供产品目录、报价字段和付款确认方式。"
      : "Yes. We can set up a lightweight inquiry-to-quote workflow with quote fields, customer reply templates, missing-information checks, payment-status gates, and a delivery checklist. To start, please share your catalog, required quote fields, payment confirmation method, and preferred delivery channel.",
    operatorChecklist: [
      "Confirm compliance result before customer commitment.",
      "Collect missing inputs.",
      "Create order draft only after scope is accepted.",
      "Do not deliver paid materials before payment confirmation.",
      "Generate delivery packet with customer-facing files and operator notes.",
    ],
  };
}
