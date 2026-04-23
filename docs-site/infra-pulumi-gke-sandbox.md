# Pulumi: стек `gke-infra` (GKE, Cloud SQL, GCS, Artifact Registry)

**Назначение:** каталог [`infra/pulumi/gke-infra/`](https://github.com/OlehKondratow/credit-scoring-camunda/tree/develop/infra/pulumi/gke-infra) — **отдельный** Pulumi-проект (свой `Pulumi.yaml`), не путать с основым [`infra/pulumi/`](https://github.com/OlehKondratow/credit-scoring-camunda/tree/develop/infra/pulumi). Код [__main__.py](https://github.com/OlehKondratow/credit-scoring-camunda/blob/develop/infra/pulumi/gke-infra/__main__.py) создаёт **Artifact Registry**, бакет **GCS**, **Cloud SQL (PostgreSQL 15)** и кластер **GKE** с пулом нод в **europe-west1** / **europe-west1-b**. Это песочница «всё в одном». **Каноничный** продуктовый IaC в репозитории — **`infra/pulumi/`** (по умолчанию **europe-central2**, префиксы `hbg-*`). **Не** накатывайте оба стека в один GCP project без согласования имён и state.

**English:** [infra-pulumi-gke-sandbox (EN) →](/en/infra-pulumi-gke-sandbox) · копия в репо: [`manual.md` / `manual.en.md`](https://github.com/OlehKondratow/credit-scoring-camunda/tree/develop/infra/pulumi/gke-infra).

---

## 1. Что создаёт программа (по `__main__.py`)

| Ресурс Pulumi | Google Cloud | Параметры в коде | Назначение |
|---------------|--------------|------------------|------------|
| `artifactregistry.Repository` `"ai-repo"` | Artifact Registry (Docker) | `europe-west1`, `credit-scoring-repo` | Образы. |
| `storage.Bucket` `"data-bucket"` | GCS | `credit-scoring-app-data`, `force_destroy = true` | Данные приложения/ML. |
| `sql.DatabaseInstance` `"postgres-instance"` | Cloud SQL | PostgreSQL 15, `db-f1-micro`, **публичный IPv4** | Эксперименты, не production. |
| `container.Cluster` `"gke-cluster"` | GKE | `credit-scoring-cluster`, зона `europe-west1-b` | Плоскость управления. |
| `container.NodePool` `"primary-nodes"` | Пул нод | 4×`e2-standard-4`, диск 25 ГиБ, scope `cloud-platform` | **Итого: 16 vCPU, 64 ГиБ RAM** в кластере. |

**Константы в коде:** `config_name = "credit-scoring"`, регион `europe-west1`, зона `europe-west1-b`.

**Экспорты стека:** `connect_cmd`, `db_ip`, `bucket_name`.

---

## 2. Регионы и внимание

- GKE **зональный** — `europe-west1-b`; остальное — **регион** `europe-west1`.
- Канон данных в монорепо — **`europe-central2`**, см. [INFRA-IMPLEMENTATION](INFRA-IMPLEMENTATION.md).
- В `Pulumi.dev.yaml` укажите реальный `gcp:project`; в репо может лежать плейсхолдер. Имя проекта Pulumi в `Pulumi.yaml` (`my-gcp-infra`) лучше переименовать под команду.

---

## 3. Предпосылки

- Pulumi CLI, `gcloud`, `kubectl`, Docker, `helm`, Python 3.7+.
- Включённые API: из корня репозитория — [`scripts/gcp-enable-apis-iam.sh`](https://github.com/OlehKondratow/credit-scoring-camunda/blob/develop/scripts/gcp-enable-apis-iam.sh) `PROJECT_ID` (при необходимости отдельно — SQL).
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
pulumi config set gcp:zone europe-west1-b
pulumi preview
pulumi up
```

**State:** `pulumi login` (SaaS), `pulumi login --local` или `pulumi login gs://BUCKET` (бакет и IAM — отдельно).

---

## 5. После развёртывания

### kubectl

```bash
gcloud container clusters get-credentials credit-scoring-cluster --zone europe-west1-b
```

Ожидается **4** ноды: `kubectl get nodes`.

### Artifact Registry

Формат образа: `europe-west1-docker.pkg.dev/PROJECT_ID/credit-scoring-repo/IMAGE:TAG`

```bash
gcloud auth configure-docker europe-west1-docker.pkg.dev
docker tag my-app:latest europe-west1-docker.pkg.dev/PROJECT_ID/credit-scoring-repo/my-app:1.0.0
docker push europe-west1-docker.pkg.dev/PROJECT_ID/credit-scoring-repo/my-app:1.0.0
```

### Cloud SQL

Только **лаборатория**: микро-тиер, **публичный** IP. IP — в `pulumi stack output db_ip`. Пользователи и пароли в этом `__main__.py` **не** задаются.

### GCS

Имя `credit-scoring-app-data` должно быть **уникальным** глобально. `force_destroy` — удобно для песочницы, не для регулируемых данных.

---

## 6. Эксплуатация и удаление

- Правки в `__main__.py` → `pulumi preview` / `up`.
- `pulumi destroy -y` — проверьте **Disks**, **GCS** и **Cloud SQL** на «хвосты».

---

## 7. Camunda 8 (Helm)

```bash
kubectl create namespace camunda-8
helm repo add camunda https://helm.camunda.io
helm repo update
```

Память кластера **~64 ГиБ** — закладывайте ресурсы под **Elasticsearch** и остальное (часто **8–12+ ГиБ** на ES в малых схемах). Для `worker/` укажите `ZEEBE_ADDRESS` на gateway в кластере (см. примеры в [`k8s/hbg/`](https://github.com/OlehKondratow/credit-scoring-camunda/tree/develop/k8s/hbg)).

---

## 8. Vertex AI

Scope `cloud-platform` на нодах — библиотеки вроде `google-cloud-aiplatform` через ADC. В проде лучше **Workload Identity** и отдельный GSA, как в основом контуре ([`infra/ROLES.md`](https://github.com/OlehKondratow/credit-scoring-camunda/blob/develop/infra/ROLES.md)). API: `aiplatform.googleapis.com`.

---

## 9. Конфликт с `infra/pulumi/`

| | `gke-infra` | Основой `infra/pulumi/` |
|---|------------|-------------------------|
| Регион | `europe-west1` | `europe-central2` |
| Artifact Registry | `credit-scoring-repo` | например `hbg-gke-docker` |
| Данные | один бакет, без BQ в этом файле | GCS + BQ `hbg_analytics` и т.д. |

Разумно: **отдельные** GCP project или осознанное переименование ресурсов.

---

## 10. Устранение неполадок и безопасность

- Квоты: SSD, IP, GKE. Медленное создание **Cloud SQL**.
- Публичный SQL, `f1-micro`, `force_destroy` — **только** для dev. Ключи SA не хранить в git; WIF, Secret Manager, политика — см. [prompt](prompt.md) §9.

*Текст согласован с `infra/pulumi/gke-infra/__main__.py` на момент публикации; при изменениях в коде сверяйтесь с репозиторием.*
