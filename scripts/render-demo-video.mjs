import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { rootDir, getConfig } from "../src/config.mjs";
import { runProfitPilot } from "../src/workflow.mjs";

const require = createRequire(import.meta.url);
const outDir = path.join(rootDir, "out", "demo-video");
const frameDir = path.join(outDir, "frames");
fs.mkdirSync(frameDir, { recursive: true });

const sampleInquiry = "Hi, we run a small wholesale snack brand. We receive product inquiries from distributors by email and WeChat, but our team loses track of quote versions, follow-ups, and payment status. Can you set up a lightweight workflow that turns inquiry text into a quote, follow-up checklist, and customer reply? We prefer Chinese and English templates. We need something we can use this week.";

function firstExisting(candidates) {
  return candidates.filter(Boolean).find((candidate) => fs.existsSync(candidate)) || "";
}

function findPython() {
  const bundledPython = process.env.USERPROFILE
    ? path.join(process.env.USERPROFILE, ".cache", "codex-runtimes", "codex-primary-runtime", "dependencies", "python", "python.exe")
    : "";
  return firstExisting([
    process.env.PYTHON_PATH,
    bundledPython,
    "python.exe",
    "python",
  ]);
}

function findFfmpeg() {
  if (process.env.FFMPEG_PATH && fs.existsSync(process.env.FFMPEG_PATH)) return process.env.FFMPEG_PATH;
  try {
    const installed = require("@ffmpeg-installer/ffmpeg");
    if (installed?.path && fs.existsSync(installed.path)) return installed.path;
  } catch {
    // Optional dependency for local rendering only.
  }
  const workspaceTool = path.resolve(
    rootDir,
    "..",
    "..",
    "..",
    ".tools",
    "ffmpeg",
    "node_modules",
    "@ffmpeg-installer",
    "win32-x64",
    "ffmpeg.exe",
  );
  return firstExisting([
    workspaceTool,
    "ffmpeg.exe",
    "ffmpeg",
  ]);
}

function readJsonIfExists(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { ...options, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(`${path.basename(command)} exited ${code}: ${stderr || stdout}`));
    });
  });
}

function quote(value) {
  return `'${String(value).replace(/'/g, "'\\''")}'`;
}

async function main() {
  const python = findPython();
  const ffmpeg = findFfmpeg();
  if (!python) throw new Error("python-not-found");
  if (!ffmpeg) throw new Error("ffmpeg-not-found; set FFMPEG_PATH or install @ffmpeg-installer/ffmpeg");

  const config = getConfig();
  const result = await runProfitPilot(sampleInquiry, config);
  const blocked = await runProfitPilot("Need CBD and THC customer reply automation for cross-border sales.", config);
  const liveProof = readJsonIfExists(path.join(rootDir, "out", "live-proof", "qwen-live-proof.json")) || {};
  const data = {
    generatedAt: new Date().toISOString(),
    result,
    blocked,
    liveProof,
    slides: [
      { id: "intro", duration: 7 },
      { id: "problem", duration: 8 },
      { id: "workflow", duration: 9 },
      { id: "toolplan", duration: 8 },
      { id: "quote", duration: 10 },
      { id: "reply", duration: 10 },
      { id: "safety", duration: 8 },
      { id: "live", duration: 8 },
      { id: "ready", duration: 7 },
    ],
  };

  const dataPath = path.join(outDir, "demo-video-data.json");
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  await run(python, [path.join(rootDir, "scripts", "render_demo_slides.py"), dataPath, frameDir]);

  const concatPath = path.join(outDir, "slides.ffconcat");
  const concat = ["ffconcat version 1.0"];
  data.slides.forEach((slide, index) => {
    const frame = path.join(frameDir, `slide-${String(index + 1).padStart(2, "0")}.png`);
    concat.push(`file ${quote(frame.replace(/\\/g, "/"))}`);
    concat.push(`duration ${slide.duration}`);
  });
  const last = path.join(frameDir, `slide-${String(data.slides.length).padStart(2, "0")}.png`);
  concat.push(`file ${quote(last.replace(/\\/g, "/"))}`);
  fs.writeFileSync(concatPath, concat.join("\n"));

  const videoPath = path.join(outDir, "profitpilot-autopilot-demo.mp4");
  const ffmpegArgs = [
    "-y",
    "-f", "concat",
    "-safe", "0",
    "-i", concatPath,
    "-vf", "fps=30,format=yuv420p",
    "-c:v", "libx264",
    "-preset", "veryfast",
    "-movflags", "+faststart",
    videoPath,
  ];
  try {
    await run(ffmpeg, ffmpegArgs);
  } catch {
    await run(ffmpeg, [
      "-y",
      "-f", "concat",
      "-safe", "0",
      "-i", concatPath,
      "-vf", "fps=30,format=yuv420p",
      "-c:v", "mpeg4",
      "-q:v", "3",
      videoPath,
    ]);
  }

  const bytes = fs.statSync(videoPath).size;
  const metaPath = path.join(outDir, "profitpilot-autopilot-demo.json");
  fs.writeFileSync(metaPath, JSON.stringify({
    ok: true,
    videoPath,
    bytes,
    durationSeconds: data.slides.reduce((sum, slide) => sum + slide.duration, 0),
    generatedAt: new Date().toISOString(),
    mode: result.mode,
    liveProofOk: liveProof.ok === true,
  }, null, 2));
  process.stdout.write(`${JSON.stringify({ ok: true, videoPath, metaPath, bytes }, null, 2)}\n`);
}

main().catch((error) => {
  process.stdout.write(`${JSON.stringify({ ok: false, error: error.message }, null, 2)}\n`);
  process.exitCode = 1;
});
