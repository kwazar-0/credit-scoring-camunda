---
layout: page
title: Dokumentacja techniczna
description: Monorepo Credit Scoring / HBG — VitePress
outline: [2, 3]
---

# Credit Scoring / HBG

Dokumentacja w `docs-site/`; kod: `backend/`, `worker/`, `ui/`; IaC: `infra/`. Region domyślny: `europe-central2`. Opis stosu i przepływów: [architecture](/pl/architecture).

## Szybki start

- [INFRA-IMPLEMENTATION](/pl/INFRA-IMPLEMENTATION) — mapa prac (fazy, linki)  
- [architecture](/pl/architecture) — przegląd architektury  
- [infra-pulumi-iac](/pl/infra-pulumi-iac) — Pulumi, `stackRole`, OIDC  
- [ml-data-rag](/pl/ml-data-rag) — ML, RAG, env backendu  
- [cli-console](/pl/cli-console) — `gcloud`, Pulumi, `kubectl`  
- [toc](/pl/toc) — spis treści

## Model ról i dostępu (opcjonalnie po MVP)

- [gcp-saas-access-matrix-11x6](/pl/gcp-saas-access-matrix-11x6) — macierz 11 ról × GCP, 6 kont  
- [team-11x6-organization](/pl/team-11x6-organization) — zespół 11×6, persony, SDLC  
- [github-codeowners-matrix](/pl/github-codeowners-matrix) — CODEOWNERS

## Repozytorium

Kod i CI: [github.com/kwazar-0/credit-scoring-camunda](https://github.com/kwazar-0/credit-scoring-camunda) (remote kanoniczny w [naming](/pl/naming)).

---

**Języki:** [English](/en/) · [Русский](/ru/) · [ADR](/adr)
