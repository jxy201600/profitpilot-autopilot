# Repository Publish Guide

The submission requires a public open-source repository.

## Recommended Repository

- Name: `profitpilot-autopilot`
- Visibility: public
- License: MIT
- Description: `Qwen Cloud Autopilot Agent for small-business inquiry-to-quote workflows.`

## Publish Commands

From this directory:

```bash
git init
git add .
git commit -m "Initial ProfitPilot Autopilot hackathon submission"
git branch -M main
git remote add origin <PUBLIC_REPOSITORY_URL>
git push -u origin main
```

After publishing, set the monitor value in the parent project `.env`:

```bash
QWEN_HACKATHON_REPO_URL=<PUBLIC_REPOSITORY_URL>
```

## Before Push

```bash
npm run validate
npm run live:smoke
```

`live:smoke` skips safely when `DASHSCOPE_API_KEY` is not configured.

## Token Note

The local publisher can upload the project with a `public_repo` token. Uploading `.github/workflows/ci.yml` through the GitHub API requires an additional `workflow` scope, so the automation skips that file unless you publish with a token that has workflow permission.
