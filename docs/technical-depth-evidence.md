# Technical Depth Evidence

This document is the engineering evidence sheet for the Qwen Cloud Autopilot Agent submission. It is written as a judge-facing companion to the README, architecture diagram, demo video, and generated submission bundle.

## System Contract

ProfitPilot Autopilot converts an inquiry into one structured workflow packet:

| Packet section | Purpose | Guardrail |
| --- | --- | --- |
| `compliance` | Decides whether the request is allowed, cautionary, or blocked. | Restricted industries are blocked before quote generation. |
| `quote` | Produces scope, price, currency, delivery time, and assumptions. | Missing or malformed model fields are normalized. |
| `customerReply` | Drafts a customer-facing response. | The agent drafts text but does not auto-post externally. |
| `orderDraft` | Creates a pending order state. | Payment starts as pending manual confirmation. |
| `deliveryPreview` | Lists the files that would be delivered. | Delivery remains gated behind payment confirmation. |
| `toolPlan` | Names planned external tool boundaries. | Each external action exposes a status and checkpoint. |

## Qwen Cloud Integration

- `src/qwenClient.mjs` calls the Qwen Cloud OpenAI-compatible chat completions endpoint.
- The request asks for `response_format: { type: "json_object" }` so the agent can operate on structured output rather than free-form text.
- `QWEN_TIMEOUT_MS` bounds live API calls so a judge run cannot hang indefinitely.
- `src/workflow.mjs` switches among `qwen-cloud`, `deterministic-demo`, and `deterministic-fallback` modes while preserving the same output schema.
- `scripts/export-live-proof.mjs` records live smoke-test evidence without printing the API key.

## Tool Boundaries

The project does not pretend that every external system is safely autonomous. Instead, it makes the tool plan explicit:

| Tool step | Output | Checkpoint |
| --- | --- | --- |
| `policy-check` | Compliance policy result. | Restricted or ambiguous requests. |
| `spreadsheet-export` | Follow-up status ledger. | None. |
| `email-draft` | Customer reply templates. | External account posting. |
| `merchant-api-or-manual-confirmation` | Payment and delivery checklist. | Payment confirmation. |
| `artifact-packager` | Delivery packet preview. | Payment confirmation. |

This design is intentionally suited to an Autopilot Agent track: the agent plans and prepares business work, while high-risk external actions stay gated.

## Reliability

- `fallbackIfInvalid` normalizes model shape drift into arrays, strings, numbers, and defaults.
- Bilingual intent is preserved when a Chinese/English or bilingual workflow is requested.
- Restricted terms such as CBD, cannabis, gambling, phishing, malware, and weapons are blocked in the compliance gate.
- Caution topics such as medical, legal, financial, investment, and lending requests are routed to human review.
- The local deterministic path makes CI and judge reproduction possible without secrets.

## Verification

Run the full submission gate:

```bash
npm run validate
```

Important sub-checks:

```bash
npm test
npm run demo
npm run demo:zh
npm run score
npm run live:smoke
npm run deployment:proof
npm run submission:bundle
npm run devpost:fields
npm run demo:storyboard
node scripts/validate-submission.mjs
```

## Documentation Format

- Markdown uses title case for main headings and sentence case for body copy.
- Tables are used for system contracts and judge-facing evidence.
- Commands and file paths are formatted as inline code or fenced `bash` blocks.
- The public submission material is English-first, with bilingual capability shown through generated examples.
