---
title: "DMN decision model"
description: "Role of DMN in deterministic credit decisioning."
---

# DMN decision model

This page defines where **DMN** fits in the architecture and what must remain deterministic in credit decisioning.

## What DMN owns

- formalized business rules;
- deterministic decision tables;
- versioned policy logic with clear change history.

## What DMN does not own

- orchestration sequencing (BPMN responsibility);
- infrastructure behavior (Pulumi/GCP responsibility);
- transport/integration code (services/workers responsibility).

## Design objective

DMN reduces ambiguity and prevents hidden policy logic from spreading into runtime code paths that are harder to audit.

## Change governance

DMN changes must follow the same controlled lifecycle as code:

1. role-scoped ownership;
2. review and approval;
3. process compatibility check;
4. observable effect in runtime.

## Related docs

- [Architecture](/en/architecture)
- [Camunda process flow](/en/process-flow-camunda)
- [System philosophy & governance](/en/system-philosophy-governance)
