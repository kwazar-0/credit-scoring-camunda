# Pipelines

Reference workflow files for CI/CD automation.

- `ci-apps.yaml` — lint, tests, build, scan, publish artifact metadata.
- `ci-infra.yaml` — Pulumi preview and policy checks.
- `cd-dev.yaml` — auto deployment to development environment.
- `cd-stage.yaml` — gated promotion with integration validation.
- `cd-prod.yaml` — approved progressive rollout with rollback hooks.
