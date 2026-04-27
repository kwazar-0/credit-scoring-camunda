# Operations: CI/CD

## Lifecycle pipeline

```text
Build -> Test -> Security Scan -> Package -> Deploy -> Promote
```

## Kontrole

- Build once, promote same artifact digest.
- CI gates: lint, testy, security/dependency checks.
- CD gates: approvals, environment checks, rollout health.
- Dowody audytowe: commit, digest, approvals i wynik wdrozenia.

## Promotion path

`dev` -> `stage` -> `prod` bez pomijania etapow.

## Navigation

- Entry page: [main](/pl/main)
- Deployment: [ops/deployment](/pl/ops/deployment)
- Observability: [ops/observability](/pl/ops/observability)
- Incidents: [ops/incidents](/pl/ops/incidents)
