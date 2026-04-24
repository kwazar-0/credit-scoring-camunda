# Architecture and purpose of the repository

The **Credit-Scoring / HBG** (Handlowy Bank Galicyjski) repository is a **demo/training** stack: automated credit flow with **Camunda 8** orchestration, **RAG** and generative models (**Vertex AI / Gemini**), and **GCP** infrastructure (default region **europe-central2**). See also [HBG: RAG-DOMINANCE strategy](/en/hbg-rag-dominance) and [ml-data-rag](/en/ml-data-rag).

**Repo layout (monorepo):**

| Area | Path | Role |
|------|------|------|
| API & graph | `backend/` | FastAPI, LangGraph, Vertex integration |
| Zeebe workers | `worker/` | PyZeebe jobs (e.g. `ai-loan-analysis`) |
| Analyst UI | `ui/` | Streamlit (no business logic only here) |
| IaC | `infra/pulumi/` + `infra/pulumi/gke-infra/` | Pulumi, split stacks, optional GKE sandbox |
| Kubernetes | `k8s/hbg/`, `k8s/camunda/` | Manifests and Helm values |
| Docs (SoT) | `docs-site/` (this site) | VitePress; legacy in `doc/_archive/` |

---

## Three high-level layers

1. **Orchestration** — Camunda 8 (BPMN/DMN, Zeebe, Operate/Tasklist as needed). The process enforces stages; model uncertainty can route to human tasks or incidents.
2. **Cognitive** — Vertex AI: embeddings, optional Matching Engine / Vector Search, LLM (model config in `backend` — [ml-data-rag](/en/ml-data-rag)).
3. **Data & memory** — GCS, BigQuery, Cloud SQL (PostgreSQL) when enabled in Pulumi; RAG wiring is described in `backend` and [ml-data-rag](/en/ml-data-rag).

---

## Layer A: Camunda 8

- **BPMN** in `bpmn/`, **DMN** in `dmn/` for deterministic rules and fewer LLM calls.
- **Workers** in `worker/`, talking to the API through Zeebe.
- **Deploy** — Docker Compose locally; cloud — GKE, see [infra-pulumi-iac](/en/infra-pulumi-iac) and the repo `k8s/camunda/README.md`.

## Layer B: Vertex AI & LLM

- Gemini and helpers live under `backend/` (PII policy in repo: mask before external LLM).
- Enabling APIs, IAM, region — [infra-pulumi-iac](/en/infra-pulumi-iac), [cli-console](/en/cli-console).

## Layer C: RAG & data

- **Ingestion** — `data/` and [ml-data-rag](/en/ml-data-rag).
- **Retrieval** — backend config (Vertex Vector / code fallback), no raw PII in logs.

---

## Component ↔ role (HBG U-roles, indicative)

| Component | Technology | Role (see [hr-offers-hbg](/en/hr-offers-hbg)) |
|-----------|------------|----------------------------------------------|
| Cloud | GCP (GKE, Cloud SQL, GCS, BQ, Vertex) | U1 — architecture |
| Cluster / release | GKE, Helm, Pulumi | U2 — operations |
| Cognitive / prompts | Vertex, LangChain | U3 — ML & prompts |
| Data & vectors | GCS, BQ, PostgreSQL / pgvector | U4 — data |
| Quality | PyTest | U5 — testing |
| Audit | BQ, logging, [access matrix](/en/gcp-saas-access-matrix-11x6) | U6 — audit |

---

## Data flow (simplified)

1. HTTP API — request / analysis.  
2. Zeebe — process instance, jobs in `worker/`.  
3. Retrieval — RAG over policies/data.  
4. LLM — scoring / answer with safety settings.  
5. Camunda — state, human tasks when required.  
6. Accounting — aggregates in BQ/logs per policy, no raw PII.

---

## “RAG-DOMINANCE” in one sentence

**BPMN/DMN** bound behaviour; **RAG + LLM** add explainable, evidence-linked answers; **cloud** allows scale and model swaps without rewriting the process. Details — [hbg-rag-dominance](/en/hbg-rag-dominance).

---

**Next:** [INFRA-IMPLEMENTATION](/en/INFRA-IMPLEMENTATION), [cli-console](/en/cli-console), [table of contents](/en/toc).

> Languages: [Русский (архитектура)](/architecture) · [Polski](/pl/architecture)
