# Alibaba Cloud Deployment Proof Template

Use this file as the source for the final Devpost deployment proof.

## Environment

- Cloud provider: Alibaba Cloud
- Service: ECS
- Runtime: Node.js 20+
- App bind host: `127.0.0.1`
- Public exposure: reverse proxy with HTTPS only when demo is public
- Repository path on server: `<fill after deployment>`

## Commands

```bash
npm install
npm test
npm run demo
PORT=8787 HOST=127.0.0.1 npm run start
```

## Qwen Cloud Configuration

```bash
DASHSCOPE_API_KEY=<configured locally>
QWEN_MODEL=qwen3.7-plus
QWEN_BASE_URL=https://dashscope-intl.aliyuncs.com/compatible-mode/v1
PROFITPILOT_DEMO_MODE=false
```

## Evidence To Capture

- Screenshot of ECS instance or deployment terminal.
- Screenshot of app running at the public or tunneled HTTPS URL.
- Screenshot of `/api/run` returning `mode: "qwen-cloud"` when API key is configured.
- Screenshot or log of `npm test` passing.

## Security Notes

- Do not expose `.env`.
- Do not expose an admin route.
- Keep payment confirmation manual unless an official merchant API is configured.
- Keep the app behind HTTPS for public judging access.
