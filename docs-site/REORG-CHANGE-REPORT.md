---
title: "Documentation reorg — change report"
description: "What was merged, removed, renamed, and reconciled in the layered docs (2026-04)."
---

# Documentation reorg — change report

This report documents the **layered knowledge model** added under `docs-site/en/`: `main`, `simplified`, `plan`, `appendix`, `system-summary`, with the existing `architecture` page as **LEVEL 2** and [INFRA-IMPLEMENTATION](/en/INFRA-IMPLEMENTATION) as the **detailed** implementation / operator track (unchanged as SoT for phases and commands).

---

## What was merged (conceptually)

| Source | Target | Notes |
|--------|--------|--------|
| `doc/_archive/prompt_docs/MAIN_README.md` | `en/main.md` | Two-minute view, building blocks, ASCII diagram. **Pulumi state bucket URL** is not the entry lead-in (stays in `infra` / IaC pages). **Stack** names aligned with the repo: `infra-core`, `infra-data`, `infra-runtime` (not only “infra-core → networking” shorthand). **Git** branch line (`feature → develop → release → main`) is **omitted** from entry to match [git-workflow](/en/git-workflow) (this repo `develop` / `main`); avoid conflicting diagrams. |
| `doc/_archive/prompt_docs/SIMPLIFIED_ROLE_MODEL.md` | `en/simplified.md` | Four roles + pointer to 11×6; “role as boundary” principle preserved. |
| `doc/_archive/prompt_docs/ARCHITECTURE-GOVERNANCE_EXPLANATION.md` | `en/architecture.md` (additions) + `en/plan.md` | Rationale: auditability, separation, trade-off “control over minimal complexity” — one paragraph in architecture, not a duplicate doc. |
| `doc/_archive/prompt_docs/plan.md` | `en/plan.md` + this file | RU document structure goals merged with phases from [INFRA-IMPLEMENTATION](/en/INFRA-IMPLEMENTATION) (SoT for operator detail). |
| `en/index`, `en/toc` (existing) | Cross-links | “Layered path” and appendix index point to the new pages without removing INFRA-IMPLEMENTATION as the implementation SoT. |

---

## What was not removed (deprecated nothing)

- No archived files were deleted. `doc/_archive/prompt_docs/` **remains historical**; content was **reused and superseded in the live site** where noted above.
- [system-philosophy-governance](/en/system-philosophy-governance) stays the **full** governance text; [main](/en/main) summarizes and links to it.

---

## What was “renamed” (navigation only)

- Logical names **main / simplified / architecture / plan** are **file names** in `en/`: `main.md`, `simplified.md`, `architecture.md` (pre-existing), `plan.md`. No rename of the old `architecture.md` file.

---

## Inconsistencies found and how they were handled

1. **Git flow** — `MAIN_README` showed `feature → develop → release → main`; the site’s [git-workflow](/en/git-workflow) emphasises `develop` / `main` and `release/*`. **Entry** does not repeat a branch diagram; operators follow git-workflow.
2. **Pulumi state** — archive gave one `gs://` bucket. **Treated as example**; canonical bootstrap is [infra-pulumi-iac](/en/infra-pulumi-iac) and repo `infra/README.md`. Not duplicated on [main](/en/main).
3. **HBG vs “Credit Scoring Camunda Platform”** — unified under **HBG Credit Scoring** and [architecture](/en/architecture) “demo/training” wording to match the rest of the site.
4. **11×6 vs four roles** — [simplified](/en/simplified) states the four are a **lens**; 11×6 + six accounts remain **authoritative** in [gcp-saas-access-matrix-11x6](/en/gcp-saas-access-matrix-11x6).

---

## RU/PL (layered set)

- **`main`**, **`simplified`**, **`plan`**, **`appendix`**, **`system-summary`** exist as **full** pages in **en**, **ru**, and **pl** (equivalent structure and in-language links; shared ADR at `/adr`). The earlier “stub only” state was superseded.

---

## Quick links (VitePress)

| Page | Path |
|------|------|
| Main | `/en/main` |
| Simplified | `/en/simplified` |
| Architecture | `/en/architecture` |
| Plan | `/en/plan` |
| Appendix | `/en/appendix` |
| System summary | `/en/system-summary` |

**Sidebar:** `Start` group updated in **en, ru, pl** in `.vitepress/config.mts`.
