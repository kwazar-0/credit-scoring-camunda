# Infrastructure

Краткий runbook по каталогу `infra/`. Каноничное описание IaC и split-стеков — в VitePress: [`docs-site/ru/infra-pulumi-iac.md`](../docs-site/ru/infra-pulumi-iac.md). Дорожная карта внедрения: [`docs-site/ru/INFRA-IMPLEMENTATION.md`](../docs-site/ru/INFRA-IMPLEMENTATION.md).

**Код IaC:** [`pulumi/`](pulumi/) (основной проект), опционально [`pulumi/gke-infra/`](pulumi/gke-infra/) (песочница). Исторические материалы — только в `doc/_archive/`, не в сайте.

---

## Pet-project: зафиксированные значения

| Параметр | Значение |
|----------|----------|
| GCP project | `credit-scoring-camunda-project` |
| Регион | `europe-central2` |
| Pulumi stack (первый шаг) | `dev` |
| Bucket для state (пример) | `gs://credit-scoring-camunda-project-pulumi-state-euc2` |

Имя bucket должно быть **глобально уникальным**; если занято — добавьте суффикс, например `-01`.

---

## Bootstrap GCP «с нуля» до первого `pulumi up` (`infra-core`)

1. **Billing account (Console)**  
   <https://console.cloud.google.com/billing> — создать аккаунт, привязать платёжный метод. Должен быть **Active** и `open: true` (см. проверки ниже).

2. **Проект GCP**
   ```bash
   gcloud projects create credit-scoring-camunda-project --name="Credit Scoring Camunda Project"
   ```

3. **Привязка billing к проекту**
   ```bash
   gcloud billing accounts list
   gcloud billing projects link credit-scoring-camunda-project --billing-account=<OPEN_BILLING_ACCOUNT_ID>
   gcloud billing projects describe credit-scoring-camunda-project
   gcloud billing accounts describe <OPEN_BILLING_ACCOUNT_ID> --format="yaml(name,open,displayName)"
   ```
   Ожидаемо: `billingEnabled: true` и `open: true`.

4. **Вход в CLI и контекст проекта**
   ```bash
   gcloud auth login
   gcloud auth application-default login
   # при ошибке consent / scope cloud-platform или проблемах встроенного браузера:
   # gcloud auth application-default login --no-browser --scopes=https://www.googleapis.com/auth/cloud-platform
   gcloud config set project credit-scoring-camunda-project
   gcloud auth application-default set-quota-project credit-scoring-camunda-project
   gcloud auth list
   gcloud config get-value project
   ```

5. **Минимальные IAM для pet-аккаунта (часто нужно до `set-quota-project` и Pulumi)**
   ```bash
   gcloud projects add-iam-policy-binding credit-scoring-camunda-project \
     --member="user:$(gcloud config get-value account)" \
     --role="roles/serviceusage.serviceUsageConsumer"

   # Для `pulumi up` с VPC нужен create сети, не только просмотр регионов:
   gcloud projects add-iam-policy-binding credit-scoring-camunda-project \
     --member="user:$(gcloud config get-value account)" \
     --role="roles/compute.networkAdmin"
   ```
   Затем при необходимости повторите:
   ```bash
   gcloud auth application-default login
   gcloud auth application-default set-quota-project credit-scoring-camunda-project
   ```

6. **Включить API**
   ```bash
   cd /data/projects/Credit-Scoring-V2
   ./scripts/gcp-enable-apis-iam.sh credit-scoring-camunda-project
   ```

7. **Bucket для Pulumi state**
   ```bash
   gcloud storage buckets create gs://credit-scoring-camunda-project-pulumi-state-euc2 \
     --project=credit-scoring-camunda-project \
     --location=europe-central2
   gcloud storage buckets update gs://credit-scoring-camunda-project-pulumi-state-euc2 --versioning
   gcloud storage buckets add-iam-policy-binding gs://credit-scoring-camunda-project-pulumi-state-euc2 \
     --member="user:$(gcloud config get-value account)" \
     --role="roles/storage.objectAdmin"
   ```

