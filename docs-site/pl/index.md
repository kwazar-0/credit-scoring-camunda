---
layout: page
title: Dokumentacja techniczna
description: Monorepo Credit Scoring / HBG — VitePress
outline: [2, 3]
---

# Credit Scoring / HBG

## DevOps-first ścieżka (start)

Czytaj w kolejności: **[devops-operating-model](/pl/devops-operating-model)** → **[cicd-pipeline](/pl/cicd-pipeline)** → **[deployment-lifecycle](/pl/deployment-lifecycle)** → **[observability-and-incident](/pl/observability-and-incident)** → **[governance-and-controls](/pl/governance-and-controls)**.

---

## Adnotacja rozwiązania

**HBG Credit Scoring** to platforma automatyzacji procesu kredytowego, gdzie decyzja jest realizowana jako kontrolowany proces inżynierski, a nie pojedyncze wywołanie LLM.  
Rdzeń: **Camunda 8 (BPMN/DMN)** + **FastAPI/LangGraph** + **RAG na Vertex AI** + **GKE/Pulumi**.

Wartość rozwiązania:

- **Przejrzysty przebieg decyzji** — BPMN/DMN pokazuje kroki i odpowiedzialności.
- **Kontrolowana warstwa AI** — LLM działa wewnątrz reguł i procesu, nie zamiast nich.
- **Gotowość audytowa** — role, dostępy i działania są śledzalne.
- **Skalowalność operacyjna** — infrastruktura jest rozdzielona po lifecycle (`infra-core` / `infra-data` / `infra-runtime`).

## Filozofia projektu

- **Git jako źródło prawdy** — decyzje techniczne, IaC i dokumentacja są wersjonowane i recenzowane razem.
- **Orkiestracja ponad ad-hoc** — proces kredytowy jest jawny i audytowalny (BPMN/DMN), z kontrolowanym miejscem dla AI.
- **Least privilege i SoD** — dostęp do GCP/GitHub jest mapowany przez role, nie przez „wszyscy admin”.
- **Split lifecycle** — sieć, dane i runtime rozwijają się osobno, z mniejszym blast radius.

## Jak czytać dokumentację

### 1) Narracja (koncepcja → głębia)

- **[main](/pl/main)** — czym jest system, model 2 minuty, diagram.
- **[simplified](/pl/simplified)** — cztery główne role i odpowiedzialności.
- **[architecture](/pl/architecture)** — komponenty, przepływ, decyzje.
- **[plan](/pl/plan)** — ewolucja, fazy (skrót), cykl komponentów.
- **[dodatek](/pl/appendix)** — indeks głębokich stron (persony, RAG, CLI).

### 2) Start wdrożenia

- **[INFRA-IMPLEMENTATION](/pl/INFRA-IMPLEMENTATION)** — główny porządek faz i ścieżka startowa.
- **[architecture](/pl/architecture)** — układ systemu, granice i przepływ danych.
- **[infra-pulumi-iac](/pl/infra-pulumi-iac)** — Pulumi, `stackRole`, split, OIDC.

### 3) Operacje i debug

- **[cli-console](/pl/cli-console)** — komendy `gcloud`, Pulumi, `kubectl`.
- **[ml-data-rag](/pl/ml-data-rag)** — RAG/Vertex i env backendu.
- **[toc](/pl/toc)** — pełny spis treści.

### 4) Governance (po MVP)

- **[gcp-saas-access-matrix-11x6](/pl/gcp-saas-access-matrix-11x6)** — model dostępu do GCP wg ról.
- **[team-11x6-organization](/pl/team-11x6-organization)** — model zespołu, persony i SDLC.
- **[github-codeowners-matrix](/pl/github-codeowners-matrix)** — odpowiedzialność review w GitHub.

## Repozytorium

- **GitHub:** [kwazar-0/credit-scoring-camunda](https://github.com/kwazar-0/credit-scoring-camunda)
- **Nazewnictwo/remote:** [naming](/pl/naming)

---

**Języki:** [English](/en/) · [Русский](/ru/) · [ADR](/adr)
