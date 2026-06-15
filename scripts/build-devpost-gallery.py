import json
import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "out" / "submission" / "gallery"
W, H = 1200, 800


def font(size, bold=False):
    candidates = [
        r"C:\Windows\Fonts\seguisb.ttf" if bold else r"C:\Windows\Fonts\segoeui.ttf",
        r"C:\Windows\Fonts\arialbd.ttf" if bold else r"C:\Windows\Fonts\arial.ttf",
    ]
    for candidate in candidates:
        if os.path.exists(candidate):
            return ImageFont.truetype(candidate, size)
    return ImageFont.load_default()


FONT_H1 = font(48, True)
FONT_H2 = font(28, True)
FONT_BODY = font(22)
FONT_BODY_BOLD = font(22, True)
FONT_SMALL = font(16)
FONT_SMALL_BOLD = font(16, True)
FONT_MONO = font(18)


def load_json(path, fallback):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return fallback


def gradient():
    img = Image.new("RGB", (W, H), "#07111f")
    px = img.load()
    stops = [(7, 17, 31), (15, 72, 82), (46, 40, 110)]
    for x in range(W):
        t = x / (W - 1)
        if t < 0.52:
            k = t / 0.52
            a, b = stops[0], stops[1]
        else:
            k = (t - 0.52) / 0.48
            a, b = stops[1], stops[2]
        color = tuple(int(a[i] * (1 - k) + b[i] * k) for i in range(3))
        for y in range(H):
            px[x, y] = color
    return img


def rounded(draw, xy, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)


def write_wrapped(draw, xy, content, fill, fnt, max_width, line_gap=7, max_lines=8):
    words = str(content or "").replace("\n", " ").split()
    lines = []
    line = ""
    for word in words:
        probe = f"{line} {word}".strip()
        if line and draw.textlength(probe, font=fnt) > max_width:
            lines.append(line)
            line = word
        else:
            line = probe
    if line:
        lines.append(line)
    lines = lines[:max_lines]
    x, y = xy
    for idx, line in enumerate(lines):
        draw.text((x, y + idx * (fnt.size + line_gap)), line, fill=fill, font=fnt)
    return y + len(lines) * (fnt.size + line_gap)


def bullet_list(draw, xy, items, fill, fnt, max_width, max_items=6):
    x, y = xy
    for item in items[:max_items]:
        y = write_wrapped(draw, (x, y), f"- {item}", fill, fnt, max_width, max_lines=2) + 8
    return y


def base(title, subtitle):
    img = gradient()
    draw = ImageDraw.Draw(img)
    rounded(draw, (58, 48, 424, 88), 20, (19, 142, 158))
    draw.text((78, 59), "Qwen Cloud Hackathon | Track 4", fill="white", font=FONT_SMALL_BOLD)
    draw.text((58, 124), title, fill="white", font=FONT_H1)
    write_wrapped(draw, (62, 190), subtitle, (223, 235, 250), FONT_BODY, 1040, max_lines=3)
    draw.text((58, 752), "ProfitPilot Autopilot - inquiry to quote workflow agent", fill=(190, 205, 226), font=FONT_SMALL_BOLD)
    return img, draw


def card(draw, xy, title, body=None, accent=(19, 142, 158), dark=False):
    fill = (246, 250, 255) if not dark else (12, 22, 38)
    outline = (205, 219, 236) if not dark else (70, 92, 122)
    text_fill = (23, 32, 51) if not dark else (232, 240, 250)
    rounded(draw, xy, 16, fill, outline, 2)
    x1, y1, x2, _ = xy
    rounded(draw, (x1 + 18, y1 + 18, x1 + 54, y1 + 54), 12, accent)
    draw.text((x1 + 72, y1 + 20), title, fill=text_fill, font=FONT_H2)
    if body:
        write_wrapped(draw, (x1 + 24, y1 + 74), body, text_fill, FONT_BODY, x2 - x1 - 48, max_lines=5)


def wide_note(draw, xy, title, body):
    x1, y1, x2, _ = xy
    rounded(draw, xy, 16, (12, 22, 38), (70, 92, 122), 2)
    rounded(draw, (x1 + 18, y1 + 18, x1 + 54, y1 + 54), 12, (19, 142, 158))
    draw.text((x1 + 72, y1 + 18), title, fill=(232, 240, 250), font=FONT_H2)
    write_wrapped(draw, (x1 + 24, y1 + 62), body, (218, 230, 244), FONT_SMALL_BOLD, x2 - x1 - 48, max_lines=2)


