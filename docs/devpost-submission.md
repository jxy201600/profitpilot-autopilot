# Devpost Submission Draft

## Project Name

ProfitPilot Autopilot

## Track

Track 4: Autopilot Agent.

## Elevator Pitch

ProfitPilot Autopilot turns messy small-business inquiries into quote packets, customer replies, payment checkpoints, and delivery plans using Qwen Cloud.

## What It Does

The agent ingests an inquiry, classifies the business context, applies a compliance gate, generates a scoped quote, drafts a customer response, identifies missing inputs, creates an order draft, and lists delivery files that should be released only after payment confirmation.

## Inspiration

Small businesses often receive vague inquiries across email, forms, and chat, then spend too much time turning them into quotes, follow-ups, payment checks, and delivery tasks. The project shows how Qwen Cloud can act as a practical workflow autopilot for this messy revenue operation, not just as a conversational demo.

## How We Built It

We built a Node.js agent with a bounded Qwen Cloud adapter, a strict JSON workflow contract, deterministic fallback mode for repeatable judging, and web and CLI interfaces. The workflow separates model reasoning from operational gates: compliance, quote generation, customer reply drafting, missing-input collection, payment checkpointing, and delivery packaging.

## Challenges We Ran Into

The hardest part was making the agent useful while keeping it safe and reproducible. We added schema normalization for model output drift, explicit restricted-topic handling, payment and delivery checkpoints, timeout controls, live smoke evidence, and a deterministic mode so judges can run the same flow without exposing secrets.

## Accomplishments

The project produces real business artifacts instead of a chat transcript: a quote packet, customer reply, missing-input checklist, order draft, tool plan, payment gate, delivery preview, JSON result, validation report, Qwen Cloud live proof, and Alibaba Cloud deployment proof.

## What We Learned

A strong business autopilot needs clear boundaries as much as intelligence. Qwen Cloud is most valuable when its output is constrained by a contract, checked by deterministic guardrails, and connected to a practical workflow that a small operator can understand and verify.

## What's Next

Next steps are spreadsheet export, email draft handoff, CRM adapters, multilingual templates, richer audit logs, and optional human approval queues for payment, regulated requests, and final delivery release.

## How Qwen Cloud Is Used

The live mode uses Qwen Cloud's OpenAI-compatible chat completion endpoint with JSON output. Demo mode is deterministic so judges can run the project without secrets.

Environment variables:

```bash
DASHSCOPE_API_KEY=...
QWEN_MODEL=qwen3.7-plus
QWEN_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
```

The live setup checklist is in `docs/qwen-cloud-live-setup.md`.

## Demo Video Script

1. Open the local web demo.
2. Paste the sample wholesale inquiry.
3. Run the agent.
4. Show compliance status, quote, customer reply, missing inputs, order draft, and human checkpoints.
5. Show the tool plan with compliance, spreadsheet, email, payment, and delivery packaging boundaries.
6. Explain that live mode swaps deterministic planner for Qwen Cloud API while keeping the same guardrails and output schema.

Video requirement: upload a public video under 3 minutes to YouTube, Vimeo, or Youku. Keep it English or English-subtitled and do not show secrets.

## Official Requirement Mapping

See `docs/official-submission-requirements.md`.

Devpost fields should include:

- Public repository URL.
- Public demo video URL.
- Architecture diagram.
- Track: Track 4, Autopilot Agent.
- Text description.
- Testing instructions.
- Alibaba Cloud deployment proof link: `docs/evidence/deployment-proof.md`.
- Qwen Cloud live proof link: `docs/evidence/qwen-live-proof.md`.
- Optional blog/social post URL.

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
