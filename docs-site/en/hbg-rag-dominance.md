# HBG RAG-DOMINANCE — strategy and system boundaries

| Field | Value |
|-------|--------|
| **Status** | Internal; not for external publication without approval |
| **Related** | [hr-offers-hbg](/en/hr-offers-hbg) — job specs, RACI, 11-stage workflow, 6×11 matrix |
| **Default region (IaC)** | `europe-central2` (see repo `.cursorrules`, `access_matrix` in [hr-offers-hbg](/en/hr-offers-hbg)) |

**Other languages:** [Русский](/ru/hbg-rag-dominance) · [Polski](/pl/hbg-rag-dominance)

---

## 1. Purpose

This page records the **strategic frame** for the credit pipeline platform built on RAG, Camunda orchestration, and cloud infrastructure: why the bank invests in team and tech, which **functions** must be covered, and how the business interfaces with the system. Role detail, hiring, and the technical workflow are in [hr-offers-hbg](/en/hr-offers-hbg).

---

## 2. Investment rationale (short)

- **Lower operational risk:** automate repeatable decisions while the bank keeps control of policies and data.
- **Accountability and testability:** critical areas (data, model, infra, compliance) are split by role; changes are tested and audited.
- **ROI:** assessed via reduced losses and errors, not as a “first-year payback” promise without a separate financial model (that model is out of scope here).

---

## 3. Roles U1–U6 (functional guarantees)

Each headcount slot maps to a **control point**. **Job Objectives** below align with [hr-offers-hbg](/en/hr-offers-hbg).

| Code | Role (short) | Job objective |
|------|--------------|---------------|
| **U1** | Platform / security architect | Sovereignty over code, data, and cloud perimeter; access policy; infra fit to bank and regulator requirements. |
| **U2** | SRE / delivery | Stable CI/CD, runtime (incl. K8s, orchestration workers); observability and continuity. |
| **U3** | ML / RAG / semantics | AI behaviour matches **bank policies**; retrieval, prompts, reasoning chains; fewer bad interpretations. |
| **U4** | Data / knowledge | Ingest, normalise, refresh corporate knowledge for the model; pipelines, stores, data quality. |
| **U5** | QA / validation | Independent verification (incl. **REF**); failure and regression tests against “gold” before PROD. |
| **U6** | Compliance / explainability / audit | Traces and reports for internal control and regulators; legal alignment. |

**Note:** [hr-offers-hbg](/en/hr-offers-hbg) lists **four** open roles while the operating model uses **six** U1–U6 slots; some duties may be combined or contracted — final team plan is in hiring.

---

## 4. Request–result flow (business interface)

- **Policies:** changing rules (e.g. updating a policy document) is an input for U3/U4/U6; the goal is **traceable** behaviour change, not ad-hoc handling without a record.
- **Explain approve/deny:** output is a protocol/trace with enough detail for internal and regulatory review (U3/U6; log infra U1/U2).

---

## 5. Environments and access (summary)

| Env | Purpose | Who (typical) |
|-----|---------|---------------|
| **DEV** | Development, experiments | Engineering access per bank policy |
| **REF** | Validation, golden paths, pre-PROD stress | U5; others by agreed matrix |
| **PROD** | Production | Restricted (e.g. U1, U2, U6) — detail in [hr-offers-hbg](/en/hr-offers-hbg) and repo `access_matrix` (no secrets in git) |

---

## 6. Access matrix

The normative `access_matrix` snippets (personnel, envs, 11 stages, agents) are annexes in [hr-offers-hbg](/en/hr-offers-hbg). Production IAM and identities must sync with corporate IdP and current `docs-site` / repo policy, not personal emails in code.

---

*Formal snapshot; if the repo diverges, code and the live access matrix in `infra` / `docs-site` win.*