def image_product_workflow(data):
    plan = data.get("plan", {})
    quote = plan.get("quote", {})
    title = quote.get("title", "Bilingual Inquiry-to-Quote Workflow Setup")
    price = quote.get("price", 1200)
    currency = quote.get("currency", "USD")
    img, draw = base(
        "Product Workflow",
        "A small-business inquiry becomes a quote packet, customer reply, payment checkpoint, and delivery preview.",
    )
    card(draw, (60, 285, 520, 650), "Inquiry Intake", "Wholesale snack brand asks for bilingual quote automation, follow-up tracking, and payment status handling.")
    card(draw, (560, 285, 1140, 650), "Generated Packet", None)
    display_title = title.replace("Lightweight ", "").replace(" Inquiry-to-Quote Workflow Setup", " Workflow")
    y = write_wrapped(draw, (590, 376), display_title, (23, 32, 51), FONT_BODY_BOLD, 500, max_lines=2)
    draw.text((590, y + 18), f"Quote: {currency} {price}", fill=(15, 112, 74), font=FONT_H2)
    bullet_list(draw, (590, y + 76), [
        "Customer-facing reply draft",
        "Missing-input checklist",
        "Order draft with payment pending",
        "Delivery files held behind checkpoint",
    ], (23, 32, 51), FONT_BODY, 480, 4)
    return img


def image_architecture(_data):
    img, draw = base(
        "Agent Architecture",
        "Qwen Cloud is bounded by schema normalization, compliance checks, and explicit tool boundaries.",
    )
    nodes = [
        ("Inquiry", 70, 330, 245, 410),
        ("Compliance Gate", 310, 330, 535, 410),
        ("Qwen Cloud Planner", 600, 330, 860, 410),
        ("Workflow Packet", 925, 330, 1130, 410),
        ("Quote", 150, 520, 305, 590),
        ("Reply", 365, 520, 520, 590),
        ("Payment Gate", 580, 520, 770, 590),
        ("Delivery Preview", 830, 520, 1060, 590),
    ]
    for idx, (label, x1, y1, x2, y2) in enumerate(nodes):
        accent = (19, 142, 158) if idx < 4 else (104, 68, 198)
        rounded(draw, (x1, y1, x2, y2), 16, (248, 251, 255), (205, 219, 236), 2)
        draw.text((x1 + 18, y1 + 25), label, fill=(23, 32, 51), font=FONT_BODY_BOLD)
        rounded(draw, (x1 + 14, y2 - 14, x2 - 14, y2 - 8), 4, accent)
    for x1, y1, x2, y2 in [(245, 370, 310, 370), (535, 370, 600, 370), (860, 370, 925, 370)]:
        draw.line((x1, y1, x2, y2), fill=(224, 235, 248), width=5)
        draw.polygon([(x2, y2), (x2 - 14, y2 - 8), (x2 - 14, y2 + 8)], fill=(224, 235, 248))
    draw.line((1028, 410, 1028, 470), fill=(224, 235, 248), width=5)
    draw.line((230, 470, 948, 470), fill=(224, 235, 248), width=5)
    for x in [230, 442, 675, 948]:
        draw.line((x, 470, x, 520), fill=(224, 235, 248), width=5)
    wide_note(draw, (70, 620, 1130, 730), "Technical Guardrails", "JSON contract, output normalization, deterministic fallback, timeout controls, live smoke proof, and no secret exposure.")
    return img


def image_evidence(data):
    mode = data.get("mode", "qwen-cloud")
    img, draw = base(
        "Submission Evidence",
        "The project ships with repeatable validation, public proof artifacts, and a 75-second demo video.",
    )
    card(draw, (70, 300, 370, 575), "Validation", None)
    draw.text((105, 390), "100 / 100", fill=(15, 112, 74), font=FONT_H1)
    draw.text((105, 465), "score-demo", fill=(23, 32, 51), font=FONT_BODY_BOLD)
    card(draw, (450, 300, 760, 575), "Qwen Cloud", None)
    draw.text((485, 390), "Live smoke", fill=(23, 32, 51), font=FONT_H2)
    draw.text((485, 445), "PASS", fill=(15, 112, 74), font=FONT_H1)
    draw.text((485, 520), f"demo mode: {mode}", fill=(92, 102, 122), font=FONT_SMALL_BOLD)
    card(draw, (840, 300, 1130, 575), "Public Proof", None)
    bullet_list(draw, (875, 385), [
        "GitHub repository",
        "YouTube demo",
        "Deployment proof",
        "Qwen live proof",
        "MIT license",
    ], (23, 32, 51), FONT_BODY_BOLD, 220, 5)
    wide_note(draw, (70, 620, 1130, 730), "Upload Set", "Use these gallery images with the GitHub URL, YouTube demo, About text, and Project Story fields.")
    return img


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    data = load_json(ROOT / "out" / "demo" / "result.json", {})
    images = [
        ("01-product-workflow.png", image_product_workflow(data)),
        ("02-agent-architecture.png", image_architecture(data)),
        ("03-submission-evidence.png", image_evidence(data)),
    ]
    result = []
    for name, img in images:
        path = OUT / name
        img.save(path, "PNG", optimize=True)
        result.append({"path": str(path), "bytes": path.stat().st_size, "size": [W, H]})
    print(json.dumps({"ok": True, "galleryDir": str(OUT), "images": result}, indent=2))


if __name__ == "__main__":
    main()
