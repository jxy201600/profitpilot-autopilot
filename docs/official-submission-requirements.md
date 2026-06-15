# Official Submission Requirements

Sources checked on 2026-06-15:

- Overview: https://qwencloud-hackathon.devpost.com/
- Official Rules: https://qwencloud-hackathon.devpost.com/rules

If the Overview and Official Rules disagree, follow the Official Rules.

## Deadline

- Submit before July 9, 2026, 2:00 PM Pacific Time.

## Track

- Submit under Track 4: Autopilot Agent.
- Track fit: the project must automate a real-world business workflow end to end, handle ambiguous inputs, invoke or prepare external tools, and include human-in-the-loop checkpoints at critical decisions.

## Required Devpost Deliverables

- Public open-source code repository.
- Repository must contain all source code, assets, and instructions required for the project to function.
- Repository must include a visible open-source license file.
- Text description explaining project features and functionality.
- Proof of Alibaba Cloud Deployment.
- Architecture diagram.
- Public demonstration video.
- Track selection.
- Working project access for judging and testing through a website, functioning demo, or test build.

## Video Requirements

- Less than 3 minutes. Judges are not required to watch beyond 3 minutes.
- Must show the project functioning on the intended device/platform.
- Must be uploaded and publicly visible on YouTube, Vimeo, or Youku.
- The video URL must be added to the Devpost submission form.
- Do not include third-party trademarks, copyrighted music, or copyrighted material unless permission is available.
- Keep all visible material in English, or provide English translation/subtitles.
- Do not show secrets, `.env`, API keys, private accounts, or personal payment data.

## Alibaba Cloud Deployment Proof

The Official Rules require proof that the backend is running on Alibaba Cloud and a link to a code file in the repository demonstrating use of Alibaba Cloud services and APIs.

For this project, use these proof targets:

- Code/API proof: `src/qwenClient.mjs` demonstrates Qwen Cloud OpenAI-compatible API usage.
- Deployment proof generator: `scripts/export-deployment-proof.mjs`.
- Generated proof artifact: `out/deployment-proof/deployment-proof.md`.
- Public deployment proof artifact: `docs/evidence/deployment-proof.md`.
- Public Qwen live proof artifact: `docs/evidence/qwen-live-proof.md`.
- Optional short deployment proof video: separate from the main demo if recorded.

## Testing Access

- Provide judging access free of charge and without restriction until the judging period ends.
- If the demo is private, include test credentials in Devpost testing instructions.
- Judges may rely on the text description, images, and video even if they do not run the project, so video and docs must be self-contained.

## Language

- All submission materials must be in English.
- If any material is not English, provide English translation for video, text description, testing instructions, and all other submitted materials.

## Optional Blog Prize

- To be eligible for the Blog Post Award, publish a public blog or social post about the journey building with QwenCloud and include the link in the eligible Devpost submission.

## Compliance And IP

- Submission must be original work and owned by the entrant/team/organization.
- Third-party SDKs, APIs, assets, music, screenshots, and open-source components must be used with proper authorization and license compliance.
- Do not include restricted, unlawful, or privacy-invasive workflows.

## Judging Criteria

- Innovation & AI Creativity: 30%.
- Technical Depth & Engineering: 30%.
- Problem Value & Impact: 25%.
- Presentation & Documentation: 15%.

## Current Project Mapping

- Public repository: configured through `QWEN_HACKATHON_REPO_URL`.
- Main demo video file: `out/demo-video/profitpilot-autopilot-demo.mp4`.
- Devpost copy source: `out/submission/SUBMISSION_BUNDLE.md`.
- Devpost fields: `out/submission/devpost-fields.md`.
- Architecture diagram: `docs/architecture.svg`.
- Live proof: `out/live-proof/qwen-live-proof.md`.
- Deployment proof: `out/deployment-proof/deployment-proof.md`.
- Public live proof: `docs/evidence/qwen-live-proof.md`.
- Public deployment proof: `docs/evidence/deployment-proof.md`.
