---
title: "Podsumowanie systemu"
description: "Architektura, governance i odpowiedzialności — HBG Credit Scoring."
---

# Podsumowanie systemu

**HBG Credit Scoring** to **monorepo** do **demonstracji / szkolenia** **zautomatyzowanego obiegu kredytowego**: **Camunda 8** (BPMN/DMN) orkiestruje; **FastAPI + LangGraph** i **Vertex AI** dają warstwę poznawczą (RAG + LLM w polityce); **workery PyZeebe** obsługują zadania; **GCP** (domyślnie **europe-central2**) i **Pulumi** (stosy **infra-core** / **infra-data** / **infra-runtime**) to odtwarzalna infrastruktura. **VitePress** w `docs-site/` to SoT dokumentacji; `doc/_archive/` tylko **archiwum**.

---

## Architektura (w skrócie)

| Wątek | Wybór | Uwaga |
|--------|--------|------|
| Proces | Camunda 8, BPMN + **DMN** | Etapy, human tasks, kroki audytowalne, nie tylko „kodflow”. |
| Aplikacja / AI | `backend/`, `worker/` | PII: maskuj przed zewn. LLM; `pii` w backendzie. |
| Dane | GCS, BQ, opcjonalnie Cloud SQL / wektor | RAG: [ml-data-rag](/pl/ml-data-rag). |
| Runtime | GKE **Standard** | ADR i [architecture](/pl/architecture) — Autopilot / SaaS. |
| IaC | Pulumi, split | `stackRole` i kolejność — [infra-pulumi-iac](/pl/infra-pulumi-iac). |

**Przepływ danych (uproszczenie):** request → API / graf → Zeebe → retrieval i LLM → Camunda, zadania → logi / BQ (bez jawnego **PESEL** w logach).

**Integralność (nie zacierać):** **DMN** (reguły) · **Camunda** (orkiestracja) · **serwisy/workery** (wykonanie) · **Pulumi/GCP** (infrastruktura) — cztery warstwy.

---

## Model governance

- **Git** — decyzje, IaC i dokumentacja w jednym przeglądzie.  
- **Least privilege** — nie każdy admin; dostęp przez **role** (cztery — [simplified](/pl/simplified)).  
- **11×6** — jedenaście aspektów × **sześć** **kont** GCP plus GitHub/CODEOWNERS; [gcp-saas-access-matrix-11x6](/pl/gcp-saas-access-matrix-11x6), [team-11x6-organization](/pl/team-11x6-organization).  
- **Filozofia (pełna):** [system-philosophy-governance](/pl/system-philosophy-governance).

---

## Odpowiedzialności

- **Business** — intencja skoringu i polityka ryzyka; wspólnie **DMN** i reguły produktowe.  
- **Inżynierowie** — serwisy, workery, testy; nie omijać procesu.  
- **Platform** — sieć, klaster, Pulumi, IAM, wydania.  
- **Operatorzy** — monitoring, incydenty, SLO; zmiany według **planu** i **dostępów**, nie ad-hoc.

**Czytanie warstwami:** [main](/pl/main) → [simplified](/pl/simplified) → [architecture](/pl/architecture) → [plan](/pl/plan) → [appendix](/pl/appendix).

> [REORG-CHANGE-REPORT](/REORG-CHANGE-REPORT) — raport. · [English](/en/system-summary) · [Русский](/ru/system-summary)
