# Deployment Lifecycle

## Infra

Pulumi lifecycle выполняется по слоям: `core` -> `data` -> `runtime`.

## Apps

- Один build, одинаковый артефакт во всех средах.
- Camunda и BPMN/DMN релизы версионируются совместно.

## Runtime

GKE rollout завершается только после health/SLO проверки.
