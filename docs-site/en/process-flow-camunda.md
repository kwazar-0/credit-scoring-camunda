---
title: "Camunda process flow"
description: "How credit decision flow is orchestrated in Camunda BPMN."
---

# Camunda process flow

This page explains **how process orchestration works** in the platform and how BPMN controls state transitions, human interventions, and execution handoffs.

## Flow model (simplified)

1. API receives a credit request.
2. Camunda starts or resumes a BPMN process instance.
3. DMN/service tasks evaluate deterministic and contextual conditions.
4. Workers execute integration and scoring jobs.
5. Human task is created when confidence/policy thresholds require review.
6. Process completes with an auditable decision trail.

## Why BPMN is used here

- explicit process stages;
- visible control points for policy;
- clear handoff between automation and human review;
- full runtime traceability for incidents and audit.

## Boundaries

- BPMN controls **process order and state**;
- DMN controls **deterministic decision logic**;
- workers/services control **execution and integrations**.

Do not move decision policy into infrastructure or ad-hoc worker logic.

## Related docs

- [Architecture](/en/architecture)
- [DMN decision model](/en/decision-model-dmn)
- [INFRA-IMPLEMENTATION](/en/INFRA-IMPLEMENTATION)
