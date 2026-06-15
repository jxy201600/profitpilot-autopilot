# Qwen Cloud Live Setup

Use this checklist before recording the final demo or submitting Devpost.

## 1. Create The Right Key

Create a Model Studio / DashScope API key from Alibaba Cloud. The key should look like an API token, not an account ID, app ID, URL, or password.

Expected signs:

- It normally starts with `sk-`.
- It should not contain spaces.
- It should be longer than a short account or phone-style identifier.
- Keep it only in local `.env`; never paste it into README, screenshots, or Devpost.

## 2. Match Region And Endpoint

Beijing and Singapore keys are separate. Use the endpoint that matches where the key was created.

Singapore:

```env
QWEN_BASE_URL=https://dashscope-intl.aliyuncs.com/compatible-mode/v1
```

China mainland / Beijing:

```env
QWEN_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
```

If the wrong region is used, the API can return authentication failures even when the key format looks correct.

## 3. Recommended `.env`

```env
DASHSCOPE_API_KEY=sk-...
PROFITPILOT_DEMO_MODE=false
QWEN_MODEL=qwen-plus
QWEN_BASE_URL=https://dashscope-intl.aliyuncs.com/compatible-mode/v1
```

`qwen-plus` is the safest live smoke model because it is used in official OpenAI-compatible examples. If your Model Studio account explicitly exposes Qwen3.7-Plus, you can set:

```env
QWEN_MODEL=qwen3.7-plus
```

## 4. Verify Without Leaking Secrets

```bash
npm run live:config
npm run live:smoke
npm run live:proof
```

The config check reports only key shape and endpoint metadata. It never prints the key value.

## 5. Final Submission Evidence

Before submitting, capture one successful live smoke output showing:

- `ok: true`
- `provider: qwen-cloud`
- the model name

Do not include the API key or `.env` file in the video.
