# Millennium Bank — automated credit decision (RAG + Camunda 8)

[![CI](https://github.com/OlehKondratow/credit-scoring-camunda/actions/workflows/ci.yml/badge.svg?branch=develop)](https://github.com/OlehKondratow/credit-scoring-camunda/actions/workflows/ci.yml)

**Vertex AI** (Vector Search + Gemini), **Camunda 8 / Zeebe**, **GKE (`europe-central2`)**, **Streamlit** dla analityków.

**Документация (VitePress):** каталог **[`docs-site/`](docs-site/)** — навигация, поиск, сборка: `npm install && npm run docs:dev` (см. [doc/README.md](doc/README.md)). **Старт по инфраструктуре:** [docs-site/INFRA-IMPLEMENTATION.md](docs-site/INFRA-IMPLEMENTATION.md). **Снимок** старых путей `doc/*.md` — [doc/\_archive/2026-04-21/](doc/_archive/2026-04-21/).

| Doc (источник в `docs-site/`) | Purpose |
|-----|---------|
| [docs-site/INFRA-IMPLEMENTATION.md](docs-site/INFRA-IMPLEMENTATION.md) | **Старт:** фазы внедрения облака и Camunda + AI |
| [docs-site/toc.md](docs-site/toc.md) | Оглавление: треки A/B/C (infra, Git, governance) |
| [docs-site/prompt.md](docs-site/prompt.md) | Handoff §1–8; §9+ enterprise blueprint (не подряд при старте) |
| [docs-site/git-workflow.md](docs-site/git-workflow.md) | Branches, `release/*`, tags |
| [docs-site/branch-notes.md](docs-site/branch-notes.md) | Назначение веток, legacy `millennium-credit-v2` |
| [docs-site/github-setup.md](docs-site/github-setup.md) | Branch protection, Environments (GitHub UI) |
| [docs-site/naming.md](docs-site/naming.md) | Repo / branch / tag naming (avoid `Credit-Scoring-V2` as brand) |
| [docs-site/cli-console.md](docs-site/cli-console.md) | CLI commands (Pulumi, `kubectl`, Docker) |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Tests, PR expectations |
| [SECURITY.md](SECURITY.md) | Vulnerability reporting |

## Layout

| Path | Purpose |
|------|---------|
| `infra/pulumi/` | **Основной IaC (Pulumi):** GCS, Artifact Registry, API |
| `infra/ROLES.md` | Роли: DevOps/SRE, dev-developer, dev-tester, ref-tester, prod-tester, prod-user |
| `infra/ARCHITECTURE.md` | Изоляция сред и namespaces |
| `infra/terraform/` | Справочный Terraform (legacy) |
| `backend/` | FastAPI + LangGraph (`/analyze`) |
| `worker/` | PyZeebe (`ai-loan-analysis`) |
| `ui/` | Streamlit |
| `data/` | `ingest.py` — PDF → chunks → `text-embedding-004` |
| `bpmn/`, `dmn/` | `millennium-loan-process.bpmn`, `scoring-rules.dmn` |
| `k8s/millennium/` | Deployments, Services, HPA, Secret example |
| `docker-compose.yml` | Local: Zeebe + backend + worker + UI |
| `docs-site/` + `doc/_archive/` | Документация, VitePress |
| `scripts/` | `create-release-branch.sh` — ветка `release/X.Y.Z` |
| `.github/workflows/ci.yml` | CI: `pytest` backend + worker (Python 3.11 / 3.12) |

## Local run

```bash
docker compose up --build
```

Tests:

```bash
make test
```

- API: `http://localhost:8000/docs`
- UI: `http://localhost:8501`
- Zeebe: `localhost:26500`

Service task type: **`ai-loan-analysis`**, process variable: **`application`** (JSON). On backend timeout the worker throws BPMN error **`AI_SERVICE_TIMEOUT`**.

## Region

Default: **`europe-central2` (Warsaw)** — config, Terraform, manifests.
