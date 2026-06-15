import fs from "node:fs";
import path from "node:path";
import { rootDir } from "../src/config.mjs";

const outDir = path.join(rootDir, "out", "submission");
const fieldsPath = path.join(outDir, "devpost-fields.json");
const helperPath = path.join(outDir, "devpost-submit-helper.html");
const officialSubmitUrl = "https://devpost.com/submit-to/29966-global-ai-hackathon-series-with-qwen-cloud/manage/submissions";

if (!fs.existsSync(fieldsPath)) {
  throw new Error("Run npm run devpost:fields before npm run devpost:helper");
}

const fields = JSON.parse(fs.readFileSync(fieldsPath, "utf8"));

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function textBlock(value) {
  return Array.isArray(value) ? value.join("\n") : String(value ?? "");
}

const fieldGroups = [
  {
    title: "Basic Fields",
    description: "Use these for the main project metadata and required links.",
    rows: [
      ["Project name", fields.projectName],
      ["Tagline", fields.tagline],
      ["Track", fields.track],
      ["Repository URL", fields.repositoryUrl],
      ["Demo video URL", fields.demoVideoUrl],
      ["Backup video URL", fields.backupVideoUrl],
      ["Elevator pitch", fields.elevatorPitch],
    ],
  },
  {
    title: "Project Story",
    description: "Use these for Devpost story prompts such as Inspiration and How we built it.",
    rows: [
      ["Inspiration", fields.inspiration],
      ["What it does", fields.whatItDoes],
      ["How we built it", fields.howWeBuiltIt],
      ["Challenges we ran into", fields.challenges],
      ["Accomplishments that we're proud of", fields.accomplishments],
      ["What we learned", fields.whatWeLearned],
      ["What's next", fields.whatsNext],
    ],
  },
  {
    title: "Technical Evidence",
    description: "Use these for built-with, run instructions, evidence links, and judging notes.",
    rows: [
      ["How it uses Qwen Cloud", fields.howItUsesQwenCloud],
      ["Technical depth", fields.technicalDepth],
      ["Built with", fields.builtWith],
      ["Public evidence", fields.publicEvidence],
      ["Judging highlights", fields.judgingHighlights],
      ["Run commands", fields.runCommands],
      ["License", fields.license],
    ],
  },
].map((group) => ({
  ...group,
  rows: group.rows.filter(([, value]) => textBlock(value).trim()),
})).filter((group) => group.rows.length);

const finalCommand = `npm run qwen-hackathon-finalize -- --video-url "${fields.demoVideoUrl}" --submission-url "<paste Devpost project URL here>"`;

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>ProfitPilot Autopilot Devpost Helper</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f6f8fb;
      --panel: #ffffff;
      --ink: #172033;
      --muted: #5e687c;
      --line: #d9e0ec;
      --accent: #0f62fe;
      --accent-dark: #054ada;
      --ok: #0f7b4b;
      --warn: #8a5a00;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      color: var(--ink);
      background: var(--bg);
      line-height: 1.55;
    }
    main {
      width: min(1120px, calc(100% - 32px));
      margin: 0 auto;
      padding: 32px 0 56px;
    }
    header {
      display: grid;
      gap: 12px;
      padding: 28px 0 20px;
      border-bottom: 1px solid var(--line);
    }
    h1 {
      margin: 0;
      font-size: clamp(28px, 4vw, 44px);
      line-height: 1.05;
      letter-spacing: 0;
    }
    h2 {
      margin: 0 0 12px;
      font-size: 20px;
      letter-spacing: 0;
    }
    p { margin: 0; color: var(--muted); }
    a { color: var(--accent); }
    .grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 320px;
      gap: 20px;
      align-items: start;
      margin-top: 20px;
    }
    section, aside {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 18px;
      box-shadow: 0 10px 26px rgba(28, 44, 74, 0.06);
    }
    .steps {
      display: grid;
      gap: 10px;
      margin: 14px 0 0;
      padding: 0;
      list-style: none;
    }
    .steps li {
      display: grid;
      grid-template-columns: 28px 1fr;
      gap: 10px;
      align-items: start;
      color: var(--muted);
    }
    .num {
      display: grid;
      place-items: center;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #e8f0ff;
      color: var(--accent-dark);
      font-weight: 700;
      font-size: 13px;
    }
    .field {
      display: grid;
      gap: 8px;
      padding: 14px 0;
      border-top: 1px solid var(--line);
    }
    .field:first-of-type { border-top: 0; }
    .group {
      padding: 16px 0 8px;
      border-top: 1px solid var(--line);
    }
    .group:first-of-type {
      padding-top: 0;
      border-top: 0;
    }
    .group p {
      margin-bottom: 4px;
      font-size: 14px;
    }
    .label {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      font-weight: 700;
    }
    textarea, input {
      width: 100%;
      border: 1px solid var(--line);
      border-radius: 6px;
      padding: 10px 12px;
      color: var(--ink);
      background: #fbfcff;
      font: inherit;
      resize: vertical;
    }
    textarea { min-height: 92px; }
    .single { min-height: 44px; resize: none; }
    button, .button {
      border: 0;
      border-radius: 6px;
      background: var(--accent);
      color: white;
      padding: 8px 12px;
      font: inherit;
      font-weight: 700;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
    }
    button:hover, .button:hover { background: var(--accent-dark); }
    .copy {
      background: #eef4ff;
      color: var(--accent-dark);
    }
    .copy:hover {
      background: #dfeaff;
      color: var(--accent-dark);
    }
    .note {
      padding: 12px;
      border-radius: 6px;
      background: #f7fbf9;
      border: 1px solid #cce7dc;
      color: var(--ok);
      font-size: 14px;
    }
    .warn {
      background: #fff8e8;
      border-color: #f0d794;
      color: var(--warn);
    }
    .side-stack {
      display: grid;
      gap: 14px;
      position: sticky;
      top: 16px;
    }
    code {
      font-family: "Cascadia Mono", Consolas, monospace;
      font-size: 13px;
      word-break: break-all;
    }
    .cmd {
      display: block;
      padding: 10px;
      border-radius: 6px;
      background: #111827;
      color: #e5edf8;
      overflow-wrap: anywhere;
    }
    @media (max-width: 860px) {
      main { width: min(100% - 20px, 720px); }
      .grid { grid-template-columns: 1fr; }
      .side-stack { position: static; }
    }
  </style>
