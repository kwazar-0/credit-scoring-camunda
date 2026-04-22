#!/usr/bin/env python3
"""Replace doc/... file references in docs-site with same-directory names (VitePress)."""
from pathlib import Path

REPLACEMENTS = [
    ("doc/gcp-saas-access-matrix-11x6.md", "gcp-saas-access-matrix-11x6.md"),
    ("doc/github-codeowners-matrix.md", "github-codeowners-matrix.md"),
    ("doc/git-workflow.md", "git-workflow.md"),
    ("doc/branch-notes.md", "branch-notes.md"),
    ("doc/prompt.md", "prompt.md"),
    ("doc/cli-console.md", "cli-console.md"),
    ("doc/naming.md", "naming.md"),
    ("doc/ml-data-rag.md", "ml-data-rag.md"),
    ("doc/github-setup.md", "github-setup.md"),
    ("`doc/prompt.md`", "`prompt.md`"),
    ("`doc/ml-data-rag.md`", "`ml-data-rag.md`"),
    ("`doc/INFRA-IMPLEMENTATION.md`", "`INFRA-IMPLEMENTATION.md`"),
    ("`doc/README.md`", "`toc.md`"),
]
ROOT = Path(__file__).resolve().parent.parent / "docs-site"


def main() -> None:
    for p in sorted(ROOT.rglob("*.md")):
        if ".vitepress" in p.parts:
            continue
        data = p.read_text(encoding="utf-8")
        new = data
        for a, b in REPLACEMENTS:
            new = new.replace(a, b)
        if new != data:
            p.write_text(new, encoding="utf-8", newline="\n")
            print("patched", p.relative_to(ROOT))


if __name__ == "__main__":
    main()
