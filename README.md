# ProfitPilot Autopilot

ProfitPilot Autopilot is a Qwen Cloud powered agent for **Track 4: Autopilot Agent** in the Global AI Hackathon Series with Qwen Cloud.

It turns messy small-business inquiries into:

- a compliance result,
- a scoped quote,
- a customer-facing reply,
- missing-input checklist,
- order draft,
- payment confirmation gate,
- delivery packet preview.

The project is designed for small merchants, wholesalers, local service providers, and export sellers who need repeatable inquiry-to-quote workflows without a heavy CRM.

## Why It Fits The Track

Track 4 asks for agents that automate real-world business workflows end to end. ProfitPilot focuses on the revenue workflow that happens before delivery: inquiry intake, quote creation, customer communication, payment gate, and delivery planning.

## Run Locally

```bash
npm install
npm run validate
npm run demo
npm run start
```

Submission helpers:

```bash
npm run deployment:proof
npm run submission:bundle
npm run devpost:fields
npm run demo:storyboard
```

Then open `http://127.0.0.1:8787`.

## Qwen Cloud Live Mode

By default the app runs in deterministic demo mode. To use Qwen Cloud:

```bash
cp .env.example .env
```

Fill:

```bash
DASHSCOPE_API_KEY=...
PROFITPILOT_DEMO_MODE=false
QWEN_MODEL=qwen3.7-plus
```

The app uses the OpenAI-compatible endpoint:

```text
https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions
```

Check the live configuration without printing secrets:

```bash
npm run live:config
npm run live:smoke
```

## CLI Demo

```bash
npm run demo
npm run demo:zh
```

Generated packets are written to `out/`.

## Safety Boundaries

- Restricted requests are blocked before quote generation.
- Caution topics are routed to human review.
- Payment is not treated as confirmed by the model.
- Delivery materials are gated behind payment confirmation.
- The agent does not auto-post to third-party accounts.

## Architecture

See [docs/architecture.md](docs/architecture.md) and [docs/architecture.svg](docs/architecture.svg).

## Submission Draft

See [docs/devpost-submission.md](docs/devpost-submission.md).

## Prize Strategy

See [docs/winning-submission-plan.md](docs/winning-submission-plan.md).

## Publishing

See [docs/repository-publish-guide.md](docs/repository-publish-guide.md).

## License

MIT.
