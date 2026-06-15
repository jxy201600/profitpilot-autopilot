# Final Submission Checklist

## Required

- [ ] Public repository created.
- [ ] MIT license included.
- [ ] README has run instructions.
- [ ] `docs/official-submission-requirements.md` reviewed against the current Devpost pages.
- [ ] `docs/qwen-cloud-live-setup.md` checked for key region and endpoint.
- [ ] `docs/technical-depth-evidence.md` reviewed for judge-facing technical depth.
- [ ] Qwen Cloud live mode tested with `DASHSCOPE_API_KEY`.
- [ ] `npm run live:config` passes without printing secrets.
- [ ] `npm run live:proof` generated `out/live-proof/qwen-live-proof.md`.
- [ ] Alibaba Cloud ECS deployment proof captured.
- [ ] Architecture diagram included.
- [ ] Demo video is under 3 minutes, English or English-subtitled, free of secrets, and publicly uploaded to YouTube, Vimeo, or Youku.
- [ ] `npm run demo:video` generated `out/demo-video/profitpilot-autopilot-demo.mp4`, or an equivalent public recording was uploaded.
- [ ] Devpost project page submitted before July 9, 2026, 2:00 PM Pacific Time.
- [ ] Working project access provided through website, functioning demo, or test build.
- [ ] Submission language is English, or all non-English material has English translation.
- [ ] Proof of Alibaba Cloud Deployment includes a repo code-file link and deployment proof artifact.

## Quality

- [ ] `npm run check` passes.
- [ ] `npm test` passes.
- [ ] `npm run demo` passes.
- [ ] `npm run demo:zh` passes.
- [ ] `npm run score` shows a strong scorecard.
- [ ] `npm run validate` passes.
- [ ] `npm run live:smoke` passes or safely skips when the key is intentionally absent.
- [ ] `npm run deployment:proof` generated deployment proof.
- [ ] `npm run submission:bundle` generated a single Devpost copy source.
- [ ] `npm run devpost:fields` generated structured Devpost fields.
- [ ] `npm run demo:storyboard` generated storyboard HTML for recording.
- [ ] Restricted request demo shows compliance block.
- [ ] Chinese and English workflow shown in materials.
- [ ] Markdown formatting is consistent: headings, tables, commands, and file paths are cleanly formatted.

## Prize Strategy

- [ ] Submit to Track 4: Autopilot Agent.
- [ ] Submit or publish the blog post draft for the Blog Post Award.
- [ ] Highlight real business workflow value.
- [ ] Highlight Qwen Cloud API usage.
- [ ] Highlight Alibaba Cloud deployment.
- [ ] Highlight safety gates and human checkpoints.

## Human Actions

- [ ] Create or confirm Qwen Cloud account and API key.
- [ ] Create public code repository.
- [ ] Record/upload demo video.
- [ ] Submit Devpost form.
- [ ] After Devpost submission, set `QWEN_HACKATHON_SUBMISSION_URL` for monitoring.
