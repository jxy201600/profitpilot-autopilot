# Devpost Submission Draft

## Project Name

ProfitPilot Autopilot

## Track

Track 4: Autopilot Agent.

## Elevator Pitch

ProfitPilot Autopilot turns messy small-business inquiries into quote packets, customer replies, payment checkpoints, and delivery plans using Qwen Cloud.

## What It Does

The agent ingests an inquiry, classifies the business context, applies a compliance gate, generates a scoped quote, drafts a customer response, identifies missing inputs, creates an order draft, and lists delivery files that should be released only after payment confirmation.

## How Qwen Cloud Is Used

The live mode uses Qwen Cloud's OpenAI-compatible chat completion endpoint with JSON output. Demo mode is deterministic so judges can run the project without secrets.

Environment variables:

```bash
DASHSCOPE_API_KEY=...
QWEN_MODEL=qwen3.7-plus
QWEN_BASE_URL=https://dashscope-intl.aliyuncs.com/compatible-mode/v1
```

## Demo Video Script

1. Open the local web demo.
2. Paste the sample wholesale inquiry.
3. Run the agent.
4. Show compliance status, quote, customer reply, missing inputs, order draft, and human checkpoints.
5. Explain that live mode swaps deterministic planner for Qwen Cloud API while keeping the same guardrails and output schema.

## Repository Instructions

```bash
npm install
npm run validate
npm run demo
npm run start
```

## Public Repository

Use the publish checklist in `docs/repository-publish-guide.md`.

## License

MIT.
