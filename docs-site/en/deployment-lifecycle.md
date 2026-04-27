# Deployment Lifecycle

## Infrastructure Lifecycle

Pulumi changes are applied by layer:

1. `infra/core`
2. `infra/data`
3. `infra/runtime`

Each environment has dedicated configuration in `infra/environments`.

## Application Lifecycle

- Build once in CI.
- Deploy same artifact to each environment via promotion.
- Track Camunda deployment version together with BPMN/DMN package versions.

## GKE Runtime Model

- Workloads run with health checks and autoscaling policies.
- Rollouts are progressive (canary or phased strategy).
- Deployment completion requires runtime health verification.
