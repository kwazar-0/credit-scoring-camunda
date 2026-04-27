# Architecture and purpose of the repository

**Documentation layers:** [main (entry)](/en/main) → [simplified model](/en/simplified) → **this page** → [plan & roadmap](/en/plan) → [appendix](/en/appendix). **One-page summary:** [system summary](/en/system-summary).

The **Credit-Scoring / HBG** (Handlowy Bank Galicyjski) repository is a **demo/training** stack: automated credit flow with **Camunda 8** orchestration, **RAG** and generative models (**Vertex AI / Gemini**), and **GCP** infrastructure (default region **europe-central2**). See also [HBG: RAG-DOMINANCE strategy](/en/hbg-rag-dominance) and [ml-data-rag](/en/ml-data-rag).

**Design rationale (one line):** the system optimises for **auditability, separation of concerns, and controlled change** — not for minimal component count or fastest first-time setup. That trade-off is intentional; see the “Engineering decisions” section below.

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

## Engineering decisions: context, alternatives, trade-offs

This is **not** a duplicate of the [site-wide ADR table](/adr); it explains **why** the stack looks this way for anyone who will change it later.

### Orchestration: Camunda 8, not “code only”

**Alternatives:** orchestration entirely in **LangGraph** (or similar) without BPMN; **Temporal** / hand-rolled sagas; Step-Functions-style cloud workflows.

**Criteria:** explicit **process stages** reviewable beyond pure engineers; **human tasks** and policy branches without redeploying the whole service; audit of “what happened at step N”. A code-first graph fits ML branches poorly as the **sole** carrier of a regulated credit contour.

**Trade-off:** Camunda ops and licensing; BPMN/DMN skills. **Revisit when:** regulators and business accept “code + event log only” and human-in-the-loop is not required in this shape.

### IaC: Pulumi with **split stacks**, not one `up` for everything

**Alternatives:** one large stack; **Terraform** / CDK with modular layout.

**Criteria:** different **blast radius** and change frequency (network/PSA are slow-moving; runtime changes more often). Separate state reduces “we broke the cluster while editing a bucket” risk and eases CI approval boundaries.

**Trade-off:** more stacks — more `coreStackRef` discipline and ordering of `pulumi up`. **Revisit when:** a tiny pet setup may stay on the `legacy` single stack (see [infra-pulumi-iac](/en/infra-pulumi-iac)).

### GKE **Standard**, not Autopilot by default

**Alternatives:** GKE Autopilot; **Cloud Run** for parts of the surface; Camunda SaaS without owning a cluster.

**Criteria:** typical Camunda Helm charts and **network / PSA / private SQL** assumptions align more predictably on Standard for this training contour.

**Trade-off:** more ops surface (node pools, patching). **Revisit when:** the team accepts Autopilot constraints after explicit compatibility checks.

### Cognitive layer: Vertex in the same GCP project/region story

**Alternatives:** external LLM APIs as the primary path; self-hosted embeddings.

**Criteria:** one **IAM and data-residency** story for an EU-style default (`europe-central2`), RAG on GCS / Vector Search without mirroring artifacts into another cloud.

**Trade-off:** coupling to Google’s roadmap; hybrid is possible but complicates compliance. **Revisit when:** a hard requirement forces a specific frontier model only from an external vendor — then a gateway and PII policy (mask before external calls, as in this repo).

### Monorepo

**Alternatives:** separate repos for `worker`, `backend`, `infra`.

**Criteria:** **job-type ↔ API** contracts and **BPMN** versions ship in one PR; IaC and [docs-site](/adr) review with code.

**Trade-off:** CI cost and repo size; mature teams sometimes split. **Revisit when:** independent release trains need strict semver between services.

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

> Languages: [Русский (архитектура)](/ru/architecture) · [Polski](/pl/architecture)
