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
- Статус: проверен на этом репозитории (цепочка build -> push -> deploy в GKE рабочая).
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
- `exec: executable gke-gcloud-auth-plugin not found`: установите плагин в runner перед `kubectl` шагами (в manual workflow уже добавлено).

## Проверка доступа и CI по этапам (bash + expected output)

### Этап 1. WIF / Service Account (GCP)

```bash
gcloud iam workload-identity-pools describe github-actions-pool \
  --location=global \
  --project=uplifted-env-494515-m5

gcloud iam workload-identity-pools providers describe github-provider \
  --location=global \
  --workload-identity-pool=github-actions-pool \
  --project=uplifted-env-494515-m5
```

Ожидаемо:

```text
state: ACTIVE
name: projects/.../workloadIdentityPools/github-actions-pool
...
state: ACTIVE
name: projects/.../providers/github-provider
```

### Этап 2. IAM роли SA в проекте кластера

```bash
gcloud projects get-iam-policy credit-scoring-camunda-project \
  --flatten="bindings[].members" \
  --filter="bindings.members:serviceAccount:github-actions-ci@uplifted-env-494515-m5.iam.gserviceaccount.com" \
  --format="table(bindings.role)"
```

Ожидаемо минимум:

```text
ROLE
roles/artifactregistry.writer
roles/container.developer
```

### Этап 3. Локальный Artifact Registry push/pull

```bash
docker tag hello-world:latest europe-central2-docker.pkg.dev/credit-scoring-camunda-project/hbg-gke-docker/push-test:local-1
docker push europe-central2-docker.pkg.dev/credit-scoring-camunda-project/hbg-gke-docker/push-test:local-1
docker pull europe-central2-docker.pkg.dev/credit-scoring-camunda-project/hbg-gke-docker/push-test:local-1
```

Ожидаемо:

```text
...: Pushed
local-1: digest: sha256:... size: ...
Status: Image is up to date for ...
```

### Этап 4. Проверка кластера в target project

```bash
gcloud container clusters list --project=credit-scoring-camunda-project --region=europe-central2
```

Ожидаемо:

```text
NAME     LOCATION         ...  STATUS
hbg-gke  europe-central2  ...  RUNNING
```

### Этап 5. Manual workflow (GitHub Actions)

Параметры запуска:

```text
service=worker
gcp_project_id=credit-scoring-camunda-project
gcp_region=europe-central2
gke_cluster=hbg-gke
gke_namespace=hbg
artifact_repository=hbg-gke-docker
```

Ключевые шаги и expected output:

```text
Authenticate to Google Cloud (WIF) -> success
Build Docker image -> success
Push Docker image -> digest sha256:...
Configure kubectl context -> kubeconfig entry generated for hbg-gke
Wait rollout -> deployment "credit-worker" successfully rolled out
Post-deploy smoke -> kubectl get pods / logs without fatal errors
```

## Навигация

- Entry page: [main](/ru/main)
- Camunda deploy + Modeler: [camunda-gke-deploy-modeler](/ru/camunda-gke-deploy-modeler)
- Deployment: [ops/deployment](/ru/ops/deployment)
- Observability: [ops/observability](/ru/ops/observability)
- Incidents: [ops/incidents](/ru/ops/incidents)
