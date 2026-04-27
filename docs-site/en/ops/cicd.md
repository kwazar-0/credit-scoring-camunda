# Operations: CI/CD

## Pipeline lifecycle

```text
Build -> Test -> Security Scan -> Package -> Deploy -> Promote
```

## Controls

- Build once and promote same artifact digest through environments.
- CI gates: lint, unit/integration tests, security and dependency checks.
- CD gates: approvals, environment checks, and rollout health validation.
- Release evidence includes commit, artifact digest, approvals, and deployment result.

## Promotion

- No direct prod deployment from feature branches.
- Promotion path: `dev` -> `stage` -> `prod`.

## Navigation

- Entry page: [main](/en/main)
- Deployment: [ops/deployment](/en/ops/deployment)
- Observability: [ops/observability](/en/ops/observability)
- Incidents: [ops/incidents](/en/ops/incidents)
