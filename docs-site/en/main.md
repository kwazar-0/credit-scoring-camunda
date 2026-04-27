---
title: "Credit Scoring Camunda Platform"
description: "2-minute entry: controlled credit decisioning for regulated environments."
---

# Credit Scoring Camunda Platform

## A controlled credit decisioning system built for regulated environments

---

## 1. What this system is

This platform is a **credit scoring and decision orchestration system** built on Camunda, GCP, and a strict governance model.

It is designed to ensure that every credit decision is:

- **deterministic**
- **auditable**
- **traceable**
- **controlled through explicit permissions**

---

## 2. What happens in the system

A credit application follows a fully observable workflow:

```text
Customer Application
        ↓
API Layer
        ↓
Camunda Process Engine
        ↓
Business Rules (DMN)
        ↓
External Services / Workers
        ↓
Decision Engine
        ↓
Final Credit Decision
```

At every step:

- the state is persisted;
- the decision is traceable;
- the responsible role is defined.

---

## 3. Why this system exists

Credit scoring systems in regulated environments require:

- strict auditability (who changed what and why);
- controlled execution (no implicit logic);
- separation of concerns;
- reproducible infrastructure.

This system enforces these constraints by design.

---

## 4. Core architecture principles

### 4.1 Separation of concerns

The system is divided into independent layers:

- **Decision layer (DMN)** → business rules;
- **Process layer (Camunda)** → orchestration;
- **Execution layer (services/workers)** → implementation;
- **Infrastructure layer (GCP + Pulumi)** → runtime environment.

Detailed layer mapping: [architecture](/en/architecture).

---

### 4.2 Controlled change model

No change is applied directly to production.

All changes move through a controlled pipeline:

```text
feature/* → develop → release/* → main
```

Each stage represents a higher level of validation and trust.

Workflow policy details: [git-workflow](/en/git-workflow).

---

### 4.3 Unified governance model

Access across all system components is governed by a single model:

- GitHub (code & workflow);
- GCP (infrastructure);
- Camunda (process execution).

Access is defined by roles and enforced consistently across all layers.

See: [gcp-saas-access-matrix-11x6](/en/gcp-saas-access-matrix-11x6).

---

## 5. System components

### Camunda (Process Orchestration)

Executes BPMN workflows and coordinates system behavior.

### DMN (Decision Engine)

Encodes credit scoring rules as versioned, deterministic decision logic.

### Workers (Execution Layer)

Implements integrations and business logic.

### GCP (Infrastructure Layer)

Provides compute, networking, storage, and runtime services.

### Pulumi (Infrastructure as Code)

Defines and manages all cloud resources in a reproducible way.

---

## 6. Infrastructure model

All infrastructure is managed via Pulumi with centralized state:

```text
gs://credit-scoring-camunda-project-pulumi-state-euc2
```

Stack details and commands: [infra-pulumi-iac](/en/infra-pulumi-iac).

### Stack structure

- **infra-core**
  - VPC
  - subnetting
  - Private Service Access (PSA)
- **infra-data**
  - GCS buckets
  - BigQuery datasets
  - optional Cloud SQL (via core stack reference)
- **infra-runtime**
  - GKE (private nodes)
  - Workload Identity
  - Artifact Registry
  - Vertex AI integrations

---

## 7. Governance model (high-level)

The system uses a **role-based responsibility model (11 × 6)**:

- Roles define **what can be changed**;
- Users define **where it applies**;
- Permissions are consistent across:
  - GitHub
  - GCP
  - Camunda

This ensures:

- segregation of duties;
- controlled production access;
- full auditability of changes.

---

## 8. Key design principle

> The system is not organized around services.  
> It is organized around responsibilities.

Every change must be:

- explicitly owned;
- traceable;
- validated through a controlled lifecycle.

---

## 9. Summary

This platform demonstrates how a regulated credit scoring system can be built with:

- explicit governance;
- strict change control;
- separation of system layers;
- reproducible cloud infrastructure;
- observable business logic.

It is designed for environments where correctness and auditability are more important than speed of change.

---

## Next reading (layered path)

| Level | Document | You get |
|-------|----------|--------|
| 1 | [simplified model](/en/simplified) | Four core roles, mental model without stack noise. |
| 2 | [architecture](/en/architecture) | Components, layers, data flow, monorepo map, design trade-offs. |
| 3 | [plan & roadmap](/en/plan) | Phases, evolution, scaling mental model, links to the infra track. |
| 4 | [appendix index](/en/appendix) | Personas, matrices, long `prompt` §9, CLI, RAG details. |

**One-page view:** [system summary](/en/system-summary)  
**Governance text:** [system philosophy & governance](/en/system-philosophy-governance)  
**Implementation track:** [INFRA-IMPLEMENTATION](/en/INFRA-IMPLEMENTATION)

> Other languages: [Русский (полный)](/ru/main) · [Polski (pełny)](/pl/main)
