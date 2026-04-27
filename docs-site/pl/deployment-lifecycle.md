# Deployment Lifecycle

## Infra

Pulumi lifecycle przebiega warstwowo: `core` -> `data` -> `runtime`.

## Apps

- Jeden build, ten sam artefakt promowany przez środowiska.
- Wersje Camunda oraz BPMN/DMN są wydawane razem.

## Runtime

Rollout na GKE kończy się dopiero po health/SLO verification.
