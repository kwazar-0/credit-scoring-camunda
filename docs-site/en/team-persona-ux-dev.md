# Persona: **ux-dev** (DEV-UX)

**11-slot bundle:** Dev •, Release •, Data ○, ML •.  
**Purpose:** **end-to-end** application engineer: API, LangGraph, Vertex integration, release readiness; secondary alignment with Data.

**Team concept:** [team-11x6-organization](/en/team-11x6-organization) · **RU:** [/ru/team-persona-ux-dev](/ru/team-persona-ux-dev)

---

## Mandate

- **Owns:** `backend/`, `worker/` job logic, Zeebe contracts, RAG config in code, PyTest in scope.  
- **Does not own:** GCP org admin; under strict SoD, do not self-approve Environment if you are the only Release voice.

**Release •** here means **artefact readiness** for tags/changelog, not necessarily the only Environment button-presser.

---

## SDLC — example epic → prod

| Phase | Actions | Output |
|-------|---------|--------|
| **1** | OpenAPI, `ai-loan-analysis` contract, graph step design | RFC PR, DMN if needed |
| **2** | `feature/*` from `develop` | PR + unit tests |
| **3** | compose or dev cluster; mock/real vector per [ml-data-rag](/en/ml-data-rag) | CI green |
| **4** | with **pk-qa**: API + worker scenarios | checklist |
| **5** | merge to `release/*`; regression | stable ref |
| **6** | post Environment approve — image/manifest from CI only | `v*` tag |
| **7** | UAT defect support | patch branch |
| **8–9** | postmortem as change author; never tamper audit logs | RCA |

---

## GitHub

`backend/`, `worker/`, `bpmn/` with QA, `tests/`. [github-codeowners-matrix](/en/github-codeowners-matrix).

---

## GCP

**Dev** slot: dev namespace, dev datasets, **dev** Vertex endpoints. No `container.admin` in prod; deploy via CI/Platform.

---

## Anti-patterns

- Business rules **only** in Streamlit (`ui/`).  
- Hard-coded secrets; bypassing PII masking “for speed”.
