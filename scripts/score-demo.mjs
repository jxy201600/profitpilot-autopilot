import fs from "node:fs";
import path from "node:path";
import { scoreSubmissionEvidence } from "../src/scorecard.mjs";

const resultPath = process.argv[2] || path.join("out", "demo", "result.json");
const result = JSON.parse(fs.readFileSync(resultPath, "utf8"));
const scorecard = scoreSubmissionEvidence(result);
process.stdout.write(`${JSON.stringify(scorecard, null, 2)}\n`);
