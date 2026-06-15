import json
import os
import sys
import textwrap
from PIL import Image, ImageDraw, ImageFont


W, H = 1280, 720


def font(size, bold=False):
    candidates = [
        r"C:\Windows\Fonts\seguisb.ttf" if bold else r"C:\Windows\Fonts\segoeui.ttf",
        r"C:\Windows\Fonts\arialbd.ttf" if bold else r"C:\Windows\Fonts\arial.ttf",
    ]
    for candidate in candidates:
        if os.path.exists(candidate):
            return ImageFont.truetype(candidate, size)
    return ImageFont.load_default()


FONT_TITLE = font(48, True)
FONT_H2 = font(34, True)
FONT_BODY = font(24)
FONT_BODY_BOLD = font(24, True)
FONT_SMALL = font(16)
FONT_SMALL_BOLD = font(16, True)


def gradient():
    img = Image.new("RGB", (W, H), "#07111f")
    px = img.load()
    left = (7, 17, 31)
    mid = (18, 61, 74)
    right = (49, 33, 98)
    for x in range(W):
        t = x / (W - 1)
        if t < 0.5:
            k = t / 0.5
            color = tuple(int(left[i] * (1 - k) + mid[i] * k) for i in range(3))
        else:
            k = (t - 0.5) / 0.5
            color = tuple(int(mid[i] * (1 - k) + right[i] * k) for i in range(3))
        for y in range(H):
            px[x, y] = color
    return img


def rounded(draw, xy, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)


def text(draw, xy, content, fill="white", fnt=FONT_BODY, max_width=900, line_gap=8, max_lines=6):
    lines = []
    for para in str(content or "").splitlines() or [""]:
        words = para.split()
        line = ""
        for word in words:
            test = (line + " " + word).strip()
            if draw.textlength(test, font=fnt) > max_width and line:
                lines.append(line)
                line = word
            else:
                line = test
        if line:
            lines.append(line)
    lines = lines[:max_lines]
    x, y = xy
    line_height = fnt.size + line_gap
    for index, line in enumerate(lines):
        draw.text((x, y + index * line_height), line, fill=fill, font=fnt)
    return y + len(lines) * line_height


def bullets(draw, xy, items, fill="white", fnt=FONT_BODY, max_width=980):
    x, y = xy
    for item in items[:7]:
        y = text(draw, (x, y), "• " + str(item), fill=fill, fnt=fnt, max_width=max_width, max_lines=2) + 10
    return y


def base(title, subtitle):
    img = gradient()
    draw = ImageDraw.Draw(img)
    rounded(draw, (70, 58, 470, 96), 20, fill=(22, 164, 184), outline=None)
    draw.text((88, 69), "Qwen Cloud Hackathon · Track 4", fill="white", font=FONT_SMALL_BOLD)
    text(draw, (70, 124), title, fill="white", fnt=FONT_TITLE, max_width=1060, max_lines=2)
    text(draw, (74, 242), subtitle, fill=(222, 235, 250), fnt=FONT_BODY, max_width=1060, max_lines=3)
    draw.text((70, 672), "ProfitPilot Autopilot · live proof and deterministic fallback · no secrets shown", fill=(190, 205, 226), font=FONT_SMALL_BOLD)
    return img, draw


def panel(draw, xy):
    rounded(draw, xy, 14, fill=(248, 251, 255), outline=(207, 219, 235), width=2)


def slide_intro(data):
    img, draw = base("ProfitPilot Autopilot", "Qwen Cloud powered agent that turns messy small-business inquiries into quote packets, payment gates, and delivery plans.")
    bullets(draw, (112, 366), ["Inquiry to quote packet", "Customer-facing reply", "Payment confirmation checkpoint", "Delivery packet preview"], fnt=FONT_BODY_BOLD)
    return img


def slide_problem(data):
    img, draw = base("Real Small-Business Problem", "Small teams lose quote versions, follow-ups, payment state, and delivery files across email, chat, and spreadsheets.")
    panel(draw, (90, 335, 590, 548))
    panel(draw, (700, 335, 1190, 548))
    text(draw, (128, 382), "Before", fill=(23, 32, 51), fnt=FONT_H2)
    bullets(draw, (128, 440), ["Manual quote drafts", "No shared follow-up state", "Payment and delivery handled separately"], fill=(23, 32, 51), fnt=FONT_SMALL_BOLD, max_width=390)
    text(draw, (738, 382), "After", fill=(23, 32, 51), fnt=FONT_H2)
    bullets(draw, (738, 440), ["Structured workflow packet", "Missing-input checklist", "Delivery blocked until payment confirmation"], fill=(23, 32, 51), fnt=FONT_SMALL_BOLD, max_width=390)
    return img


