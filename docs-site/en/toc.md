# Documentation — table of contents

**Start with:** **[INFRA-IMPLEMENTATION.md](INFRA-IMPLEMENTATION.md)** — a single roadmap: Camunda + AI scoring, phases, what to read, what to defer.

---

## Track A — infrastructure & cloud (main focus)

| Document | Purpose |
|----------|--------|
| [architecture.md](architecture.md) | **Repository architecture:** layers, stack, data flow, monorepo layout |
| [system-philosophy-governance.md](system-philosophy-governance.md) | Full governance philosophy text moved from root `README.md` |
| [INFRA-IMPLEMENTATION.md](INFRA-IMPLEMENTATION.md) | Phases, order, links — **entry point** |
| [prompt.md](prompt.md) §1–8 | Handoff, product, plan, paths in the repo |
| [infra-pulumi-iac.md](infra-pulumi-iac.md) | Pulumi, `stackRole`, OIDC, stacks — **IaC SoT** on this site |
| [`infra/README.md` (in repo)](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/infra/README.md) | **Pet-project bootstrap:** billing, IAM, GCS state, `infra-core` / split stacks, common errors |
| [gke sandbox →](infra-pulumi-gke-sandbox.md) | Separate Pulumi app (same default region; do not mix VPC/state with main stack) |
| [cli-console.md](cli-console.md) | `gcloud`, Pulumi, Docker, `kubectl` |
| [ml-data-rag.md](ml-data-rag.md) | Vertex, embeddings, backend env |
| [hbg-rag-dominance.md](hbg-rag-dominance.md) | HBG: platform strategy, roles U1–U6 |
| [hr-offers-hbg.md](hr-offers-hbg.md) | HBG: job specs, RACI, 11 stages, 6×11 matrix |
| [../scripts/gcp-enable-apis-iam.sh](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/scripts/gcp-enable-apis-iam.sh) | Enabling GCP APIs (CLI) |

## Track B — Git, GitHub, conventions

| Document | Purpose |
|----------|--------|
| [git-workflow.md](git-workflow.md) | `develop` / `main` branches, `release/*`, tags |
| [github-setup.md](github-setup.md) | Branch protection, Environments |
| [branch-notes.md](branch-notes.md) | Legacy branches, notes |
| [naming.md](naming.md) | Repo names, tags |

## Track C — governance, roles, access (post-MVP or audit)

| Document | Purpose |
|----------|--------|
| [team-11x6-organization.md](team-11x6-organization.md) | **11×6 team:** concept (layers, SoD, SDLC) + links to **six persona** pages with full dev lifecycle |
| [team-persona-ok-admin.md](team-persona-ok-admin.md) · [gw-devops](team-persona-gw-devops.md) · [ux-dev](team-persona-ux-dev.md) · [sh-dev](team-persona-sh-dev.md) · [pk-qa](team-persona-pk-qa.md) · [ok-audit](team-persona-ok-audit.md) | One page per account: mandate, SDLC phases, GitHub/GCP, interactions, anti-patterns |
| [gcp-saas-access-matrix-11x6.md](gcp-saas-access-matrix-11x6.md) | 11 roles × GCP, 6 accounts; details — [prompt](prompt.md) §9 |
| [github-codeowners-matrix.md](github-codeowners-matrix.md) | Roles ↔ GitHub, CODEOWNERS |
| [accounts.md](accounts.md) | Canonical remote; local PII in `accounts.local.md` (gitignore) |
| [prompt.md](prompt.md) §9+ | Enterprise blueprint, hardening, SoD |

## Other

| Document | Purpose |
|----------|--------|
| [prompt.md](prompt.md) | **Long:** §1–8 = handoff; §9+ = extended spec — not linear reading for “start infra” |

---

**Root [README.md](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/README.md)** gives a short repo overview and a link here.

> [Русский: оглавление](/ru/toc) · [Polski: spis treści](/pl/toc)
