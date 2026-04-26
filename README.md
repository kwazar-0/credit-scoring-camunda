# Handlowy Bank Galicyjski (HBG) — automated credit decision (RAG + Camunda 8)

[![CI](https://github.com/OlehKondratow/credit-scoring-camunda/actions/workflows/ci.yml/badge.svg?branch=develop)](https://github.com/OlehKondratow/credit-scoring-camunda/actions/workflows/ci.yml)

**Vertex AI** (Vector Search + Gemini), **Camunda 8 / Zeebe**, **GKE (`europe-central2`)**, **Streamlit** dla analityków.

**Документация (VitePress):** **[`docs-site/`](docs-site/)** — `npm run docs:dev` (см. [doc/README.md](doc/README.md)). **Инфра / Pulumi:** [docs-site/ru/infra-pulumi-iac.md](docs-site/ru/infra-pulumi-iac.md), дорожная карта: [INFRA-IMPLEMENTATION](docs-site/ru/INFRA-IMPLEMENTATION.md). **Исторические** файлы — [doc/\_archive/](doc/_archive/) (не в сайт).

| Doc (источник в `docs-site/ru/`) | Purpose |
|-----|---------|
| [docs-site/ru/INFRA-IMPLEMENTATION.md](docs-site/ru/INFRA-IMPLEMENTATION.md) | **Старт:** фазы внедрения облака и Camunda + AI |
| [docs-site/ru/infra-pulumi-iac.md](docs-site/ru/infra-pulumi-iac.md) | Pulumi, `stackRole`, OIDC (канон) |
| [docs-site/ru/toc.md](docs-site/ru/toc.md) | Оглавление: треки A/B/C (infra, Git, governance) |
| [docs-site/ru/prompt.md](docs-site/ru/prompt.md) | Handoff §1–8; §9+ enterprise blueprint (не подряд при старте) |
| [docs-site/ru/git-workflow.md](docs-site/ru/git-workflow.md) | Branches, `release/*`, tags |
| [docs-site/ru/branch-notes.md](docs-site/ru/branch-notes.md) | Ветки `main` / `develop`, заметки по релизам |
| [docs-site/ru/github-setup.md](docs-site/ru/github-setup.md) | Branch protection, Environments (GitHub UI) |
| [docs-site/ru/naming.md](docs-site/ru/naming.md) | Repo / branch / tag naming (avoid `Credit-Scoring-V2` as brand) |
| [docs-site/ru/cli-console.md](docs-site/ru/cli-console.md) | CLI commands (Pulumi, `kubectl`, Docker) |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Tests, PR expectations |
| [SECURITY.md](SECURITY.md) | Vulnerability reporting |

## Layout

| Path | Purpose |
|------|---------|
| `infra/pulumi/` | **Основной IaC (Pulumi):** GCS, Artifact Registry, API |
| `infra/README.md` | Указатель на `docs-site/ru/infra-pulumi-iac` и `pulumi/` |
| `doc/_archive/` | Только **история** (роли, снимки Pulumi) — вне VitePress |
| `docs-site/ru/gcp-saas-access-matrix-11x6.md` | Матрица ролей × GCP (на сайте) |
| `backend/` | FastAPI + LangGraph (`/analyze`) |
| `worker/` | PyZeebe (`ai-loan-analysis`) |
| `ui/` | Streamlit |
| `data/` | `ingest.py` — PDF → chunks → `text-embedding-004` |
| `bpmn/`, `dmn/` | `hbg-loan-process.bpmn`, `scoring-rules.dmn` |
| `k8s/hbg/` | Deployments, Services, HPA, Secret example |
| `docker-compose.yml` | Local: Zeebe + backend + worker + UI |
| `docs-site/` | Актуальная документация (VitePress) |
| `doc/_archive/` | Архив, не путать с сайтом |
| `scripts/` | `create-release-branch.sh` — ветка `release/X.Y.Z` |
| `.github/workflows/ci.yml` | CI: `pytest` backend + worker (Python 3.11 / 3.12) |
| `.github/workflows/docs-vitepress.yml` | VitePress: `npm ci` + `docs:build` (PR / `develop` / `main`) |
| `.github/workflows/vitepress-gh-pages.yml` | VitePress → **GitHub Pages** (только `main`, `VITEPRESS_BASE` под `/<repo>/`) |

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

Default: **`europe-central2` (Warsaw)** — Pulumi config and manifests.
