---
title: "Simplified model (roles)"
description: "Core roles and responsibility boundaries for HBG; link to 11×6 where needed."
---

# Simplified model

This page is **LEVEL 1** — a **human** mental model. For stacks, GKE, and Pulumi, read [architecture](/en/architecture). For full GCP personas and the six accounts, use [appendix](/en/appendix) and [team 11×6](/en/team-11x6-organization).

---

## Core idea

Access is **responsibility-based**, not a flat job title. A “role” here is a **boundary of ownership** (who may change which layer), not a grab-bag of permissions.

---

## Four core roles (condensed)

| Role | Responsibility |
|------|------------------|
| **Business** | Defines scoring and policy intent; owns **DMN** / product rules in collaboration with engineering. |
| **Engineer** | Implements `backend/`, `worker/`, tests; wires APIs and workers; does **not** silently bypass process or audit. |
| **Platform** | **Pulumi / GKE / networking / IAM**; split stacks, releases, and operational safety of the runtime. |
| **Operator** | Day-2: monitors workflows, Camunda, cluster health; incident response; no unapproved prod changes. |

These four map to the more granular **11 functional roles × 6 operational domains** in production governance — see [gcp-saas-access-matrix-11x6](/en/gcp-saas-access-matrix-11x6) and [team 11×6](/en/team-11x6-organization). **U1–U6** in the architecture doc is an **indicative** mapping to components (cloud, ops, ML, data, quality, audit).

---

## What each layer “owns”

- **DMN** — business rule tables and their change control.
- **Camunda (BPMN)** — which steps run, in what order, and where humans intervene.
- **Services & workers** — how integrations and scoring calls are **implemented** (not where policy “lives” in principle).
- **Infrastructure** — how environments are **defined** and **reproduced** (Pulumi, not click-ops in prod).

---

## Principle

> A role is not only a permission bundle. It is a **contract** about which part of the system you may change, under which review and audit rules.

**Next:** [architecture](/en/architecture) → [plan](/en/plan) → [main entry](/en/main).

> [Русский (полный)](/ru/simplified) · [Polski (pełny)](/pl/simplified)
