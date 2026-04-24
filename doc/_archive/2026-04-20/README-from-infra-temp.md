# Infrastructure (архив: перенесено из `infra/temp/`)

> Снимок документации и соглашений. **Канон по коду:** [`../../infra/pulumi/`](../../infra/pulumi/), краткий индекс — [`../../infra/README.md`](../../infra/README.md).

## Единый подход: **Pulumi**

Основной IaC — **`../../infra/pulumi/`** (Python), опционально песочница **`../../infra/pulumi/gke-infra/`**. Роли и изоляция в **этом же каталоге архива:** **`ROLES.md`**, **`ARCHITECTURE.md`**.

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

Приложения в кластере (GitOps): **[`../../k8s/argocd/README.md`](../../k8s/argocd/README.md)**.

### Опциональный стек `pulumi/gke-infra`

Отдельный Pulumi-проект (свой `Pulumi.yaml`). **Документация (сайт):** [docs-site/infra-pulumi-gke-sandbox.md](../../docs-site/infra-pulumi-gke-sandbox.md) ([EN](../../docs-site/en/infra-pulumi-gke-sandbox.md)); в репо — **`../../infra/pulumi/gke-infra/README.md`**. Это **не** полная замена основого стека **`../../infra/pulumi/`** (регион по умолчанию для продуктового контура: **`europe-central2`**).
