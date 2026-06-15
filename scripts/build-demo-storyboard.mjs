import fs from "node:fs";
import path from "node:path";
import { rootDir } from "../src/config.mjs";

const outDir = path.join(rootDir, "out", "demo-capture");
fs.mkdirSync(outDir, { recursive: true });

const storyboard = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>ProfitPilot Autopilot Demo Storyboard</title>
  <style>
    body { margin: 0; font-family: Inter, system-ui, sans-serif; background: #f4f8fb; color: #172033; }
    main { width: min(1080px, calc(100vw - 40px)); margin: 0 auto; padding: 32px 0; }
    section { min-height: 86vh; display: grid; align-content: center; border-bottom: 1px solid #d9e2ef; }
    h1 { font-size: 44px; margin: 0 0 12px; }
    h2 { font-size: 34px; margin: 0 0 12px; }
    p, li { font-size: 22px; line-height: 1.45; }
    code { background: #101828; color: #e8f2ff; padding: 4px 8px; border-radius: 6px; }
    .badge { display: inline-block; color: white; background: linear-gradient(135deg,#0f7b8a,#6844c6); padding: 8px 12px; border-radius: 999px; font-weight: 800; margin-bottom: 18px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
    .card { background: white; border: 1px solid #d9e2ef; border-radius: 10px; padding: 18px; box-shadow: 0 18px 60px rgba(31,50,80,.08); }
  </style>
</head>
<body>
<main>
  <section>
    <span class="badge">Qwen Cloud Hackathon · Track 4 Autopilot Agent</span>
    <h1>ProfitPilot Autopilot</h1>
    <p>Turns messy small-business inquiries into quote packets, customer replies, payment checkpoints, and delivery plans.</p>
  </section>
  <section>
    <h2>Problem</h2>
    <div class="grid">
      <div class="card"><p>Small teams lose quote versions, follow-ups, payment state, and delivery files across email, chat, and spreadsheets.</p></div>
      <div class="card"><p>They need a safe workflow packet, not just a chatbot answer.</p></div>
    </div>
  </section>
  <section>
    <h2>Autopilot Flow</h2>
    <ul>
      <li>Ingest inquiry</li>
      <li>Check compliance</li>
      <li>Generate quote and reply</li>
      <li>Create order draft</li>
      <li>Gate delivery behind payment confirmation</li>
    </ul>
  </section>
  <section>
    <h2>Live Demo Steps</h2>
    <ol>
      <li>Open <code>http://127.0.0.1:8787</code></li>
      <li>Click <code>Run Agent</code></li>
      <li>Show quote, reply, missing inputs, checkpoints, and JSON packet</li>
      <li>Run <code>npm run validate</code></li>
    </ol>
  </section>
  <section>
    <h2>Safety</h2>
    <p>Restricted requests are blocked before quote generation. Payment is never treated as confirmed by model output.</p>
  </section>
</main>
</body>
</html>`;

const storyboardPath = path.join(outDir, "storyboard.html");
fs.writeFileSync(storyboardPath, storyboard);
process.stdout.write(`${JSON.stringify({ ok: true, storyboardPath }, null, 2)}\n`);
