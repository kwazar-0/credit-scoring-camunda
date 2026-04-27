---
title: "Wejście do systemu (main)"
description: "Czym jest HBG Credit Scoring, model na dwie minuty i dalsze kroki."
---

# Wejście do systemu (main)

**HBG Credit Scoring** to **demo / szkoleniowy** monorepo **automatycznego obiegu kredytowego w stylu regulowanym**: proces jest jawny, AI osadzone pod polityką, infrastruktura odtwarzalna. Domyślny region chmury: **`europe-central2`**. Kanoniczny podział kodu: [architecture](/pl/architecture) — ta strona to **narracyjne wejście** (poziom 0).

---

## Czym jest system

- **Orkiestracja procesu** — Camunda 8 (BPMN etapów, **DMN** reguł deterministycznych).
- **Aplikacja i graf** — FastAPI, LangGraph, Vertex (Gemini) w `backend/`.
- **Wykonanie** — **workery** PyZeebe w `worker/` (typy zadań powiązane z procesem).
- **Infrastruktura** — **GCP** (GKE Standard, GCS, BigQuery, opcjonalnie Cloud SQL itd.) z **Pulumi** i rozłącznymi stosami (`stackRole` / `infra-core` · `infra-data` · `infra-runtime`).

> Logika biznesowa, definicja procesu i infrastruktura **rozwijają się niezależnie** z założenia.

---

## Po co to jest

Kredyt i scoring wymagają **śledzalności**: kto zmienił regułę, jaka wersja procesu działała, co widział model (bez surowych PII w logach). Stos stawia na **kontrolę i audytowalność**, nie na minimalną liczbę ruchomych części. To świadome kompromisy (wolniej niż jeden mikroserwis, więcej pojęć niż w skrypcie).

---

## Model na dwie minuty

```text
Wnioskodawca / kanał
        │
        ▼
   HTTP API (FastAPI) ──► LangGraph / Vertex (RAG + LLM, w polityce)
        │
        ▼
   Zeebe / Camunda (stan BPMN, human tasks, incydenty)
        │
        ├─► DMN (reguły deterministyczne, mniej niedeterminizmu)
        ├─► Workery (PyZeebe) ↔ serwisy, magazyny danych
        └─► Obserwowalność, BigQuery, logi (PII: maskować przed zewn. LLM)
        │
        ▼
   GKE + Pulumi (IaC), Artifact Registry, Secret Manager, IAM
```

**Rozdziałów nie zacieramy** w dokumentacji ani w kodzie:

| Warstwa | Odpowiedzialność |
|--------|-----------------|
| **DMN** | Reguły biznesowe deterministyczne. |
| **BPMN / Camunda** | Orkiestracja, human tasks, kroki w śladzie audytu. |
| **Serwisy / workery** | Integracje, scoring, handlery zadań. |
| **GCP + Pulumi** | Sieci, klaster, data plane, tożsamość — **IaC SoT** w `infra/pulumi/`. |

---

## Gdzie dalej (warstwy)

| Poziom | Dokument | Co dostajesz |
|-------|----------|--------|
| 1 | [model uproszczony](/pl/simplified) | Cztery role, model mentalny bez szumu stosu. |
| 2 | [architektura](/pl/architecture) | Komponenty, warstwy, przepływ, monorepo, kompromisy. |
| 3 | [plan i roadmap](/pl/plan) | Fazy, ewolucja, skalowanie governance, linki. |
| 4 | [dodatek (indeks)](/pl/appendix) | Persony, macierze, długi `prompt` §9, CLI, RAG. |

**Jedna strona — w skrócie:** [podsumowanie](/pl/system-summary).

**Governance (pełny tekst):** [filozofia i governance](/pl/system-philosophy-governance) · [macierz GCP 11×6](/pl/gcp-saas-access-matrix-11x6).

**Ścieżka wdrożeniowa (operator):** [INFRA-IMPLEMENTATION](/pl/INFRA-IMPLEMENTATION).

> Inne języki: [English: main →](/en/main) · [Русский: вход →](/ru/main)