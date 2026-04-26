# Persona: **sh-dev** (DEV-SH)

**11-slot bundle:** Dev ○, Data •, ML •.  
**Purpose:** **data- and ML-heavy** engineer: ingest, corpus quality, embeddings, index; code where data meets app (`data/`, parts of `backend/`).

**Team concept:** [team-11x6-organization](/en/team-11x6-organization) · **RU:** [/ru/team-persona-sh-dev](/ru/team-persona-sh-dev)

---

## Mandate

- **Owns:** `data/ingest`, GCS prefix contracts, with ML — index params / RAG eval.  
- **Does not own:** VPC topology; no sole merge of critical infra without Platform.

---

## SDLC — leading phases

| Phase | Actions | Output |
|-------|---------|--------|
| **1** | data schema, corpus SLA, PII boundaries | data contract |
| **2** | ingest pipelines, BQ jobs, `data/` scripts | PR |
| **3–4** | dev GCS fill; retrieval quality | eval metrics |
| **5** | dataset promotion to ref (versioned) | manifest |
| **6** | “what goes to prod index” with Release/Sec | change log entry |
| **7** | incidents: stale regs / hallucination triage | data/index patch |
| **8–9** | corpus version immutability; lineage for audit | lineage |

---

## GCP

**Data** slot: object admin on **data** buckets, BQ editor/jobUser on prefixes. **ML** slot: Vertex index **dev→promotion** via CI.

---

## Anti-patterns

- Direct **prod** GCS edits without version/CI.  
- Same account = **Data** object admin + **Platform** cluster admin in prod.
