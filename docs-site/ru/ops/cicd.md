# Operations: CI/CD

## Жизненный цикл pipeline

```text
Build -> Test -> Security Scan -> Package -> Deploy -> Promote
```

## Контроли

- Build once, promote same artifact digest.
- CI gates: lint, тесты, security/dependency checks.
- CD gates: approvals, проверки среды и rollout health.
- Для аудита сохраняются commit, digest, approvals и результат деплоя.

## Promotion path

`dev` -> `stage` -> `prod` без прямого обхода.

## Навигация

- Entry page: [main](/ru/main)
- Deployment: [ops/deployment](/ru/ops/deployment)
- Observability: [ops/observability](/ru/ops/observability)
- Incidents: [ops/incidents](/ru/ops/incidents)
