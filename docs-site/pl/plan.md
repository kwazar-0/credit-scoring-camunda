---
title: "Plan i roadmap"
description: "Strategia ewolucji, fazy wdrożenia i cykl życia komponentów; link do ścieżki infra."
---

# Plan i roadmap

**Poziom 3** — **jak system ewoluuje**. Szczegółowe kroki operatora i „gdzie patrzeć w kodzie” — [INFRA-IMPLEMENTATION](/pl/INFRA-IMPLEMENTATION) (jedna ścieżka). Ta strona wiąże **fazy** z **warstwami architektury** i **governance** bez kopiowania każdej komendy.


---

## Strategia ewolucji

1. **Fundament** — projekt GCP, API, Pulumi state, stosy, zasoby bazowe (GCS, BQ, rejestr). *Bez tego GKE i RAG nie są odtwarzalne.*
2. **Zaufanie do automatyzacji** — CI do GCP (OIDC / WIF), bez długotrwałych kluczy JSON w pipeline.
3. **Runtime** — GKE (Standard), workloady, Workload Identity, namespace zgodne z `k8s/hbg/` i `k8s/camunda/`.
4. **Dane i warstwa poznawcza** — RAG (GCS → ingest → embeddingi / vector search), by zachowanie backendu odpowiadało realnym opóźnieniom, nie tylko mockom.
5. **Proces w chmurze** — BPMN/DMN, Zeebe, workery, sekrety; testy E2E procesu.
6. **Dojrzałość** — obserwowalność, macierz dostępu, CODEOWNERS, hardening (zob. [system-philosophy-governance](/pl/system-philosophy-governance) i [appendix](/pl/appendix)).

**Odrzucony skrót:** najpierw Camunda i workery, RAG na końcu — wysokie **ryzyko refaktoru** przy zmianie kontraktów retrieval. W repozytorium najpierw **wiarygodna ścieżka danych**, potem uznajemy proces za „zamknięty”.

---

## Fazy (skrót)

| # | Faza | „Gotowe” (krótko) | Gdzie |
|---|--------|----------------------|--------|
| 1 | Chmura + IaC (dev) | Pulumi up na **dev**, zasób, state | [INFRA-IMPLEMENTATION](/pl/INFRA-IMPLEMENTATION), [infra-pulumi-iac](/pl/infra-pulumi-iac) |
| 2 | CI → GCP | Pipeline OIDC, brak commitowanych kluczy | Workflows, `workload_identity_github.py` |
| 3 | GKE + obrazy | Standard, obrazy w AR, WI dla podów | [infra-pulumi-iac](/pl/infra-pulumi-iac), `k8s/hbg/` |
| 4 | Dane RAG | PDF → GCS → embeddingi, wektor bez mock-DB | [ml-data-rag](/pl/ml-data-rag), `data/` |
| 5 | Camunda w stosie | BPMN/DMN, stabilne workery względem backendu | `bpmn/`, `dmn/`, `worker/` |
| 6 | Obserwacja / policy | Logi, BQ, macierz ról, least privilege | [gcp-saas-access-matrix-11x6](/pl/gcp-saas-access-matrix-11x6) |

**Kontur MVP (z handoff):** w pierwszej kolejności **1 → 4**, potem **5** i E2E; **6** bywa post-MVP.

---

## Cykl życia głównych elementów

- **BPMN/DMN** — wersjonowane w repo; wdrożenia z tą samą **dyscypliną recenzji** co kod; zmiana procesu to **pełnoprawna** zmiana.
- **Backend / workery** — **monorepo**, by utrzymać spójność job types i API; rozdzielenie repozytoriów tylko przy oddzielnych pociągach wydawniczych (por. [architecture](/pl/architecture)).
- **Stosy Pulumi** — **infra-core** (wolno: VPC, PSA), **infra-data** (trwałe magazyny), **infra-runtime** (GKE, częściej); unikać jednego `up` na wszystko.
- **Modele** — Vertex w regionie; zewnętrzne LFM wymagają **bramki** i polityki PII (zob. `pii` w backendzie).

**Skalowanie:** workery i klaster — przepustowość; RAG i BQ — wolumen dowodów; governance (role, SDLC) — model **11×6**, a nie ad-hoc admin.

---

## Terminologia (spójność)

- **Środowiska** — np. **dev** / **stage** / **prod** (dokładne nazwy w Pulumi — [naming](/pl/naming), [accounts](/pl/accounts)).
- **Stosy** — `stackRole` Pulumi; nie mylić z *procesem* Camunda ani *namespace* Kubernetes bez kontekstu.
- **Workflows** — instancje **Camunda** vs CI **GitHub Actions** — rozróżniać w runbookach.

**Dalej:** [appendix](/pl/appendix) · [main](/pl/main).

> [English](/en/plan) · [Русский](/ru/plan)
