# Pulumi: стек `gke-infra` (GKE, Cloud SQL, GCS, Artifact Registry)

**Назначение:** каталог [`infra/pulumi/gke-infra/`](https://github.com/kwazar-0/credit-scoring-camunda/tree/develop/infra/pulumi/gke-infra) — **отдельный** Pulumi-проект (свой `Pulumi.yaml`), не путать с основым [`infra/pulumi/`](https://github.com/kwazar-0/credit-scoring-camunda/tree/develop/infra/pulumi). Код [__main__.py](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/infra/pulumi/gke-infra/__main__.py) создаёт **VPC** (с PSA), **Artifact Registry**, бакет **GCS** с **версионированием**, **приватный** **Cloud SQL (PostgreSQL 15)** без публичного IPv4 и **региональный** кластер **GKE** в **europe-central2** (по умолчанию; `gcp:region`). **Каноничный** продуктовый IaC в репозитории — **`infra/pulumi/`** (по умолчанию **europe-central2**, префиксы `hbg-*`). **Не** накатывайте оба стека в один GCP project без согласования имён и state.

**English:** [infra-pulumi-gke-sandbox (EN) →](/en/infra-pulumi-gke-sandbox) · в репо: [`README.md`](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/infra/pulumi/gke-infra/README.md).

---

## 1. Что создаёт программа (по `__main__.py`)

| Ресурс Pulumi | Google Cloud | Суть | Назначение |
|---------------|--------------|------|------------|
| `Network`, `Subnetwork` | VPC, подсеть, secondary ranges | `10.40.0.0/20`, pods/services | GKE, маршрутизация, PSA. |
| `GlobalAddress`, `Connection` (servicenetworking) | Private Service Access | Диапазон /16 | Приватный IP **Cloud SQL**. |
| `Repository` (Artifact Registry) | Docker | `cs-sandbox-docker`, регион = stack | Образы. |
| `Bucket` (GCS) | Бакет | Имя с суффиксом, `location=region`, versioning | Данные. |
| `DatabaseInstance` | Cloud SQL | `ipv4_enabled=False`, private network, `db-f1-micro` | **Без** публичного IPv4. |
| `Cluster`, `NodePool` | GKE | `cs-sandbox-cluster`, 1×`e2-standard-4`, `oauth_scopes=[]`, **Workload Identity** | Рабочие нагрузки. |

**Экспорты стека:** `gcp_project`, `gcp_region`, `connect_cmd`, `bucket_url`, `artifact_registry_url`, `cloud_sql_private_ip`, `cloud_sql_connection_name` (публичный IP БД **не** экспортируется).

---

## 2. Регионы и внимание

- GKE **региональный**, Cloud SQL/AR/GCS в том же **регионе**; по умолчанию **europe-central2** (политика репо).
- Префикс имён в коде: **`cs-sandbox-*`**, не `hbg-*` — это отдельный Pulumi-стек.
- В `Pulumi.dev.yaml` укажите реальный `gcp:project`.

---

## 3. Предпосылки

- Pulumi CLI, `gcloud`, `kubectl`, Docker, `helm` (по необходимости), Python 3.10+.
- API: включение через ресурсы `projects.Service` в `__main__.py` при необходимости дополнить скриптом [`scripts/gcp-enable-apis-iam.sh`](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/scripts/gcp-enable-apis-iam.sh).
- `gcloud auth application-default login` (без коммита JSON-ключей).
- `cd infra/pulumi/gke-infra && python3 -m venv venv && . venv/bin/activate && pip install -r requirements.txt`.

---

## 4. Первый `pulumi up`

```bash
cd infra/pulumi/gke-infra
python3 -m venv venv && . venv/bin/activate
pip install -r requirements.txt
pulumi stack init dev
pulumi config set gcp:project YOUR_GCP_PROJECT_ID
pulumi config set gcp:region europe-central2
pulumi preview
pulumi up
```

**State:** `pulumi login` (SaaS), `pulumi login --local` или `pulumi login gs://BUCKET` (бакет и IAM — отдельно).

---

## 5. После развёртывания

### kubectl

```bash
gcloud container clusters get-credentials cs-sandbox-cluster --region europe-central2
```

(Точная команда — в `pulumi stack output connect_cmd`.)

### Artifact Registry

Формат: `europe-central2-docker.pkg.dev/PROJECT_ID/cs-sandbox-docker/IMAGE:TAG`

```bash
gcloud auth configure-docker europe-central2-docker.pkg.dev
docker tag my-app:latest europe-central2-docker.pkg.dev/PROJECT_ID/cs-sandbox-docker/my-app:1.0.0
docker push europe-central2-docker.pkg.dev/PROJECT_ID/cs-sandbox-docker/my-app:1.0.0
```

### Cloud SQL

Только **приватный** IP. Для доступа с нод/подов — proxy/коннектор, см. `cloud_sql_connection_name` и [документацию](https://cloud.google.com/sql/docs/postgres/connect-kubernetes-engine). Пароли и пользователи в этом `__main__.py` **не** задаются.

### GCS

Имя бакета уникальное (random suffix). Версии включены.

---

## 6. Эксплуатация и удаление

- Правки в `__main__.py` → `pulumi preview` / `up`.
- `pulumi destroy -y` — проверьте **Disks**, **GCS** и **Cloud SQL** на «хвосты».

---

## 7. Camunda 8 (Helm) — пример

Кластер небольшой (1 нода **e2-standard-4**). Память под **Elasticsearch** и остальное планируйте с запасом. `ZEEBE_ADDRESS` для `worker/` — на gateway в кластере, см. [`k8s/hbg/`](https://github.com/kwazar-0/credit-scoring-camunda/tree/develop/k8s/hbg).

---

## 8. Vertex / GCP API с подов

`oauth_scopes` у нод **пустые** — к Vertex и другим API лучше идти через **Workload Identity** / GSA, не через широкий `cloud-platform` на нодах. См. [infra-pulumi-iac](infra-pulumi-iac.md) и [матрицу](gcp-saas-access-matrix-11x6.md).

---

## 9. Конфликт с `infra/pulumi/`

| | `gke-infra` | Основой `infra/pulumi/` |
|---|------------|-------------------------|
| Регион (по умолчанию) | `europe-central2` | `europe-central2` |
| Имена | `cs-sandbox-*` | например `hbg-*` |
| Данные | GCS + приватный SQL, без BQ в этом файле | GCS + BQ и т.д. по ролям стека |

Разумно: **отдельные** GCP project или осознанное разведение **VPC/PSA/SQL**, чтобы не пересекать ресурсы.

---

## 10. Устранение неполадок и безопасность

- Квоты: SSD, IP, GKE. Медленное создание **Cloud SQL** и выделение **PSA**.
- Публичного IP у SQL **нет**; доступ из интернета к БД — только с явной схемой (VPN, bastion, и т.д.).
- Ключи SA не хранить в git; WIF, Secret Manager, политика — см. [prompt](prompt.md) §9.

*Текст согласован с `infra/pulumi/gke-infra/__main__.py` на момент публикации; при изменениях в коде сверяйтесь с репозиторием.*
