# People & roles (HR) — HBG RAG-DOMINANCE

| Field | Value |
|-------|--------|
| **Status** | Internal; recruiting and planning |
| **Link** | [hbg-rag-dominance](/en/hbg-rag-dominance) — strategy and roles U1–U6 |
| **Matrix version** | 1.1 (see Annex B) |
| **11×6 team** | [team-11x6-organization](/en/team-11x6-organization) — team concept and six personas with full SDLC |

**Other languages:** [Русский](/ru/hr-offers-hbg) · [Polski](/pl/hr-offers-hbg)

---

## 1. Open roles vs codes U1–U6

This file describes **four** open positions; **six** functional slots (U1–U6) from [hbg-rag-dominance](/en/hbg-rag-dominance) are covered as follows:

| Code(s) | Section 2 | Note |
|---------|-------------|------|
| U1 | Job 1 — Platform Architect | — |
| U2 | *Not a separate posting here* | SRE/CI-CD: separate hire, U1 scope extension, or vendor — per plan |
| U3 | Job 2 — Senior RAG & Semantic Architect | — |
| U4 | Job 3 — Principal Data Engineer | — |
| U5 | Job 4 — AI Validation & Compliance (part of U5) | Inquisition & gold paths — U5; pure legal sign-off — overlap with U6 |
| U6 | *Partly* job 4 + optional Legal/audit | Reg reporting and BQ traces — in JD 4 |

---

## 2. Job descriptions

### 2.1 Job 1 — Platform Architect (U1)

| | |
|---|---|
| **Location** | Remote / hybrid |
| **Comp** | Top-tier market |
| **Job objective** | Technology sovereignty: secure, scalable, auditable infrastructure. |
| **Hard skills** | GCP (GKE, network, IAM), IaC (Pulumi/Python), Zero Trust, Workload Identity. |
| **Offer** | Own architecture as code; GCP security tools per agreed policy. |

### 2.2 Job 2 — Senior RAG & Semantic Architect (U3)

| | |
|---|---|
| **Location** | Remote |
| **Comp** | High + bonus on model quality KPIs |
| **Job objective** | Encode bank policy into stable RAG/LLM design; reduce ambiguity and hallucinations. |
| **Hard skills** | Vertex (Gemini), LangGraph/LangChain/LlamaIndex (per repo), pgvector (HNSW, IVFFlat), prompt/chain design. |
| **Offer** | Real (pseudonymised/approved) bank data within compliance. |

### 2.3 Job 3 — Principal Data Engineer (U4)

| | |
|---|---|
| **Location** | Remote / office |
| **Comp** | Competitive |
| **Job objective** | Pipelines from raw documents to model-ready structure; organisational “memory” kept current. |
| **Hard skills** | ETL/ELT for unstructured data (OCR, PDF), PostgreSQL, BigQuery, Python (workers). |

### 2.4 Job 4 — AI Validation & Compliance Officer (U5 / U6 overlap)

| | |
|---|---|
| **Location** | Office / hybrid |
| **Comp** | Fixed + risk/incident reduction bonus (KPIs in offer) |
| **Job objective** | Check AI decisions vs policy; turn legal/compliance into engineering requirements; explainability. |
| **Hard skills** | FinTech AML/KYC/credit risk; SQL/BQ on decision logs; legal/compliance texts. |

---

## 3. RACI (short)

| Task | R | A |
|------|---|---|
| Infra uptime | Platform Architect (U1) | DevOps / SRE lead (U2) |
| AI answer quality | RAG Architect (U3) | ML lead |
| Knowledge base freshness | Data Engineer (U4) | Data lead |
| Legal / regulatory soundness | Compliance (job 4) | Legal / U6 per bank matrix |

*“A” is as in the source doc; your bank’s role register is authoritative.*

---

## 4. Six agents × functional blocks

| # | Code | Role | Block | Short requirements |
|---|------|------|-------|-------------------|
| 1 | U1 | Grand Architect | Infra & security governance | GCP, Pulumi, bank perimeter |
| 2 | U2 | SRE Executor | CI/CD, Camunda workers, deploy | K8s/Helm, automation |
| 3 | U3 | Cognitive Designer | AI logic, RAG, retrieval quality | LLM, vectors, prompts |
| 4 | U4 | Knowledge Master | ETL, indexing, data | Unstructured data, BQ/SQL |
| 5 | U5 | Inquisitor (QA) | Validation, load scenarios | SDET, automation, REF |
| 6 | U6 | Grand Auditor | Compliance, explainability, reports | FinTech compliance, BQ audit |

---

## 5. Eleven application stages (workflow)

