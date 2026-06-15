# Winning Submission Plan

This plan keeps the submission focused on the strongest prize path: Track 4, Autopilot Agent, with an optional blog-post award entry.

## Official Alignment

Sources to cite in the final submission and video description:

- Event page: https://qwenlm.github.io/zh/blog/qwen-global-hackathon/
- Devpost project page: https://qwen-hackathon.devpost.com/
- Rules page: https://qwen-hackathon.devpost.com/rules

The project should be presented as a business workflow autopilot, not a general chat demo.

## Sponsor Intent

The sponsor wants builders to show practical Qwen Cloud use cases that can move from prototype to real deployment. For Track 4, the strongest story is an agent that can handle ambiguous real-world input, call or prepare downstream tools, expose human checkpoints, and produce reliable business artifacts.

ProfitPilot Autopilot maps to that intent by converting a small-business inquiry into a scoped quote, customer reply, missing-input checklist, order draft, payment checkpoint, and delivery packet preview.

## Prize Path

Primary target:

- Track 4: Autopilot Agent.

Secondary target:

- Blog Post Award, using `docs/blog-post-draft.md`.

Do not dilute the submission with unrelated features. The demo should show one complete revenue workflow from inquiry to delivery gate.

## Judging Evidence

### Innovation and AI Creativity

- Role-pipeline workflow: intake, compliance, quote, reply, fulfillment, payment gate.
- Bilingual output for English and Chinese small-business customers.
- Deterministic demo mode plus Qwen Cloud live mode.

### Technical Depth

- OpenAI-compatible Qwen Cloud adapter in `src/qwenClient.mjs`.
- Structured JSON workflow packet with normalization for model shape drift.
- Explicit tool plan for spreadsheet export, email draft, payment confirmation, and delivery packaging.
- CLI, local web demo, tests, scoring script, deployment proof, and submission bundle.
- Safety gates implemented outside model text.

### Problem Value

- Targets merchants, wholesalers, local service providers, and export sellers.
- Produces operational artifacts instead of only conversational answers.
- Keeps payment and delivery behind explicit checkpoints.

### Presentation

- Video under 3 minutes.
- Show a successful allowed workflow, then one restricted request block.
- Show `npm run validate`, the generated packet, and the tool plan.
- Keep docs in a consistent Markdown style: title-case headings, compact tables, fenced commands, and no raw note fragments.

## Demo Order

1. Open the web demo.
2. Run the default wholesale inquiry.
3. Show the quote amount, customer reply, missing inputs, order draft, and payment checkpoint.
4. Show the JSON packet and generated Markdown packet.
5. Run or show the restricted CBD/THC request block.
6. Mention Qwen Cloud live mode and deterministic judge mode.
7. Close with Alibaba Cloud ECS deployment readiness and the public repository.

## Submission Copy Rules

- Lead with the business problem and artifact output.
- Mention Qwen Cloud early.
- Avoid claiming automatic payment confirmation.
- Avoid claiming fully autonomous external posting or regulated-industry fulfillment.
- Use "human checkpoint" for payment, restricted topics, and delivery release.

## Final External Requirements

- A Qwen Cloud API key for live smoke evidence.
- A public demo video URL.
- A submitted Devpost project URL.
- After submission, activate the scheduled monitor and set `QWEN_HACKATHON_SUBMISSION_URL` and `QWEN_HACKATHON_VIDEO_URL`.
