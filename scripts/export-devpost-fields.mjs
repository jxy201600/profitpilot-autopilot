import fs from "node:fs";
import path from "node:path";
import { rootDir } from "../src/config.mjs";

const repoUrl = process.env.QWEN_HACKATHON_REPO_URL || "https://github.com/jxy201600/profitpilot-autopilot";
const outDir = path.join(rootDir, "out", "submission");
fs.mkdirSync(outDir, { recursive: true });

const fields = {
  projectName: "ProfitPilot Autopilot",
  tagline: "Qwen Cloud powered inquiry-to-quote autopilot for small businesses.",
  track: "Track 4: Autopilot Agent",
  repositoryUrl: repoUrl,
  elevatorPitch:
    "ProfitPilot Autopilot turns messy small-business inquiries into quote packets, customer replies, payment checkpoints, and delivery plans using Qwen Cloud.",
  whatItDoes:
    "The agent ingests an inquiry, classifies the business context, applies a compliance gate, generates a scoped quote, drafts a customer response, identifies missing inputs, creates an order draft, and lists delivery files that should be released only after payment confirmation.",
  howItUsesQwenCloud:
    "Live mode uses Qwen Cloud's OpenAI-compatible chat completion endpoint with JSON output. The deterministic fallback keeps tests and demos reliable without secrets while preserving the same schema, normalization layer, tool plan, and workflow gates.",
  technicalDepth:
    "The implementation includes a bounded Qwen Cloud adapter, structured JSON contract, output normalization, explicit tool-plan boundaries, compliance gates, payment and external-posting checkpoints, CLI and web demos, unit tests, live smoke proof, deployment proof, and generated submission assets.",
  builtWith: [
    "Qwen Cloud",
    "Alibaba Cloud ECS",
    "Node.js",
    "OpenAI-compatible Chat Completions",
    "Structured JSON workflows",
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

## Elevator Pitch
${fields.elevatorPitch}

## What It Does
${fields.whatItDoes}

## How It Uses Qwen Cloud
${fields.howItUsesQwenCloud}

## Technical Depth
${fields.technicalDepth}

## Built With
${fields.builtWith.map((item) => `- ${item}`).join("\n")}

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