8. **Pulumi: backend и `infra-core`**
   ```bash
   cd /data/projects/Credit-Scoring-V2/infra/pulumi
   pulumi logout
   pulumi login gs://credit-scoring-camunda-project-pulumi-state-euc2
   export PULUMI_CONFIG_PASSPHRASE='<STRONG_PASSPHRASE>'

   pulumi stack select dev || pulumi stack init dev
   pulumi config set gcp:project credit-scoring-camunda-project
   pulumi config set credit-scoring:region europe-central2
   pulumi config set credit-scoring:stackRole infra-core

   pulumi preview
   pulumi up
   ```

9. **Проверка после `infra-core`**
   ```bash
   gcloud compute regions list --project=credit-scoring-camunda-project --limit=3
   gcloud compute networks list --project=credit-scoring-camunda-project
   pulumi stack output
   ```

10. **Budget alerts (рекомендуется)**  
    Console: **Billing → Budgets & alerts**. Для проекта `credit-scoring-camunda-project`, например лимиты `10 USD` и `50 USD` с порогами 50 % / 90 % / 100 %.

---

## Split-стеки: step-by-step (`infra-core` → `infra-data` → `infra-runtime`)

Один каталог `infra/pulumi/` и один **Pulumi project** (имя в [`pulumi/Pulumi.yaml`](pulumi/Pulumi.yaml): **`credit-scoring-infra`**). Роль выбирается конфигом `credit-scoring:stackRole`. Для split **не смешивайте** разные роли в одном стеке — заведите **отдельный stack на каждую роль** (один и тот же GCS backend для state).

### Имена стеков (пример для pet)

| Stack   | `stackRole`     | Назначение                          |
|---------|-----------------|-------------------------------------|
| `dev`   | `infra-core`    | VPC, subnet, PSA (уже в bootstrap)  |
| `dev-data`  | `infra-data`  | GCS, BQ, опционально Cloud SQL      |
| `dev-runtime` | `infra-runtime` | GKE, Artifact Registry, Vertex WI |

### Шаг A — убедиться, что core готов

```bash
cd /data/projects/Credit-Scoring-V2/infra/pulumi
pulumi stack select dev
pulumi config get credit-scoring:stackRole   # ожидается infra-core
pulumi stack output
gcloud compute networks list --project=credit-scoring-camunda-project
```

### Шаг B — полное имя стека для `credit-scoring:coreStackRef`

`pulumi stack ls` и `pulumi stack ls --json` могут показывать только короткое имя (`dev`). Для **StackReference** в этом репозитории при backend в **GCS** используйте полную форму:

```text
organization/<pulumi-project>/<stack>
```

где `<pulumi-project>` = **`credit-scoring-infra`** (из `Pulumi.yaml`), `<stack>` = имя стека с core (часто **`dev`**).

**Итоговая строка для этого проекта:**

`organization/credit-scoring-infra/dev`

Проверка без `pulumi up` на data:

```bash
pulumi stack output --stack organization/credit-scoring-infra/dev
```

Должны отобразиться те же outputs, что у `dev` (`network_self_link`, `stack_role: infra-core`, …).

Если выполнить только `credit-scoring-infra/dev` **без** префикса `organization/`, CLI может ответить: `organization name must be 'organization'` — это нормально: значит нужна именно трёхсегментная форма с **`organization`**.

### Шаг C — стек `dev-data` (`infra-data`)

```bash
pulumi stack init dev-data
pulumi stack select dev-data

pulumi config set gcp:project credit-scoring-camunda-project
pulumi config set credit-scoring:region europe-central2
pulumi config set credit-scoring:stackRole infra-data
pulumi config set credit-scoring:coreStackRef organization/credit-scoring-infra/dev

# Обязательная проверка: на этом стеке должна быть роль data, не runtime.
pulumi config get credit-scoring:stackRole   # ожидается: infra-data
# если видите infra-runtime — верните: pulumi config set credit-scoring:stackRole infra-data

pulumi config
pulumi preview
pulumi up
```

