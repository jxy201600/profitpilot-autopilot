export const judgingWeights = {
  innovation: 30,
  technicalDepth: 30,
  impact: 25,
  presentation: 15,
};

export function scoreSubmissionEvidence(result) {
  const packet = result?.packet || {};
  const plan = result?.plan || {};
  const checks = {
    qwenCloudReady: ["qwen-cloud", "deterministic-fallback", "deterministic-demo"].includes(result?.mode),
    structuredWorkflow: Boolean(packet.orderDraft && packet.quote && packet.deliveryPreview),
    complianceGate: Boolean(result?.compliance?.policy),
    humanCheckpoints: Array.isArray(packet.humanCheckpoints) && packet.humanCheckpoints.length >= 3,
    businessValue: /quote|order|workflow|报价|订单/i.test(`${plan.service || ""} ${packet.quote?.title || ""}`),
    bilingualReach: /Chinese|English|中文|英文/i.test(JSON.stringify(packet.quote?.scope || [])),
    deliveryArtifacts: Array.isArray(packet.deliveryPreview?.files) && packet.deliveryPreview.files.length >= 3,
    paymentGate: /payment/i.test(`${packet.deliveryPreview?.releaseGate || ""} ${packet.orderDraft?.paymentStatus || ""}`),
  };

  const innovation = 10 +
    (checks.structuredWorkflow ? 8 : 0) +
    (checks.complianceGate ? 6 : 0) +
    (checks.humanCheckpoints ? 6 : 0);
  const technicalDepth = 8 +
    (checks.qwenCloudReady ? 6 : 0) +
    (checks.structuredWorkflow ? 6 : 0) +
    (checks.deliveryArtifacts ? 5 : 0) +
    (checks.paymentGate ? 5 : 0);
  const impact = 7 +
    (checks.businessValue ? 8 : 0) +
    (checks.bilingualReach ? 5 : 0) +
    (checks.paymentGate ? 5 : 0);
  const presentation = 6 +
    (checks.deliveryArtifacts ? 4 : 0) +
    (checks.humanCheckpoints ? 3 : 0) +
    (checks.complianceGate ? 2 : 0);

  const weighted = {
    innovation: Math.min(judgingWeights.innovation, innovation),
    technicalDepth: Math.min(judgingWeights.technicalDepth, technicalDepth),
    impact: Math.min(judgingWeights.impact, impact),
    presentation: Math.min(judgingWeights.presentation, presentation),
  };

  return {
    weights: judgingWeights,
    checks,
    weighted,
    total: Object.values(weighted).reduce((sum, value) => sum + value, 0),
    recommendations: [
      checks.qwenCloudReady ? "" : "Enable Qwen Cloud live mode with DASHSCOPE_API_KEY before final demo.",
      checks.bilingualReach ? "" : "Show Chinese and English output in the demo.",
      checks.paymentGate ? "" : "Make the payment confirmation gate visible in the UI and README.",
      checks.deliveryArtifacts ? "" : "Show generated delivery artifacts in the video.",
    ].filter(Boolean),
  };
}
