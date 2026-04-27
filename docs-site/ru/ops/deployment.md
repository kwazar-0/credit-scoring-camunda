# Operations: Deployment

## Сквозная модель деплоя

1. Pulumi применяет infra-стеки по порядку: `core` -> `data` -> `runtime`.
2. Workload в GKE деплоится из immutable image digest и versioned manifests/charts.
3. Camunda обновляется вместе с согласованной версией BPMN/DMN.
4. После деплоя выполняются health-check и workflow smoke tests.

## Promotion

- `dev`: автоматом после успешного CI.
- `stage`: approval gate + интеграционные проверки.
- `prod`: approval + контролируемый rollout + runtime проверки.

## Rollback

- App rollback: возврат на предыдущий стабильный digest.
- Camunda rollback: возврат к последнему согласованному BPMN/DMN пакету.
- Infra rollback/fix: контролируемая корректировка через Pulumi.

## Навигация

- Camunda в GKE + Ubuntu Modeler: [camunda-gke-deploy-modeler](/ru/camunda-gke-deploy-modeler)
- Entry page: [main](/ru/main)
- CI/CD controls: [ops/cicd](/ru/ops/cicd)
- Observability: [ops/observability](/ru/ops/observability)
- Incidents: [ops/incidents](/ru/ops/incidents)
