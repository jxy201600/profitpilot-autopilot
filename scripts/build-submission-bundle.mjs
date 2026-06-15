import fs from "node:fs";
import path from "node:path";
import { rootDir } from "../src/config.mjs";

const outDir = path.join(rootDir, "out", "submission");
fs.mkdirSync(outDir, { recursive: true });

function read(file) {
  return fs.readFileSync(path.join(rootDir, file), "utf8");
}

const repoUrl = process.env.QWEN_HACKATHON_REPO_URL || "https://github.com/jxy201600/profitpilot-autopilot";
const submission = `# ProfitPilot Autopilot Submission Bundle

## Devpost Fields

${read("docs/devpost-submission.md")}

## Repository

${repoUrl}

## Qwen Cloud Live Setup

Use docs/qwen-cloud-live-setup.md before recording the final video.

## Official Submission Requirements

Use docs/official-submission-requirements.md as the final deliverable checklist.

## Architecture

- Markdown: docs/architecture.md
- Diagram: docs/architecture.svg

## Technical Depth Evidence

${read("docs/technical-depth-evidence.md")}

## Public Evidence

- Qwen Cloud live proof: docs/evidence/qwen-live-proof.md
- Deployment proof: docs/evidence/deployment-proof.md

## Demo Video

Use docs/demo-video-script.md.

## Blog Post Award Draft

Use docs/blog-post-draft.md.

## Winning Submission Plan

${read("docs/winning-submission-plan.md")}

## Required Commands

\`\`\`bash
npm install
npm run validate
npm run start
\`\`\`

## Final Checklist

${read("docs/final-submission-checklist.md")}
`;

const bundlePath = path.join(outDir, "SUBMISSION_BUNDLE.md");
fs.writeFileSync(bundlePath, submission);
process.stdout.write(`${JSON.stringify({ ok: true, bundlePath }, null, 2)}\n`);