def slide_workflow(data):
    img, draw = base("Autopilot Flow", "The agent produces operational artifacts, not just a chat answer.")
    steps = ["Intake inquiry", "Compliance gate", "Quote architect", "Customer reply", "Order draft", "Payment checkpoint", "Delivery preview"]
    x = 92
    for idx, step in enumerate(steps):
        y = 342 + (idx % 4) * 70
        col_x = x + (idx // 4) * 560
        panel(draw, (col_x, y, col_x + 460, y + 48))
        draw.text((col_x + 22, y + 12), f"{idx + 1}. {step}", fill=(23, 32, 51), font=FONT_SMALL_BOLD)
    return img


def slide_quote(data):
    q = data["result"]["packet"]["quote"]
    img, draw = base("Structured Quote Packet", q.get("title", "Quote workflow automation"))
    panel(draw, (84, 320, 540, 570))
    text(draw, (120, 360), f'{q.get("price")} {q.get("currency")}', fill=(23, 32, 51), fnt=FONT_TITLE)
    text(draw, (122, 430), q.get("deliveryTime", ""), fill=(75, 86, 110), fnt=FONT_BODY_BOLD)
    panel(draw, (600, 300, 1200, 590))
    draw.text((638, 336), "Scope", fill=(92, 102, 122), font=FONT_SMALL_BOLD)
    bullets(draw, (638, 382), q.get("scope", [])[:6], fill=(23, 32, 51), fnt=FONT_SMALL_BOLD, max_width=500)
    return img


def slide_reply(data):
    p = data["result"]["packet"]
    img, draw = base("Customer Reply + Missing Inputs", "A complete packet can be handed to sales, operations, or delivery.")
    panel(draw, (82, 318, 620, 590))
    draw.text((120, 354), "Customer reply", fill=(92, 102, 122), font=FONT_SMALL_BOLD)
    text(draw, (120, 398), p.get("customerReply", ""), fill=(23, 32, 51), fnt=FONT_SMALL, max_width=455, max_lines=8)
    panel(draw, (662, 318, 1200, 590))
    draw.text((700, 354), "Missing inputs", fill=(92, 102, 122), font=FONT_SMALL_BOLD)
    bullets(draw, (700, 398), p.get("missingInputs", [])[:6], fill=(23, 32, 51), fnt=FONT_SMALL_BOLD, max_width=420)
    return img


def slide_safety(data):
    blocked = data.get("blocked", {})
    img, draw = base("Safety Gates", "Restricted requests are blocked before quote generation.")
    panel(draw, (122, 340, 1158, 540))
    text(draw, (166, 386), "Restricted request blocked", fill=(122, 27, 46), fnt=FONT_H2)
    text(draw, (166, 450), blocked.get("message", "Request blocked by restricted-industry compliance gate."), fill=(23, 32, 51), fnt=FONT_BODY, max_width=900, max_lines=3)
    return img


def slide_live(data):
    proof = data.get("liveProof", {})
    config = proof.get("config", {})
    img, draw = base("Qwen Cloud Live Proof", "Live smoke test passed, while deterministic fallback keeps the demo runnable without secrets.")
    bullets(draw, (120, 360), [
        "Provider: " + proof.get("provider", "qwen-cloud"),
        "Model: " + config.get("model", data["result"].get("plan", {}).get("model", "qwen")),
        "Endpoint: " + config.get("baseUrlHost", "dashscope.aliyuncs.com"),
        "No API key is shown in the video or repository",
    ], fnt=FONT_BODY_BOLD)
    return img


def slide_ready(data):
    img, draw = base("Submission Ready", "Public repository, tests, scorecard, deployment proof, and Devpost copy are prepared.")
    bullets(draw, (120, 360), [
        "npm run validate",
        "out/submission/SUBMISSION_BUNDLE.md",
        "docs/winning-submission-plan.md",
        "Post-submission monitor checks repo, video, and Devpost URLs",
    ], fnt=FONT_BODY_BOLD)
    return img


SLIDES = {
    "intro": slide_intro,
    "problem": slide_problem,
    "workflow": slide_workflow,
    "quote": slide_quote,
    "reply": slide_reply,
    "safety": slide_safety,
    "live": slide_live,
    "ready": slide_ready,
}


def main():
    data_path, out_dir = sys.argv[1], sys.argv[2]
    os.makedirs(out_dir, exist_ok=True)
    with open(data_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    for index, slide in enumerate(data["slides"], start=1):
        image = SLIDES[slide["id"]](data)
        image.save(os.path.join(out_dir, f"slide-{index:02d}.png"))


if __name__ == "__main__":
    main()
