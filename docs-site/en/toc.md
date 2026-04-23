# Documentation — table of contents

**Start with:** **[INFRA-IMPLEMENTATION.md](INFRA-IMPLEMENTATION.md)** — a single roadmap: Camunda + AI scoring, phases, what to read, what to defer.

---

## Track A — infrastructure & cloud (main focus)

| Document | Purpose |
|----------|--------|
| [INFRA-IMPLEMENTATION.md](INFRA-IMPLEMENTATION.md) | Phases, order, links — **entry point** |
| [prompt.md](prompt.md) §1–8 | Handoff, product, plan, paths in the repo |
| [../infra/ARCHITECTURE.md](https://github.com/OlehKondratow/credit-scoring-camunda/blob/develop/infra/ARCHITECTURE.md) | Projects, namespaces, OIDC, state |
| [../infra/pulumi/README.md](https://github.com/OlehKondratow/credit-scoring-camunda/blob/develop/infra/pulumi/README.md) | Pulumi: run, exports; optional [gke-infra sandbox (docs →)](infra-pulumi-gke-sandbox.md), [files in `infra/`](https://github.com/OlehKondratow/credit-scoring-camunda/tree/develop/infra/pulumi/gke-infra) |
| [cli-console.md](cli-console.md) | `gcloud`, Pulumi, Docker, `kubectl` |
| [ml-data-rag.md](ml-data-rag.md) | Vertex, embeddings, backend env |
| [../scripts/gcp-enable-apis-iam.sh](https://github.com/OlehKondratow/credit-scoring-camunda/blob/develop/scripts/gcp-enable-apis-iam.sh) | Enabling GCP APIs (CLI) |

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
| [../infra/ROLES.md](https://github.com/OlehKondratow/credit-scoring-camunda/blob/develop/infra/ROLES.md) | 11 roles, GCP/Pulumi/K8s/Git, step-by-step |
| [gcp-saas-access-matrix-11x6.md](gcp-saas-access-matrix-11x6.md) | 11 roles × GCP, 6 accounts |
| [github-codeowners-matrix.md](github-codeowners-matrix.md) | Roles ↔ GitHub, CODEOWNERS |
| [accounts.md](accounts.md) | Canonical remote; local PII in `accounts.local.md` (gitignore) |
| [prompt.md](prompt.md) §9+ | Enterprise blueprint, hardening, SoD |

## Other

| Document | Purpose |
|----------|--------|
| [prompt.md](prompt.md) | **Long:** §1–8 = handoff; §9+ = extended spec — not linear reading for “start infra” |

---

**Root [README.md](https://github.com/OlehKondratow/credit-scoring-camunda/blob/develop/README.md)** gives a short repo overview and a link here.

> [Русский: оглавление](/toc) · [Polski: spis treści](/pl/toc)
