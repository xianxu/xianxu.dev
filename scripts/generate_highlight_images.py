#!/usr/bin/env python3
"""Generate cartoon-style cover images for highlighted blog posts via OpenAI.

Usage:
    OPENAI_API_KEY=sk-... python3 scripts/generate_highlight_images.py [--limit N] [--slug SLUG] [--dry-run]

Flow per post:
    1. Read frontmatter (title + body) from src/data/post/<slug>.md
    2. Ask gpt-4o-mini to produce a cartoon-style image prompt
    3. Send prompt to gpt-image-1 (1536x1024 ~ 16:9) and save PNG
    4. Insert `image:` field into the post frontmatter
"""
import argparse
import base64
import json
import os
import re
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
POSTS_DIR = ROOT / "src" / "data" / "post"
IMAGES_DIR = ROOT / "src" / "assets" / "images" / "highlights"
IMAGES_DIR.mkdir(parents=True, exist_ok=True)

API_KEY = os.environ.get("OPENAI_API_KEY")
if not API_KEY:
    sys.exit("error: OPENAI_API_KEY env var not set")

FRONTMATTER_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n(.*)$", re.DOTALL)


def http_post(url, payload, timeout=120):
    body = json.dumps(payload).encode()
    req = urllib.request.Request(
        url,
        data=body,
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json",
        },
    )
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read())


def parse_post(path: Path):
    text = path.read_text(encoding="utf-8")
    m = FRONTMATTER_RE.match(text)
    if not m:
        return None
    fm_block, body = m.group(1), m.group(2)
    fm = {}
    cur_key = None
    for line in fm_block.splitlines():
        if line.startswith("  - ") and cur_key == "tags":
            fm.setdefault("tags", []).append(line[4:].strip())
            continue
        m2 = re.match(r"^([A-Za-z_][A-Za-z0-9_]*)\s*:\s*(.*)$", line)
        if m2:
            cur_key = m2.group(1)
            val = m2.group(2).strip()
            if val:
                fm[cur_key] = val
    return fm, body, fm_block


def is_highlighted(fm):
    return str(fm.get("highlight", "")).lower() == "true"


def has_image(fm):
    return "image" in fm and fm["image"].strip()


def make_prompt(title: str, body: str) -> str:
    """Use gpt-4o-mini to summarize a post into a cartoon-style image prompt."""
    snippet = body.strip()[:1500]
    sys_msg = (
        "You write image-generation prompts. Given a blog post title and excerpt, "
        "produce ONE concise prompt (under 60 words) describing a cartoon-style "
        "illustration that captures the post's spirit. Style cues to always include: "
        "flat cartoon illustration, soft pastel palette, clean linework, friendly "
        "and a touch whimsical, suitable as a blog hero. Avoid text, logos, and "
        "people's faces. Output only the prompt, no preamble."
    )
    user_msg = f"Title: {title}\n\nExcerpt:\n{snippet}"
    resp = http_post(
        "https://api.openai.com/v1/chat/completions",
        {
            "model": "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": sys_msg},
                {"role": "user", "content": user_msg},
            ],
            "temperature": 0.7,
        },
    )
    return resp["choices"][0]["message"]["content"].strip()


def generate_image(prompt: str, out_path: Path):
    resp = http_post(
        "https://api.openai.com/v1/images/generations",
        {
            "model": "gpt-image-1",
            "prompt": prompt,
            "size": "1536x1024",
            "n": 1,
        },
        timeout=180,
    )
    data = resp["data"][0]
    if "b64_json" in data:
        out_path.write_bytes(base64.b64decode(data["b64_json"]))
    elif "url" in data:
        with urllib.request.urlopen(data["url"], timeout=60) as r:
            out_path.write_bytes(r.read())
    else:
        raise RuntimeError(f"unexpected response: {data}")


def insert_image_field(path: Path, image_value: str):
    text = path.read_text(encoding="utf-8")
    m = FRONTMATTER_RE.match(text)
    if not m:
        return False
    fm_block, body = m.group(1), m.group(2)
    if re.search(r"^image:\s*", fm_block, re.MULTILINE):
        new_fm = re.sub(r"^image:\s*.*$", f"image: {image_value}", fm_block, flags=re.MULTILINE)
    else:
        # insert after publishDate (or at start) for tidy ordering
        if re.search(r"^publishDate:\s*", fm_block, re.MULTILINE):
            new_fm = re.sub(
                r"^(publishDate:\s*.*)$",
                rf"\1\nimage: {image_value}",
                fm_block,
                count=1,
                flags=re.MULTILINE,
            )
        else:
            new_fm = f"image: {image_value}\n" + fm_block
    path.write_text(f"---\n{new_fm}\n---\n{body}", encoding="utf-8")
    return True


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=None, help="Max posts to process")
    ap.add_argument("--slug", default=None, help="Single post slug to (re)generate")
    ap.add_argument("--force", action="store_true", help="Regenerate even if image already set")
    ap.add_argument("--dry-run", action="store_true", help="Show plan without calling APIs")
    args = ap.parse_args()

    posts = sorted(POSTS_DIR.glob("*.md"))
    todo = []
    for p in posts:
        if args.slug and p.stem != args.slug:
            continue
        parsed = parse_post(p)
        if not parsed:
            continue
        fm, body, _ = parsed
        if not is_highlighted(fm):
            continue
        if has_image(fm) and not args.force:
            print(f"skip (already has image): {p.stem}")
            continue
        todo.append((p, fm, body))
        if args.limit and len(todo) >= args.limit:
            break

    print(f"will process {len(todo)} post(s)")
    for p, fm, body in todo:
        title = fm.get("title", p.stem).strip().strip('"')
        print(f"\n=== {p.stem} ===")
        print(f"  title: {title}")
        if args.dry_run:
            continue

        prompt = make_prompt(title, body)
        print(f"  prompt: {prompt}")

        out_png = IMAGES_DIR / f"{p.stem}.png"
        print(f"  -> {out_png.relative_to(ROOT)}")
        generate_image(prompt, out_png)

        rel = f"~/assets/images/highlights/{p.stem}.png"
        insert_image_field(p, rel)
        print(f"  frontmatter updated: image: {rel}")


if __name__ == "__main__":
    main()
