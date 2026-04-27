# Credit Scoring Camunda Platform

## 2-minute overview

This project demonstrates a **regulated credit scoring system** built with:

* Camunda (process orchestration)
* GCP (cloud infrastructure)
* Pulumi (infrastructure as code)
* Git-based governance model
* Role-based access control (11×6 model)

---

## What this system does

The platform processes credit applications through a controlled workflow:

```
User → API → Camunda Process → Workers → Decision (DMN) → Result
                         ↓
              GCP Infrastructure (Pulumi-managed)
```

Every step is:

* observable
* auditable
* version-controlled

---

## Why this architecture exists

Credit scoring systems require:

* strict auditability
* controlled changes
* separation of responsibilities
* traceable decision logic

This system enforces these constraints by design, not by process discipline.

---

## Core building blocks

### 1. Camunda (Process Layer)

Handles orchestration of business workflows.

### 2. Decision Layer (DMN)

Defines credit scoring rules and decisions.

### 3. Execution Layer (Workers)

Implements business logic and integrations.

### 4. Infrastructure Layer (GCP + Pulumi)

Provides reproducible cloud environment.

---

## Key principle

> Business logic, process logic, and infrastructure must evolve independently.

---

## Governance model

The system uses a **role-based access model (11×6)**:

* Roles define responsibilities
* Users define operational scope
* Access is consistent across GitHub, GCP, and Camunda

---

## Git workflow

Changes move through controlled stages:

```
feature → develop → release → main
```

Each stage represents a higher level of trust and validation.

---

## Infrastructure state

All infrastructure is managed via Pulumi:

```
gs://credit-scoring-camunda-project-pulumi-state-euc2
```

---

## Stacks

* infra-core → networking (VPC, PSA)
* infra-data → storage + analytics
* infra-runtime → GKE + runtime environment

---

## Summary

This system demonstrates how a regulated platform can be built with:

* explicit governance
* reproducible infrastructure
* controlled change management
* observable business logic
