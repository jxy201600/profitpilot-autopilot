# Demo Video Script

Target length: 2 minutes 30 seconds.

Automated render option:

```bash
npm run demo:video
```

This creates `out/demo-video/profitpilot-autopilot-demo.mp4`. The rendered video is caption-first and does not include secrets.

The generated video is intentionally silent. The Official Rules require working footage under 3 minutes on YouTube, Vimeo, or Youku; they do not require audio or narration. Extra subtitles are not needed because the visible slide text is already in English.

## 0:00-0:20 Intro

"This is ProfitPilot Autopilot, a Qwen Cloud powered agent for small-business inquiry-to-quote workflows. It is built for the Autopilot Agent track."

Show the homepage and the sample inquiry.

## 0:20-0:55 Run The Agent

Paste or use the default wholesale inquiry. Click **Run Agent**.

Narration:

"The agent classifies the customer request, checks compliance, plans the quote, drafts the customer reply, creates an order draft, and adds delivery gates."

## 0:55-1:30 Show The Output

Show:

- mode,
- quote amount and currency,
- customer reply,
- missing inputs,
- tool plan and external-system checkpoints,
- human checkpoints,
- JSON packet.

Narration:

"The output is not a chat answer. It is a structured workflow packet that can be passed to order creation, payment confirmation, and delivery preparation."

Also show the tool plan:

- compliance gate,
- spreadsheet export,
- email draft,
- payment confirmation,
- delivery packet packaging.

## 1:30-1:55 Safety

Switch to a restricted sample such as "CBD/THC product reply automation" and show it is blocked.

Narration:

"The compliance gate runs before quote generation. The agent does not price or deliver restricted requests."

## 1:55-2:20 CLI And Artifacts

Show:

```bash
npm test
npm run demo
npm run score
```

Show `out/demo/packet.md`.

## 2:20-2:30 Close

"Live mode uses Qwen Cloud's OpenAI-compatible API. Demo mode is deterministic so judges can run it without secrets. The same workflow can be deployed on Alibaba Cloud ECS."
