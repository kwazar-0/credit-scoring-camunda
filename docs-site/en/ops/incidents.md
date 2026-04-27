# Operations: Incidents and Recovery

## Failure scenarios

- Failed rollout after deployment.
- Worker backlog growth or retry storm.
- Camunda incident spike on process tasks.
- GKE runtime degradation (node pressure/restarts).

## Response flow

1. Detect and classify incident severity.
2. Triage using runbook and containment actions.
3. Decide mitigation vs rollback based on impact.
4. Recover service and validate critical paths.
5. Record post-incident actions and owners.

## Recovery principles

- Restore platform quickly with last stable release.
- Preserve audit trail of all incident actions.

## Navigation

- Entry page: [main](/en/main)
- Deployment: [ops/deployment](/en/ops/deployment)
- CI/CD: [ops/cicd](/en/ops/cicd)
- Observability: [ops/observability](/en/ops/observability)
