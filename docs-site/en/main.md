---
title: "System entry (main)"
description: "What HBG Credit Scoring is, two-minute model, and where to go next."
---

# System entry

**HBG Credit Scoring** is a **demo/training** monorepo for a **regulated-style credit flow**: process is explicit, AI is embedded under policy, and infrastructure is reproducible. Default cloud region: **`europe-central2`**. Canonical code layout: [architecture](/en/architecture) — this page is the **narrative entry** (LEVEL 0).

---

## What the system is

- **Process orchestration** — Camunda 8 (BPMN for stages, **DMN** for deterministic rules).
- **Application & graph** — FastAPI, LangGraph, Vertex (Gemini) in `backend/`.
- **Execution** — PyZeebe **workers** in `worker/` (job types tied to the process).
- **Infrastructure** — **GCP** (GKE Standard, GCS, BigQuery, optional Cloud SQL, etc.) with **Pulumi** split stacks (`stackRole` / `infra-core` · `infra-data` · `infra-runtime`).

> Business logic, process definition, and infrastructure **evolve independently** by design.

---

## Why it exists

Credit and scoring contexts need **traceability**: who changed a rule, which process version ran, what the model saw (without raw PII in logs). This stack optimises for **control and auditability** over minimal moving parts. That implies deliberate trade-offs (slower to change than a single microservice, more concepts than a script).

---

## Two-minute mental model

```text
Applicant / channel
        │
        ▼
   HTTP API (FastAPI) ──► LangGraph / Vertex (RAG + LLM, policy-bound)
        │
        ▼
   Zeebe / Camunda (BPMN state, human tasks, incidents)
        │
        ├─► DMN (deterministic rules, fewer non-deterministic calls)
        ├─► Workers (PyZeebe) ↔ services, data stores
        └─► Observability, BigQuery, logs (PII policy: mask before external LLM)
        │
        ▼
   GKE + Pulumi (IaC), Artifact Registry, Secret Manager, IAM
```

**Separation to preserve (do not blur in docs or code):**

| Layer | Responsibility |
|--------|-----------------|
| **DMN** | Deterministic business rules. |
| **BPMN / Camunda** | Process orchestration, human tasks, audit trail of steps. |
| **Services / workers** | Integration, scoring calls, job handlers. |
| **GCP + Pulumi** | Networks, cluster, data plane, identity — **IaC SoT** in `infra/pulumi/`. |

---

## Where to go next (layered path)

| Level | Document | You get |
|-------|----------|--------|
| 1 | [simplified model](/en/simplified) | Four core roles, mental model without stack noise. |
| 2 | [architecture](/en/architecture) | Components, layers, data flow, monorepo map, design trade-offs. |
| 3 | [plan & roadmap](/en/plan) | Phases, evolution, scaling mental model, links to the infra track. |
| 4 | [appendix index](/en/appendix) | Personas, matrices, long `prompt` §9, CLI, RAG details. |

**One page — everything at a glance:** [system summary](/en/system-summary).

**Governance (full text):** [system philosophy & governance](/en/system-philosophy-governance) · [GCP access matrix 11×6](/en/gcp-saas-access-matrix-11x6).

**Implementation track (operator checklist):** [INFRA-IMPLEMENTATION](/en/INFRA-IMPLEMENTATION).

> Other languages: [Русский (полный)](/ru/main) · [Polski (pełny)](/pl/main)
