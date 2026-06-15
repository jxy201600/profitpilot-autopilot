import test from "node:test";
import assert from "node:assert/strict";
import { complianceCheck } from "../src/compliance.mjs";
import { runProfitPilot } from "../src/workflow.mjs";
import { scoreSubmissionEvidence } from "../src/scorecard.mjs";

const config = {
  demoMode: true,
  qwen: { apiKey: "", model: "qwen3.7-plus", baseUrl: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1" },
};

test("blocks restricted requests", async () => {
  const result = await runProfitPilot("Need CBD customer automation and THC product replies", config);
  assert.equal(result.ok, false);
  assert.equal(result.mode, "blocked");
  assert.equal(result.compliance.allowed, false);
});

test("creates a deterministic quote packet for English inquiries", async () => {
  const result = await runProfitPilot("We need a wholesale inquiry workflow and quote follow-up this week.", config);
  assert.equal(result.ok, true);
  assert.equal(result.mode, "deterministic-demo");
  assert.equal(result.packet.orderDraft.currency, "USD");
  assert.ok(result.packet.customerReply.includes("lightweight"));
  assert.ok(result.packet.deliveryPreview.files.includes("follow-up-status-ledger.csv"));
  assert.ok(result.packet.toolPlan.some((step) => step.tool === "spreadsheet-export"));
  assert.ok(result.packet.toolPlan.some((step) => step.humanCheckpoint === "payment-confirmation"));
});

test("creates a Chinese packet for Chinese inquiries", async () => {
  const result = await runProfitPilot("我们是批发商，需要报价、付款状态、交付清单自动化。", config);
  assert.equal(result.ok, true);
  assert.equal(result.packet.orderDraft.currency, "CNY");
  assert.ok(result.packet.customerReply.includes("轻量"));
});

test("marks caution topics for human review", () => {
  const result = complianceCheck("Need automation for financial advice workflow");
  assert.equal(result.allowed, true);
  assert.equal(result.requiresHumanReview, true);
});

test("produces judging evidence scorecard", async () => {
  const result = await runProfitPilot("Need bilingual wholesale quote automation with payment status and delivery checklist.", config);
  const scorecard = scoreSubmissionEvidence(result);
  assert.ok(scorecard.total >= 80);
  assert.equal(scorecard.checks.complianceGate, true);
  assert.equal(scorecard.checks.paymentGate, true);
  assert.equal(scorecard.checks.toolPlan, true);
  assert.equal(scorecard.checks.bilingualReach, true);
});

test("keeps tool plan and bilingual scope after live fallback", async () => {
  const liveLikeConfig = {
    demoMode: false,
    qwen: { apiKey: "test-key", model: "test-model", baseUrl: "http://127.0.0.1:9", timeoutMs: 1000 },
  };
  const result = await runProfitPilot("Need bilingual quote workflow automation", liveLikeConfig);
  assert.equal(result.ok, true);
  assert.equal(result.mode, "deterministic-fallback");
  assert.ok(Array.isArray(result.packet.quote.scope));
  assert.ok(result.packet.quote.scope.some((item) => /Chinese and English|bilingual/i.test(item)));
  assert.ok(Array.isArray(result.packet.toolPlan));
});