Если в `Diagnostics` фигурирует **`runtime_stack.py`** или в diff `stack_role … => infra-runtime`, вы случайно подняли **runtime** на стеке `dev-data` — исправьте `stackRole` как выше и снова `pulumi preview`.

Сначала поднимайте **без** Cloud SQL (не задавайте `createCloudSql`). Когда GCS/BQ стабильны, для SQL:

```bash
pulumi config set credit-scoring:createCloudSql true
pulumi config set credit-scoring:cloudSqlInstanceName postgres-instance
pulumi preview
pulumi up
```

(имя инстанса — своё; см. [`pulumi/Pulumi.dev.yaml.example`](pulumi/Pulumi.dev.yaml.example)).

### Шаг D — стек `dev-runtime` (`infra-runtime`)

```bash
pulumi stack init dev-runtime
pulumi stack select dev-runtime

pulumi config set gcp:project credit-scoring-camunda-project
pulumi config set credit-scoring:region europe-central2
pulumi config set credit-scoring:stackRole infra-runtime
pulumi config set credit-scoring:coreStackRef organization/credit-scoring-infra/dev

pulumi config get credit-scoring:stackRole   # ожидается: infra-runtime

pulumi preview
pulumi up
```

После успешного `up`:

```bash
pulumi stack output gcloud_get_credentials
```

Скопируйте выведенную команду `gcloud container clusters get-credentials ...` и выполните её для `kubectl`.

---

## Отладка (локально и GKE)

- **Compose + DEBUG:** из корня репозитория  
  `./infra/scripts/local-compose-debug.sh up --build`  
  (эквивалентно: `docker compose -f docker-compose.yml -f infra/docker-compose.debug.yml up`).

- **Kubeconfig для GKE:**  
  `pulumi stack output gcloud_get_credentials` (после `infra-runtime`) или  
  `GCP_PROJECT=credit-scoring-camunda-project ./infra/scripts/gke-credentials.sh`  
  (по умолчанию кластер `hbg-gke`, регион `europe-central2`).

- **Port-forward backend/UI:** `./infra/scripts/k8s-port-forward-hbg.sh` (namespace `hbg`, сервисы из `k8s/hbg/`).

Краткая политика/handoff: [`prompt.md`](prompt.md).

---

## Частые ошибки

| Симптом | Что сделать |
|---------|-------------|
| `BILLING_DISABLED` при создании VPC | Billing account закрыт (`open: false`) или не привязан к проекту; подождать пропагацию после `link`. |
| `serviceusage.services.use` при `set-quota-project` | Выдать `roles/serviceusage.serviceUsageConsumer` на проект (см. шаг 5 bootstrap). |
| `storage.objects.list` при `pulumi login gs://...` | Выдать на bucket `roles/storage.objectAdmin` текущему пользователю (см. шаг 7). |
| `compute.networks.create` / `forbidden` при `core_vpc` | Нужна роль с созданием сетей, например `roles/compute.networkAdmin` или `roles/compute.admin` (см. шаг 5). |
| `compute.regions.list` / предупреждения Pulumi про регионы | Часто достаточно `roles/compute.networkAdmin` или `roles/compute.viewer` + см. строку выше для реального `up`. |
| Pulumi просит токен Pulumi Cloud | `pulumi logout` и снова `pulumi login gs://...`. |
| ADC: `cloud-platform scope is required but not consented` / странный OAuth в браузере | `gcloud auth application-default login --no-browser --scopes=https://www.googleapis.com/auth/cloud-platform` (удобно открыть ссылку в Chrome). |
| `coreStackRef`: `organization name must be 'organization'` | Используйте полное имя: `organization/credit-scoring-infra/<stack-core>`, проверка: `pulumi stack output --stack organization/credit-scoring-infra/dev`. |
| `AttributeError: module 'pulumi_gcp' has no attribute 'project'` (Vertex / runtime) | В коде должен быть `gcp.projects.IAMMember`, не `gcp.project.IAMMember` (pulumi-gcp 7.x). Обновите репозиторий / `vertex_gcp.py`. |

Полный сброс gcloud-сессий (`gcloud auth revoke --all`) используйте только осознанно — он отвязывает все учётные записи на машине.
