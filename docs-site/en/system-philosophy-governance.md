---
layout: page
title: System Philosophy and Governance Model
description: Credit Scoring Camunda - governance-first architecture model
outline: [2, 3]
---

# Credit Scoring Camunda

## System Philosophy and Governance Model

---

## 1. Why This System Exists

This platform is designed for one purpose:

> **Make business decisions explicit, controlled, and auditable.**

In a credit scoring system:

- decisions affect risk and compliance
- changes must be traceable
- responsibility must be clearly assigned

This system enforces those constraints by design.

---

## 2. Core Principle

> **The system is governed by responsibility boundaries, not by code structure.**

Instead of allowing any engineer to modify any part of the system, we define:

- **who can change decisions**
- **who can change processes**
- **who can change infrastructure**

Each action is intentional and controlled.

---

## 3. Layered Architecture

The platform is divided into independent layers:

| Layer | Responsibility | Change Frequency |
| --- | --- | --- |
| Decision (DMN) | Business rules | High |
| Process (BPMN) | Orchestration | Medium |
| Services | Execution logic | Controlled |
| Infrastructure | Cloud platform (GCP) | Low |

### Key Rule

> Each layer evolves independently and is owned by different roles.

This prevents:

- hidden logic
- accidental cross-layer changes
- uncontrolled deployments

---

## 4. Role-Based Governance (11 x 6 Model)

The system uses a **two-dimensional governance model**:

- **11 roles** -> define responsibilities
- **6 user domains** -> define scope of operation

### What this means

A role does not represent a job title.  
A role represents a **controlled capability** within the system.

Example:

- A user may modify decision rules
- But cannot deploy infrastructure
- And cannot promote code to production

### Why this exists

To enforce:

- segregation of duties
- auditability
- minimal privilege access

---

## 5. Unified Access Model

The same role model is applied consistently across:

- GitHub (source code and workflow)
- GCP (infrastructure and data)
- Camunda (processes and decisions)

### Principle

> Access is defined once and enforced everywhere.

This avoids:

- inconsistent permissions
- hidden access paths
- security gaps

---

## 6. Git Workflow as Control Mechanism

The Git workflow is not just a development process.  
It is a **control pipeline for system changes**:

| Stage | Purpose |
| --- | --- |
| feature | change creation |
| develop | integration |
| release | validation |
| main | production state |

### Key Rule

> Moving code between branches requires validation and approval.

This ensures that:

- no change reaches production without control
- all changes are traceable

---

## 7. Infrastructure as Code (Pulumi)

All infrastructure is managed via Pulumi with a shared state:

```text
gs://credit-scoring-camunda-project-pulumi-state-euc2
```

Infrastructure is split into independent stacks:

### infra-core

- VPC, subnets, Private Service Access
- foundational networking layer

### infra-data

- storage (GCS), analytics (BigQuery), optional Cloud SQL
- data lifecycle management

### infra-runtime

- GKE (private nodes), Workload Identity
- execution environment for services and Camunda

### Principle

> Infrastructure is versioned, reproducible, and isolated by layer.

---

## 8. System Behavior

A typical change follows this path:

1. Decision or code is modified within a defined role
2. Change is committed via controlled Git workflow
3. Infrastructure or process is updated via Pulumi / Camunda
4. Change becomes visible and auditable in the system

---

## 9. What This System Optimizes For

This platform is designed for:

- **auditability**
- **controlled change management**
- **clear ownership boundaries**

It is not optimized for:

- rapid prototyping
- minimal process overhead

---

## 10. Summary

The system enforces three constraints:

1. **Separation of responsibilities across layers**
2. **Explicit access control via role model (11 x 6)**
3. **Controlled change flow via Git and infrastructure pipelines**

> If a change cannot be explained, traced, and attributed,  
> it should not exist in the system.


**Languages:** [Русский](/ru/system-philosophy-governance) · [Polski](/pl/system-philosophy-governance)
