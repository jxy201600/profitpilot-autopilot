import fs from "node:fs";
import path from "node:path";
import { rootDir } from "../src/config.mjs";

const repoUrl = process.env.QWEN_HACKATHON_REPO_URL || "https://github.com/jxy201600/profitpilot-autopilot";
const parentRootDir = path.resolve(rootDir, "..", "..", "..");
function loadEnv(file) {
  const env = {};
  if (!fs.existsSync(file)) return env;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    env[match[1]] = match[2].trim().replace(/^["']|["']$/g, "");
  }
  return env;
}
const externalEnv = { ...loadEnv(path.join(parentRootDir, ".env")), ...process.env };
const videoUrl = externalEnv.QWEN_HACKATHON_VIDEO_URL || "";
const backupVideoUrl = externalEnv.QWEN_HACKATHON_BACKUP_VIDEO_URL || "";
const submissionUrl = externalEnv.QWEN_HACKATHON_SUBMISSION_URL || "";
const publicEvidenceBase = `${repoUrl.replace(/\/$/, "")}/blob/main`;
const outDir = path.join(rootDir, "out", "submission");
fs.mkdirSync(outDir, { recursive: true });

const fields = {
  projectName: "ProfitPilot Autopilot",
  tagline: "Qwen Cloud powered inquiry-to-quote autopilot for small businesses.",
  track: "Track 4: Autopilot Agent",
  repositoryUrl: repoUrl,
  demoVideoUrl: videoUrl,
  backupVideoUrl,
  submissionUrl,
  elevatorPitch:
    "ProfitPilot Autopilot turns messy small-business inquiries into quote packets, customer replies, payment checkpoints, and delivery plans using Qwen Cloud.",
  whatItDoes:
    "The agent ingests an inquiry, classifies the business context, applies a compliance gate, generates a scoped quote, drafts a customer response, identifies missing inputs, creates an order draft, and lists delivery files that should be released only after payment confirmation.",
  howItUsesQwenCloud:
    "Live mode uses Qwen Cloud's OpenAI-compatible chat completion endpoint with JSON output. The deterministic fallback keeps tests and demos reliable without secrets while preserving the same schema, normalization layer, tool plan, and workflow gates.",
  inspiration:
    "Small businesses often receive vague inquiries across email, forms, and chat, then spend too much time turning them into quotes, follow-ups, payment checks, and delivery tasks. The project was built to show how Qwen Cloud can act as a practical workflow autopilot for this messy revenue operation, not just as a conversational demo.",
  howWeBuiltIt:
    "We built a Node.js agent with a bounded Qwen Cloud adapter, a strict JSON workflow contract, deterministic fallback mode for repeatable judging, and a web and CLI interface. The workflow separates model reasoning from operational gates: compliance, quote generation, customer reply drafting, missing-input collection, payment checkpointing, and delivery packaging.",
  challenges:
    "The hardest part was making the agent useful while keeping it safe and reproducible. We added schema normalization for model output drift, explicit restricted-topic handling, payment and delivery checkpoints, timeout controls, live smoke evidence, and a deterministic mode so judges can run the same flow without exposing secrets.",
  accomplishments:
    "The project produces real business artifacts instead of a chat transcript: a quote packet, customer reply, missing-input checklist, order draft, tool plan, payment gate, delivery preview, JSON result, validation report, Qwen Cloud live proof, and Alibaba Cloud deployment proof.",
  whatWeLearned:
    "A strong business autopilot needs clear boundaries as much as intelligence. Qwen Cloud is most valuable when its output is constrained by a contract, checked by deterministic guardrails, and connected to a practical workflow that a small operator can understand and verify.",
  whatsNext:
    "Next steps are spreadsheet export, email draft handoff, CRM adapters, multilingual templates, richer audit logs, and optional human approval queues for payment, regulated requests, and final delivery release.",
  technicalDepth:
    "The implementation includes a bounded Qwen Cloud adapter, structured JSON contract, output normalization, explicit tool-plan boundaries, compliance gates, payment and external-posting checkpoints, CLI and web demos, unit tests, live smoke proof, deployment proof, and generated submission assets.",
  builtWith: [
    "Qwen Cloud",
    "Alibaba Cloud ECS",
    "Node.js",
    "OpenAI-compatible Chat Completions",
    "Structured JSON workflows",
  ],
  publicEvidence: [
    `${publicEvidenceBase}/docs/evidence/qwen-live-proof.md`,
    `${publicEvidenceBase}/docs/evidence/deployment-proof.md`,
  ],
  judgingHighlights: [
    "Autopilot business workflow rather than a generic chatbot",
    "Compliance gate before quote generation",
    "Payment confirmation gate before delivery release",
    "Chinese and English workflow support",
    "CLI, web demo, tests, validation, deployment proof, and submission bundle",
  ],
  runCommands: [
    "npm install",
    "npm run validate",
    "npm run start",
  ],
  demoVideoOutline: [
    "Show the default inquiry in the web UI.",
    "Click Run Agent.",
    "Show quote, customer reply, missing inputs, payment gate, delivery preview, and JSON packet.",
    "Run the restricted request demo to show safety blocking.",
    "Show npm run validate and the generated submission bundle.",
  ],
  license: "MIT",
};

const jsonPath = path.join(outDir, "devpost-fields.json");
const mdPath = path.join(outDir, "devpost-fields.md");
fs.writeFileSync(jsonPath, JSON.stringify(fields, null, 2));
fs.writeFileSync(mdPath, `# Devpost Fields

## Project Name
${fields.projectName}

## Tagline
${fields.tagline}

## Track
${fields.track}

## Repository
${fields.repositoryUrl}

## Demo Video URL
${fields.demoVideoUrl || "To be added after YouTube/Vimeo/Youku upload."}

## Backup Video URL
${fields.backupVideoUrl || "Optional backup not configured."}

## Devpost Submission URL
${fields.submissionUrl || "To be added after Devpost submission."}

## Elevator Pitch
${fields.elevatorPitch}

## What It Does
${fields.whatItDoes}

## How It Uses Qwen Cloud
${fields.howItUsesQwenCloud}

## Project Story: Inspiration
${fields.inspiration}

## Project Story: How We Built It
${fields.howWeBuiltIt}

## Project Story: Challenges We Ran Into
${fields.challenges}

## Project Story: Accomplishments
${fields.accomplishments}

## Project Story: What We Learned
${fields.whatWeLearned}

## Project Story: What's Next
${fields.whatsNext}

## Technical Depth
${fields.technicalDepth}

## Built With
${fields.builtWith.map((item) => `- ${item}`).join("\n")}

## Public Evidence
${fields.publicEvidence.map((item) => `- ${item}`).join("\n")}

## Judging Highlights
${fields.judgingHighlights.map((item) => `- ${item}`).join("\n")}

## Run Commands
${fields.runCommands.map((item) => `- \`${item}\``).join("\n")}

## Demo Video Outline
${fields.demoVideoOutline.map((item) => `- ${item}`).join("\n")}

## License
${fields.license}
`);

process.stdout.write(`${JSON.stringify({ ok: true, jsonPath, mdPath }, null, 2)}\n`);
