# Pulumi: IaC (GCP) в репозитории

**Канон в коде:** [`infra/pulumi/`](https://github.com/OlehKondratow/credit-scoring-camunda/tree/develop/infra/pulumi) (проект Pulumi), опционально песочница [`infra/pulumi/gke-infra/`](https://github.com/OlehKondratow/credit-scoring-camunda/tree/develop/infra/pulumi/gke-infra). Регион по умолчанию: **`europe-central2`**.

Поведение стека выбирается **`credit-scoring:stackRole`** (конфиг Pulumi, namespace `credit-scoring`).

| `stackRole` | Назначение |
|-------------|------------|
| `legacy` (по умолчанию) | GCS (слои raw / emb / processed, versioning), BigQuery, Artifact Registry, опционально GitHub WIF. |
| `infra-core` | Сеть, Private Service Access (Cloud SQL), опционально WIF. |
| `infra-data` | Версионируемые GCS, BQ, при необходимости **private** Cloud SQL (`createCloudSql`, `coreStackRef` на стек core). |
| `infra-runtime` | GKE (Workload Identity, узкие OAuth scopes), Artifact Registry; нужен `coreStackRef`. |

**Приложения** (Helm / Argo / манифесты) в этот Pulumi‑проект **не** входят — отдельный контур (`apps`).

## Запуск (локально)

```bash
cd infra/pulumi
python3 -m venv venv && . venv/bin/activate
pip install -r requirements.txt
pulumi stack init dev
pulumi config set gcp:project YOUR_GCP_PROJECT_ID
pulumi config set credit-scoring:region europe-central2
pulumi config set credit-scoring:stackRole legacy
pulumi preview
pulumi up
```

Пример раскидки ключа: [`infra/pulumi/Pulumi.dev.yaml.example`](https://github.com/OlehKondratow/credit-scoring-camunda/blob/develop/infra/pulumi/Pulumi.dev.yaml.example). Кратко у корня инфраструктуры: [`infra/README.md`](https://github.com/OlehKondratow/credit-scoring-camunda/blob/develop/infra/README.md).

**Split‑стеки:** сначала `pulumi up` для стека с **`infra-core`**, затем data/runtime с `credit-scoring:coreStackRef` = полное имя стека core (формат Pulumi, например `org/credit-scoring-infra/dev-core`).

## Связанные страницы на этом сайте

- [INFRA-IMPLEMENTATION.md](INFRA-IMPLEMENTATION.md) — фазы внедрения.
- [cli-console.md](cli-console.md) — Pulumi, `gcloud`, `kubectl`.
- [infra-pulumi-gke-sandbox.md](infra-pulumi-gke-sandbox.md) — отдельный Pulumi‑проект `gke-infra` (другой регион/имена; не смешивать `up` в одном project без плана).
- [gcp-saas-access-matrix-11x6.md](gcp-saas-access-matrix-11x6.md) — роли и доступ к сервисам GCP (чистовая матрица).
- [prompt.md](prompt.md) — handoff, §9+ enterprise.

## Опциональный GitHub → GCP (OIDC)

Код: `infra/pulumi/workload_identity_github.py`. Включение через `credit-scoring:enableGithubWif` и т.д. (см. исходник). CI: [`.github/workflows/pulumi-preview.yml`](https://github.com/OlehKondratow/credit-scoring-camunda/blob/develop/.github/workflows/pulumi-preview.yml).
