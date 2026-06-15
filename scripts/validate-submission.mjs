import fs from "node:fs";
import path from "node:path";

const rootDir = path.resolve(new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));

const requiredFiles = [
  "README.md",
  "LICENSE",
  "package.json",
  ".env.example",
  "Dockerfile",
  ".github/workflows/ci.yml",
  "src/workflow.mjs",
  "src/qwenClient.mjs",
  "src/server.mjs",
  "public/index.html",
  "docs/architecture.md",
  "docs/architecture.svg",
  "docs/devpost-submission.md",
  "docs/demo-video-script.md",
  "docs/blog-post-draft.md",
  "docs/deployment-proof-template.md",
  "docs/final-submission-checklist.md",
  "docs/judging-scorecard.md",
  "docs/winning-submission-plan.md",
  "scripts/check-live-config.mjs",
];

function read(file) {
  return fs.readFileSync(path.join(rootDir, file), "utf8");
}

function exists(file) {
  return fs.existsSync(path.join(rootDir, file));
}

const missing = requiredFiles.filter((file) => !exists(file));
const packageJson = JSON.parse(read("package.json"));
const readme = read("README.md");
const envExample = read(".env.example");
const devpost = read("docs/devpost-submission.md");
const architecture = read("docs/architecture.md");
const winningPlan = read("docs/winning-submission-plan.md");

const checks = [
  { name: "required-files", ok: missing.length === 0, detail: missing },
  { name: "mit-license", ok: /MIT/i.test(read("LICENSE")) },
  { name: "qwen-cloud-mentioned", ok: /Qwen Cloud/i.test(readme) && /Qwen Cloud/i.test(devpost) },
  { name: "track-4-mentioned", ok: /Track 4/i.test(readme) && /Autopilot Agent/i.test(devpost) },
  { name: "api-key-not-committed", ok: !/DASHSCOPE_API_KEY=.+[A-Za-z0-9_-]{8,}/.test(envExample) },
  { name: "live-mode-configurable", ok: /DASHSCOPE_API_KEY/.test(envExample) && /QWEN_MODEL/.test(envExample) },
  { name: "deterministic-demo", ok: /deterministic demo/i.test(readme) && /deterministic-demo/.test(read("src/workflow.mjs")) },
  { name: "compliance-gate", ok: /restricted/i.test(read("src/compliance.mjs")) && /compliance|safety/i.test(read("docs/demo-video-script.md")) },
  { name: "payment-gate", ok: /payment/i.test(readme) && /payment/i.test(read("src/workflow.mjs")) },
  { name: "deployment-proof", ok: /Alibaba Cloud/i.test(read("docs/deployment-proof-template.md")) },
  { name: "architecture-diagram", ok: /mermaid/i.test(architecture) && exists("docs/architecture.svg") },
  {
    name: "winning-plan",
    ok: /Track 4/i.test(winningPlan) &&
      /Autopilot Agent/i.test(winningPlan) &&
      /Blog Post Award/i.test(winningPlan) &&
      /human checkpoint/i.test(winningPlan),
  },
  { name: "ci-validate", ok: /npm run validate/.test(read(".github/workflows/ci.yml")) },
  { name: "package-scripts", ok: ["check", "test", "demo", "demo:zh", "score", "validate", "live:config", "live:smoke", "start"].every((script) => packageJson.scripts?.[script]) },
  {
    name: "submission-assets",
    ok: fs.existsSync(path.join(rootDir, "out", "submission", "SUBMISSION_BUNDLE.md")) &&
      fs.existsSync(path.join(rootDir, "out", "submission", "devpost-fields.json")) &&
      fs.existsSync(path.join(rootDir, "out", "deployment-proof", "deployment-proof.md")) &&
      fs.existsSync(path.join(rootDir, "out", "demo-capture", "storyboard.html")),
  },
];

const failed = checks.filter((check) => !check.ok);
const result = {
  ok: failed.length === 0,
  checkedAt: new Date().toISOString(),
  checks,
  failed,
};

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
if (failed.length) process.exit(1);
