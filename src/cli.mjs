import fs from "node:fs";
import path from "node:path";
import { getConfig } from "./config.mjs";
import { runProfitPilot } from "./workflow.mjs";
import { renderMarkdown } from "./render.mjs";

function argValue(name, fallback = "") {
  const index = process.argv.indexOf(name);
  if (index === -1 || index + 1 >= process.argv.length) return fallback;
  return process.argv[index + 1];
}

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

const sample = argValue("--sample");
const outDir = argValue("--out", "out/run");
const inquiry = sample ? fs.readFileSync(sample, "utf8") : await readStdin();
if (!inquiry.trim()) {
  process.stderr.write("Provide inquiry text through --sample <file> or stdin.\n");
  process.exit(1);
}

const config = getConfig();
const result = await runProfitPilot(inquiry, config);
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "result.json"), JSON.stringify(result, null, 2));
fs.writeFileSync(path.join(outDir, "packet.md"), renderMarkdown(result));
process.stdout.write(`${JSON.stringify({
  ok: result.ok,
  mode: result.mode,
  outDir,
  packet: path.join(outDir, "packet.md"),
  result: path.join(outDir, "result.json"),
  service: result.plan?.service || "",
  amount: result.packet?.orderDraft?.amount || 0,
  currency: result.packet?.orderDraft?.currency || "",
}, null, 2)}\n`);
