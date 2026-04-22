#!/usr/bin/env python3
"""Rewrite (../...)+Path markdown links in docs-site/ to absolute GitHub blob URLs."""
import re
import sys
from pathlib import Path

BLOB = "https://github.com/OlehKondratow/credit-scoring-camunda/blob/develop"
PAT = re.compile(r"\]\((?:\./)*(?:\.\./)+([^)]+)\)")


def fix(text: str) -> str:
    def repl(m: re.Match) -> str:
        tail = m.group(1).lstrip("/")
        return f"]({BLOB}/{tail})"

    return PAT.sub(repl, text)


def main() -> None:
    root = Path(__file__).resolve().parent.parent / "docs-site"
    if not root.is_dir():
        print("docs-site/ missing", file=sys.stderr)
        sys.exit(1)
    for p in root.rglob("*.md"):
        if ".vitepress" in p.parts:
            continue
        data = p.read_text(encoding="utf-8")
        new = fix(data)
        if new != data:
            p.write_text(new, encoding="utf-8", newline="\n")
            print("updated", p.relative_to(root))


if __name__ == "__main__":
    main()