</head>
<body>
  <main>
    <header>
      <h1>ProfitPilot Autopilot Devpost Helper</h1>
      <p>Use this local helper to copy the verified public submission fields into Devpost. It contains no secrets.</p>
    </header>
    <div class="grid">
      <section>
        <h2>Copy Fields</h2>
        ${fieldGroups.map((group, groupIndex) => `<div class="group">
          <h2>${escapeHtml(group.title)}</h2>
          <p>${escapeHtml(group.description)}</p>
          ${group.rows.map(([label, value], rowIndex) => {
            const id = `field-${groupIndex}-${rowIndex}`;
            const text = textBlock(value);
            const single = text.length < 90 && !text.includes("\n");
            return `<div class="field">
              <div class="label">
                <span>${escapeHtml(label)}</span>
                <button class="copy" type="button" data-copy="${id}">Copy</button>
              </div>
              <textarea id="${id}" ${single ? 'class="single"' : ""} readonly>${escapeHtml(text)}</textarea>
            </div>`;
          }).join("\n")}
        </div>`).join("\n")}
      </section>
      <aside class="side-stack">
        <div>
          <h2>Submission Steps</h2>
          <ol class="steps">
            <li><span class="num">1</span><span>Open the official Devpost submission manager.</span></li>
            <li><span class="num">2</span><span>Create or edit the project submission.</span></li>
            <li><span class="num">3</span><span>Paste the fields from this page in order.</span></li>
            <li><span class="num">4</span><span>Review account, team, eligibility, and terms fields yourself.</span></li>
            <li><span class="num">5</span><span>After Devpost creates the project URL, run the finalize command below.</span></li>
          </ol>
        </div>
        <div>
          <h2>Official Page</h2>
          <a class="button" href="${officialSubmitUrl}" target="_blank" rel="noreferrer">Open Devpost</a>
        </div>
        <div class="note">
          Video: the submitted demo is 75 seconds, public on YouTube, and uses English visible text. Official rules do not require narration.
        </div>
        <div class="note warn">
          Do not paste API keys, private addresses, cookies, or local paths into Devpost. Only use the public fields shown here.
        </div>
        <div>
          <h2>Finalize</h2>
          <code class="cmd">${escapeHtml(finalCommand)}</code>
        </div>
      </aside>
    </div>
  </main>
  <script>
    for (const button of document.querySelectorAll("[data-copy]")) {
      button.addEventListener("click", async () => {
        const target = document.getElementById(button.dataset.copy);
        await navigator.clipboard.writeText(target.value);
        const old = button.textContent;
        button.textContent = "Copied";
        setTimeout(() => { button.textContent = old; }, 1200);
      });
    }
  </script>
</body>
</html>
`;

fs.writeFileSync(helperPath, html);
process.stdout.write(`${JSON.stringify({ ok: true, helperPath, officialSubmitUrl }, null, 2)}\n`);
