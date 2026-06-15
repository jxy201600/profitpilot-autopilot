import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { getConfig, rootDir } from "./config.mjs";
import { runProfitPilot } from "./workflow.mjs";

const config = getConfig();
const indexHtml = fs.readFileSync(path.join(rootDir, "public", "index.html"), "utf8");

function sendJson(res, status, body) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  res.end(JSON.stringify(body, null, 2));
}

const server = http.createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    });
    res.end(indexHtml);
    return;
  }
  if (req.method === "POST" && req.url === "/api/run") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 100_000) req.destroy();
    });
    req.on("end", async () => {
      try {
        const payload = JSON.parse(body || "{}");
        const inquiry = String(payload.inquiry || "");
        if (!inquiry.trim()) return sendJson(res, 400, { ok: false, error: "inquiry-required" });
        const result = await runProfitPilot(inquiry, config);
        return sendJson(res, 200, result);
      } catch (error) {
        return sendJson(res, 500, { ok: false, error: error.message });
      }
    });
    return;
  }
  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Not found");
});

server.listen(config.port, config.host, () => {
  console.log(`ProfitPilot Autopilot listening on http://${config.host}:${config.port}`);
});
