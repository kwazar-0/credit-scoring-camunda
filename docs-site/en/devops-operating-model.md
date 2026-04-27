# DevOps Operating Model

This project is operated as a regulated platform with controlled release and runtime governance.

## CI/CD Control

- Pull request checks enforce lint, tests, scans, and policy checks.
- Releases produce immutable artifacts (image digest + metadata).
- Promotions follow `dev` -> `stage` -> `prod` with approval gates.

## Deployment Control

- Infrastructure is managed by Pulumi stack layers: core, data, runtime.
- Runtime workloads are deployed to GKE using versioned manifests/charts.
- Camunda BPMN/DMN assets are versioned and released with runtime changes.

## Runtime Operations

- Centralized logging, service and workflow metrics, SLO-based alerting.
- Runbooks define first response and rollback criteria.
- Recovery procedures cover backup/restore and last-known-good rollback.
