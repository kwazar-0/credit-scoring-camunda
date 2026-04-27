---
title: "System summary"
description: "One-page view: architecture, governance, and responsibility structure for HBG Credit Scoring."
---

# System summary

**HBG Credit Scoring** — a **monorepo** for a **demonstration / training** **automated credit flow**: **Camunda 8** (BPMN/DMN) orchestrates; **FastAPI + LangGraph** and **Vertex AI** provide the cognitive path (RAG + LLM under policy); **PyZeebe workers** run jobs; **GCP** (default **europe-central2**) and **Pulumi** (split **infra-core** / **infra-data** / **infra-runtime** stacks) provide reproducible infrastructure. **VitePress** in `docs-site/` is the documentation source of truth; `doc/_archive/` is **historical only**.

---

## Architecture (at a glance)

| Concern | Choice | Note |
|--------|--------|------|
| Process | Camunda 8, BPMN + **DMN** for rules | Stages, human tasks, audit of steps — not only “code flow”. |
| App / AI | `backend/`, `worker/` | PII: mask before external LLM; align with `backend` PII helpers. |
| Data | GCS, BQ, optional Cloud SQL / vectors | RAG: see [ml-data-rag](/en/ml-data-rag). |
| Runtime | GKE **Standard** | See ADRs and [architecture](/en/architecture) for Autopilot / SaaS trade-offs. |
| IaC | Pulumi, split stacks | `stackRole` and ordering — [infra-pulumi-iac](/en/infra-pulumi-iac). |

**Data path (simplified):** request → API / graph → Zeebe → retrieval & LLM → Camunda state & tasks → logs / BQ (no raw **PESEL** in logs).

**Integrity rule (do not collapse in docs or design):** **DMN** (rules) · **Camunda** (orchestration) · **services/workers** (execution) · **Pulumi/GCP** (infrastructure) — four distinct layers.

---

## Governance model

- **Git** — technical decisions, IaC, and docs reviewed together.  
- **Least privilege** — not everyone is project admin; access maps to **roles** (simplified: Business / Engineer / Platform / Operator — [simplified](/en/simplified)).  
- **11×6** — eleven functional aspects × **six** operational **accounts** on GCP, plus GitHub/CODEOWNERS alignment; details [gcp-saas-access-matrix-11x6](/en/gcp-saas-access-matrix-11x6) and [team-11x6-organization](/en/team-11x6-organization).  
- **Philosophy (full text):** [system-philosophy-governance](/en/system-philosophy-governance).

---

## Responsibility structure

- **Business** — intent of scoring and risk policy; co-owns **DMN** and product rules.  
- **Engineers** — services, workers, tests, APIs; must not “route around” process or audit for convenience.  
- **Platform** — network, cluster, Pulumi, IAM, releases.  
- **Operators** — monitoring, incidents, SLOs; changes follow **plan** and **access** rules, not ad-hoc shell access.

**Layered reading:** [main](/en/main) (entry) → [simplified](/en/simplified) → [architecture](/en/architecture) → [plan](/en/plan) → [appendix](/en/appendix).

> [REORG-CHANGE-REPORT (change log)](/REORG-CHANGE-REPORT) — how this structure was introduced. [Русский](/ru/system-summary) · [Polski](/pl/system-summary)
