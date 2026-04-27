# Operations: Incidents and Recovery

## Типовые сбои

- Неуспешный rollout после релиза.
- Рост backlog/retry storm у worker.
- Spike инцидентов Camunda по process tasks.
- Деградация GKE runtime (node pressure, restarts).

## Поток реагирования

1. Классифицировать severity.
2. Выполнить triage и containment по runbook.
3. Принять решение mitigation vs rollback.
4. Восстановить сервис и проверить критический путь.
5. Зафиксировать пост-инцидентные действия.

## Принцип восстановления

Быстрое возвращение к last stable release с полным audit trail.

## Навигация

- Entry page: [main](/ru/main)
- Deployment: [ops/deployment](/ru/ops/deployment)
- CI/CD: [ops/cicd](/ru/ops/cicd)
- Observability: [ops/observability](/ru/ops/observability)
