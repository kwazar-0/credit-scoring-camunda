---
title: "Wejscie do systemu (main)"
description: "Strona startowa z perspektywa produkcyjnego DevOps."
---

# Wejscie do systemu (main)

## 1. Czym jest system

HBG Credit Scoring to platforma decyzji kredytowej oparta o Camunda dla środowiska regulowanego: BPMN orkiestruje proces, DMN przechowuje deterministyczne reguly, a infrastruktura jako kod utrzymuje audytowalne i powtarzalne wdrozenia.

## 2. Jak dziala na produkcji (DevOps flow)

```text
PR -> CI (build + test + scan) -> publikacja artefaktu -> deploy do dev
   -> promotion do stage (approval + testy integracyjne)
   -> promotion do prod (approval + kontrolowany rollout)
   -> runtime monitoring (logi + metryki + alerty)
   -> incident response / rollback do last stable release
```

### Model wdrozenia i odzyskiwania

- Zmiany infra sa stosowane przez Pulumi w kolejnosci: core -> data -> runtime.
- Workloady na GKE sa wdrazane z immutable image i versioned manifests/charts.
- Aktualizacja Camunda obejmuje versioned BPMN/DMN, aby uniknac drift procesu i regul.
- Promotion miedzy srodowiskami uzywa tego samego artifact digest.
- Przy bledzie health-check lub SLO breach wykonywany jest rollback do ostatniej stabilnej wersji.

## 3. Kluczowe komponenty

- Camunda i Zeebe do orkiestracji workflow i utrzymania stanu procesu.
- DMN dla deterministycznej i reviewowalnej logiki scoringowej.
- API i workery do integracji oraz wykonania process tasks.
- GCP runtime (GKE, Cloud Storage, Artifact Registry, IAM) jako platforma produkcyjna.
- Pulumi multi-stack IaC (core/data/runtime) dla kontrolowanych zmian infra.

## Operations (DevOps)

- Deployment model: [ops/deployment](/pl/ops/deployment)
- CI/CD controls: [ops/cicd](/pl/ops/cicd)
- Observability model: [ops/observability](/pl/ops/observability)
- Failure and recovery flow: [ops/incidents](/pl/ops/incidents)
