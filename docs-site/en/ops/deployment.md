# Operations: Deployment

## End-to-end deployment model

1. Infrastructure provisioning with Pulumi stack sequence: `core` -> `data` -> `runtime`.
2. Runtime deployment to GKE with immutable image digests and versioned manifests/charts.
3. Camunda rollout with matching BPMN/DMN package versions.
4. Post-deploy verification using health checks and workflow smoke tests.

## Promotion strategy

- `dev`: automatic deployment after successful CI on main.
- `stage`: approval gate plus integration/regression checks.
- `prod`: approval + guarded rollout (canary/phased) + runtime checks.

## Rollback

- Application rollback: redeploy previous stable image digest.
- Camunda rollback: revert to last approved BPMN/DMN package version.
- Infra rollback: controlled Pulumi corrective change or safe rollback where possible.

## Navigation

- Camunda on GKE + Ubuntu Modeler: [camunda-gke-deploy-modeler](/en/camunda-gke-deploy-modeler)
- Entry page: [main](/en/main)
- CI/CD controls: [ops/cicd](/en/ops/cicd)
- Observability: [ops/observability](/en/ops/observability)
- Incidents: [ops/incidents](/en/ops/incidents)
