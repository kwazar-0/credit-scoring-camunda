# Вход в систему (main)

## 1. Что это за система

HBG Credit Scoring - это платформа кредитного решения на Camunda для регулируемой среды: BPMN управляет процессом, DMN хранит детерминированные правила, а инфраструктура управляется как код для аудируемых и воспроизводимых релизов.

## 2. Как это работает в проде (DevOps flow)

```text
PR -> CI (build + test + scan) -> публикация артефакта -> deploy в dev
   -> promotion в stage (approval + интеграционные проверки)
   -> promotion в prod (approval + контролируемый rollout)
   -> runtime monitoring (логи + метрики + алерты)
   -> incident response / rollback на last stable release
```

### Модель деплоя и восстановления

- Изменения infra применяются Pulumi-стеками по цепочке: core -> data -> runtime.
- Workload в GKE деплоится из immutable image и versioned manifests/charts.
- Обновление Camunda включает versioned BPMN/DMN, чтобы не было дрейфа процесса и правил.
- Promotion между средами идет одним и тем же artifact digest.
- При провале health-check или SLO breach выполняется rollback на последнюю стабильную версию.

## 3. Ключевые компоненты

- Camunda и Zeebe для оркестрации и состояния workflow.
- DMN-таблицы для детерминированной и проверяемой логики скоринга.
- API и workers для интеграций и выполнения process tasks.
- GCP runtime (GKE, Cloud Storage, Artifact Registry, IAM) как прод-платформа.
- Pulumi multi-stack IaC (core/data/runtime) для контролируемых infra-изменений.

## Operations (DevOps)

- Deployment model: [ops/deployment](/ru/ops/deployment)
- CI/CD controls: [ops/cicd](/ru/ops/cicd)
- Observability model: [ops/observability](/ru/ops/observability)
- Failure and recovery flow: [ops/incidents](/ru/ops/incidents)
