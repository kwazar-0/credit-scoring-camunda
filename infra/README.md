# Infrastructure (`infra/`)

## Единый подход: **Pulumi**

Основной IaC — **`pulumi/`** (Python), опционально песочница **`pulumi/gke-infra/`**. Роли и изоляция: **`ROLES.md`**, **`ARCHITECTURE.md`**.

| Документ | Содержимое |
|----------|------------|
| **`ROLES.md`** | DevOps/SRE, dev-developer, dev-tester, ref-tester, prod-tester, prod-user + опциональные роли |
| **`ARCHITECTURE.md`** | Изоляция и GitOps (Pulumi как канон IaC) |

## Быстрый старт (Pulumi)

```bash
cd infra/pulumi
python3 -m venv venv && . venv/bin/activate
pip install -r requirements.txt
pulumi stack init dev
pulumi config set gcp:project YOUR_PROJECT_ID
pulumi up
```

Подробнее: **`pulumi/README.md`**.

Приложения в кластере (GitOps): **`../k8s/argocd/README.md`** — установка Argo CD и пример `Application` для `k8s/hbg/`.

### Опциональный стек `pulumi/gke-infra`

Отдельный Pulumi-проект (свой `Pulumi.yaml`): GKE, Cloud SQL, Artifact Registry и GCS в одном `pulumi up`. **Документация (сайт):** [docs-site/infra-pulumi-gke-sandbox.md](../docs-site/infra-pulumi-gke-sandbox.md) ([EN](../docs-site/en/infra-pulumi-gke-sandbox.md)); в репо — **[pulumi/gke-infra/manual.md](pulumi/gke-infra/manual.md)**. Это **не** замена основого **`pulumi/`** (GCS+BQ+AR для `hbg` в `europe-central2`). В gke-infra — регион **`europe-west1`** и имена `credit-scoring-*`; **не** применяйте оба стека к одному GCP project без согласования идентификаторов.

Регион по умолчанию для продуктового стека: **`europe-central2`**.
