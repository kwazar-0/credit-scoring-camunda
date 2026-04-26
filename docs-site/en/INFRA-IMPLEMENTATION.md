# Infrastructure: Camunda 8 + AI scoring — working track

**Goal:** design and roll out a cloud stack for the **credit pipeline**: **Camunda (Zeebe)** orchestration, scoring via **FastAPI + LangGraph + Vertex (RAG)**, deploy on **GKE**, data in **GCS / BigQuery**, region **`europe-central2`**.

This file is the **single roadmap** for focus. Other docs are references; index: [toc.md](toc.md).

---

## Phases (in order)

| # | Phase | “Done” criteria | Where to look |
|---|--------|-----------------|---------------|
| **1** | **Cloud + IaC (dev)** | APIs enabled, Pulumi `pulumi up` on **dev**, GCS, BQ dataset, Artifact Registry, stack exports | [infra-pulumi-iac.md](infra-pulumi-iac.md), [cli-console.md](cli-console.md), [scripts/gcp-enable-apis-iam.sh](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/scripts/gcp-enable-apis-iam.sh) |
| **2** | **CI → GCP (OIDC)** | GitHub Actions can auth to GCP without JSON keys (WIF if needed) | `infra/pulumi/workload_identity_github.py`, [.github/workflows/pulumi-preview.yml](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/.github/workflows/pulumi-preview.yml) |
| **3** | **GKE + images** | Cluster (Standard), workload in namespace, images from Artifact Registry, Workload Identity for pods | [infra-pulumi-iac.md](infra-pulumi-iac.md) (`stackRole: infra-runtime` when split), `k8s/hbg/` |
| **4** | **RAG data** | PDF → GCS → ingest → embeddings → Vertex Vector Search; backend without mock vector DB | [ml-data-rag.md](ml-data-rag.md), `data/` |
| **5** | **Camunda in stack** | BPMN/DMN deployed, Zeebe/Tasklist secrets from Secret Manager, `ai-loan-analysis` worker stable calling backend | `bpmn/`, `worker/`, processes |
| **6** | **Observability / policy** | Logs, BQ analytics without raw PII, roles matrix if needed | [gcp-saas-access-matrix-11x6.md](gcp-saas-access-matrix-11x6.md) |

**MVP product (from [prompt.md](prompt.md) §5):** phases **1 → 4** (ingestion, index, turn off mock) → then **5** and worker ↔ backend tests.

---

## Why this phase order (and orders we rejected)

**Dependencies:** phase **1** stands up the project, APIs, baseline resources, and Pulumi state “ground” — without it, **3** (GKE) and **4** (stores for the RAG corpus) are not meaningful. **2** (OIDC) fits right after a stable GCP project exists; otherwise CI stays on JSON keys (anti-pattern) or never touches the cloud.

**Why not “Camunda first (5), then RAG (4)”:** you can run Zeebe and workers against mocked retrieval for a quick demo, but **refactor risk is high** when the real vector path changes latency, limits, and citation shape. For this repo we prioritise a **working data path** to the model.

**Why not “GKE (3) before full IaC (1)”:** a hand-built cluster without Pulumi is possible, but diverges from the repo’s SoT and hurts reproducibility for new contributors.

**Phase 6** deliberately comes **after** a working stack: observability and the roles matrix are maturity work, not blockers for the first `pulumi up` and first E2E.

---

## Minimum reading (1–2 hours, then code)

1. **[prompt.md](prompt.md) — §1–5, §7–8** — product, repo layout, **phase plan**, E2E.  
2. **[infra-pulumi-iac.md](infra-pulumi-iac.md)** — Pulumi, `stackRole`, OIDC, stack split.  
3. **[`infra/README.md`](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/infra/README.md)** (repo) — pet bootstrap: billing, ADC/quota, IAM, state bucket, `infra-core`, split stacks, common errors.  
4. **`infra/pulumi/__main__.py`** (repo) — stack selection.  
5. **[cli-console.md](cli-console.md)** — Pulumi, `gcloud`, enabling APIs.

**Defer to a follow-up task** (to stay focused): detailed 11×6 roles ([gcp-saas-access-matrix-11x6.md](gcp-saas-access-matrix-11x6.md)), CODEOWNERS, [prompt.md](prompt.md) **§9.6** hardening — mature enterprise, **not** blocking **phase 1–2**.

---

## Enterprise spec (when you need it)

Full target (VPC, multi-pool GKE, OPA, Binary Authorization) — **[prompt.md](prompt.md) from §9**. Read **after** a working MVP; land in Pulumi as requirements appear.

---

## Optional: GKE + Cloud SQL sandbox (`gke-infra`)

**On this site (full guide):** [infra-pulumi-gke-sandbox (EN)](infra-pulumi-gke-sandbox.md) · [RU](/ru/infra-pulumi-gke-sandbox) · [PL](/pl/infra-pulumi-gke-sandbox).

A **second** Pulumi project: [`infra/pulumi/gke-infra/`](https://github.com/kwazar-0/credit-scoring-camunda/tree/develop/infra/pulumi/gke-infra). In-repo runbook: [README.md](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/infra/pulumi/gke-infra/README.md).

The stack targets **`europe-central2`** (default) with **private** Cloud SQL (no public IP), GKE, GCS, and Artifact Registry under the **`cs-sandbox-*`** name prefix, which still **differs** from **`infra/pulumi/`** (`hbg-*` and `stackRole`). Do **not** run both `pulumi up` in the same project without a plan (VPC, PSA, SQL overlap): [infra-pulumi-iac](infra-pulumi-iac.md), [gke sandbox](infra-pulumi-gke-sandbox.md).

---

## Quick commands

```bash
# APIs in the project
./scripts/gcp-enable-apis-iam.sh YOUR_GCP_PROJECT_ID

# Pulumi (from repo root)
cd infra/pulumi && python3 -m venv venv && . venv/bin/activate && pip install -r requirements.txt
pulumi config set gcp:project YOUR_GCP_PROJECT_ID
pulumi config set credit-scoring:region europe-central2
pulumi preview && pulumi up
```

---

*Update the phase table when a phase closes; Git details are in [git-workflow.md](git-workflow.md), keep separate from the cloud checklist.*