| # | Stage | What | Owner |
|---|--------|------|--------|
| 1 | Ingestion | Raw data (PDF, forms) → GCS | U4 |
| 2 | Normalization | Clean, single schema | U4 |
| 3 | Embedding | Vectorise (Vertex / agreed path) | U3 |
| 4 | Indexing | Vectors in pgvector (e.g. HNSW) | U4 |
| 5 | Orchestration | Camunda BPMN | U2 |
| 6 | Retrieval | Bank-rule context | U3 |
| 7 | Reasoning | Form vs rules (LLM) | U3 |
| 8 | Risk scoring | Final score / class | U1/U3 (product must fix score owner) |
| 9 | Verification | Gold-path check (REF) | U5 |
| 10 | Persistence | Immutable verdict / audit write to DB | U2, U4 |
| 11 | Audit trace | Reports incl. BQ for regulator / NBP | U6 |

*Earlier drafts used U2/U1 for persistence; canonical is **U2 (runtime write path) + U4 (data store)**.*

---

## 6. Interactions

- **Business — U6:** policy intent; legitimacy checks.
- **U3 — U4:** vector quality and index layout ↔ data supply.
- **U2 — U1:** delivery within security policy.
- **U5 — everyone:** independent sign-off to PROD (per env matrix).

---

## 7. Annex A — `personnel_clearance` (example)

Use **corporate** identities; do not put personal email in the repo. Replace placeholders at rollout. See also [gcp-saas-access-matrix-11x6](/en/gcp-saas-access-matrix-11x6) and [infra-pulumi-iac](/en/infra-pulumi-iac).

```yaml
infrastructure:
  provider: "Google Cloud Platform"
  security_tier: "Sovereign Financial"

personnel_clearance:
  - id: u1_architect
    status: GrandMaster
    idp_subject: "REPLACE_U1"
  - id: u2_sre
    status: Execution_Lead
    idp_subject: "REPLACE_U2"
  - id: u3_ai_logic
    status: Cognitive_Designer
    idp_subject: "REPLACE_U3"
  - id: u4_data_master
    status: Knowledge_Custodian
    idp_subject: "REPLACE_U4"
  - id: u5_inquisitor
    status: Truth_Verifier
    idp_subject: "REPLACE_U5"
  - id: u6_auditor
    status: Legal_Shield
    idp_subject: "REPLACE_U6"

privileges:
  - environment: PROD
    control: "U1, U2, U6 (limited); detail in IAM"
  - environment: REF
    control: "U5 and agreed U3/U4 sessions"
  - environment: DEV
    control: "engineering access per policy"
```

---

## 8. Annex B — stages and agents (machine-readable)

`competencies_covered: 11`: six agents cover 11 process checkpoints (not always 1:1 FTE).

```yaml
project_id: hbg-rag-dominance
region: europe-central2
competencies_covered: 11

stages:
  1: { name: Ingestion,        primary: U4 }
  2: { name: Normalization,    primary: U4 }
  3: { name: Embedding,        primary: U3 }
  4: { name: Indexing,         primary: U4 }
  5: { name: Orchestration,    primary: U2 }
  6: { name: Retrieval,        primary: U3 }
  7: { name: Reasoning,        primary: U3 }
  8: { name: Risk_scoring,     primary: [U1, U3] }
  9: { name: Verification,     primary: U5 }
  10: { name: Persistence,     primary: [U2, U4] }
  11: { name: Audit_trace,     primary: U6 }

agents:
  - id: u1_architect
    clearance: GrandMaster
    gcp_binding_note: "Least privilege; avoid roles/owner in PROD by default"
    k8s_access: cluster-admin
  - id: u2_sre
    clearance: Execution_Lead
    gcp_binding_note: "container, artifacts, runtime"
    k8s_access: edit
  - id: u3_ml_designer
    clearance: Cognitive_Designer
    gcp_binding_note: "aiplatform, storage read, aligned with data"
    k8s_access: edit
  - id: u4_data_custodian
    clearance: Resource_Master
    gcp_binding_note: "storage, bigquery per data zones"
    k8s_access: view
  - id: u5_inquisitor
    clearance: Truth_Verifier
    gcp_binding_note: "read-only + REF; no PROD PII without approval"
    k8s_access: edit
  - id: u6_auditor
    clearance: Legal_Shield
    gcp_binding_note: "metadata, logs, BQ reports"
    k8s_access: view
```

---

## 9. Risk if a role is missing (summary)

| Missing | Typical risk |
|---------|----------------|
| U3 | Uncontrolled LLM/RAG quality |
| U6 | Regulator / explainability gap |
| U1 | Unmanaged attack surface / access |
| U5 | Logic bugs shipped to PROD, regressions |

---

*End of document.*
