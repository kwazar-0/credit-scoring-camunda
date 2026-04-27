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

## GitHub + Registry setup (ручной тестовый CD)

Этот раздел про **GitHub Environment**, **WIF secrets** и проверку **Artifact Registry**. Camunda runtime и Modeler остаются в [camunda-gke-deploy-modeler](/ru/camunda-gke-deploy-modeler).

### GitHub Environment

- Создайте environment: `GCP_WORKLOAD`.
- Добавьте secrets:
  - `GCP_WORKLOAD_IDENTITY_PROVIDER`
  - `GCP_GITHUB_ACTIONS_SA_EMAIL`

### Ручной workflow

- Файл: `.github/workflows/manual-build-push-deploy-gke.yml`
- Запуск: `workflow_dispatch`
- Типичный первый прогон:
  - `service=worker`
  - `gcp_project_id=credit-scoring-camunda-project`
  - `gcp_region=europe-central2`
  - `gke_cluster=hbg-gke`
  - `gke_namespace=hbg`
  - `artifact_repository=hbg-gke-docker`

### Локальный smoke check Artifact Registry

```bash
gcloud config set project credit-scoring-camunda-project
gcloud auth configure-docker europe-central2-docker.pkg.dev --quiet
docker pull hello-world:latest
docker tag hello-world:latest europe-central2-docker.pkg.dev/credit-scoring-camunda-project/hbg-gke-docker/push-test:local-1
docker push europe-central2-docker.pkg.dev/credit-scoring-camunda-project/hbg-gke-docker/push-test:local-1
docker pull europe-central2-docker.pkg.dev/credit-scoring-camunda-project/hbg-gke-docker/push-test:local-1
```

Ожидаемые строки:

```text
gcloud credential helpers already registered correctly.
...
local-1: digest: sha256:... size: ...
```

### Частые ошибки и быстрые фиксы

- `Not found: ... clusters/hbg-gke` в workflow: несовпадение project/cluster. Для этого кластера используйте `gcp_project_id=credit-scoring-camunda-project`.
- `artifactregistry.repositories.uploadArtifacts denied`: выдайте GitHub SA роль `roles/artifactregistry.writer` в **целевом** проекте.
- `Repository "... not found"`: создайте Docker repository (например `hbg-gke-docker`) в `europe-central2`.

## Навигация

- Entry page: [main](/ru/main)
- Camunda deploy + Modeler: [camunda-gke-deploy-modeler](/ru/camunda-gke-deploy-modeler)
- Deployment: [ops/deployment](/ru/ops/deployment)
- Observability: [ops/observability](/ru/ops/observability)
- Incidents: [ops/incidents](/ru/ops/incidents)
