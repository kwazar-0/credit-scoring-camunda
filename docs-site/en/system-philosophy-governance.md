---
layout: page
title: System Philosophy and Governance Model
description: Governance-first operating model for auditable credit decisioning.
outline: [2, 3]
---

# Credit Scoring Camunda

## System Philosophy and Governance Model

This page defines how the platform is governed, why it is structured this way, and how changes move safely from idea to production.

---

## 1. Purpose

The platform exists to make credit decisioning:

- explicit;
- controlled;
- auditable.

In regulated environments, correctness and traceability matter more than delivery speed.  
The architecture is intentionally designed around this constraint.

---

## 2. Governing Principle

> The system is organized by **responsibility boundaries**, not only by code modules.

The platform explicitly defines:

- who can change decision logic;
- who can change process orchestration;
- who can change runtime infrastructure.

No layer is changed “by convenience”.

---

## 3. Responsibility Layers

| Layer | Primary concern | Typical owner | Change profile |
|---|---|---|---|
| Decision (DMN) | Business decision rules | Business + Engineering | Frequent |
| Process (BPMN/Camunda) | Process flow and control points | Process / Platform | Moderate |
| Execution (Services/Workers) | Integrations and implementation logic | Engineering | Moderate |
| Infrastructure (GCP/Pulumi) | Runtime, identity, networking, data plane | Platform | Slower, high impact |

**Integrity rule:** do not flatten these layers into each other.

---

## 4. Governance Model (11 × 6)

Governance is two-dimensional:

- **11 roles** define what can be changed;
- **6 operational domains/accounts** define where that authority applies.

This creates enforceable separation of duties and limits privilege spread.

Detailed matrix: [gcp-saas-access-matrix-11x6](/en/gcp-saas-access-matrix-11x6)

---

## 5. Unified Access Across Control Surfaces

The same governance model applies to:

- GitHub (source and review flow);
- GCP (infrastructure and data resources);
- Camunda (processes and decision execution).

> Access should be defined once and enforced consistently.

This avoids policy drift and hidden privilege paths.

---

## 6. Controlled Change Lifecycle

System changes follow a controlled path:

1. A role-scoped change is created.
2. The change passes review and policy checks in Git workflow.
3. Process and/or infrastructure are updated through declared mechanisms.
4. The result is observable, attributable, and auditable.

Reference workflow: [git-workflow](/en/git-workflow)

---

## 7. Infrastructure Governance (Pulumi)

Infrastructure is declared and versioned via Pulumi.  
The platform uses split stacks (`infra-core`, `infra-data`, `infra-runtime`) to reduce blast radius and isolate lifecycle concerns.

Implementation reference: [infra-pulumi-iac](/en/infra-pulumi-iac)

---

## 8. Design Trade-off

The platform optimizes for:

- auditability;
- controlled change;
- explicit ownership.

It does **not** optimize for:

- fastest prototyping;
- minimal operational process.

This trade-off is intentional.

---

## 9. Operating Rules (Short Form)

1. Keep decision logic, process logic, execution logic, and infrastructure separate.
2. Enforce role-scoped access (11 × 6) across all control surfaces.
3. Promote changes only through validated lifecycle stages.
4. Reject changes that cannot be explained, traced, and attributed.

---

## Related Docs

- [Entry (2-minute)](/en/main)
- [Simplified model](/en/simplified)
- [Architecture](/en/architecture)
- [Plan & roadmap](/en/plan)
- [Appendix](/en/appendix)
- [System summary (1 page)](/en/system-summary)

**Languages:** [Русский](/ru/system-philosophy-governance) · [Polski](/pl/system-philosophy-governance)
