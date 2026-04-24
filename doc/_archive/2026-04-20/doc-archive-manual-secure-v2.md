# **manual.md — GitHub + GCP + GKE + Pulumi (Secure Setup v2)**

## **0. Цель**

Обеспечить:

* отсутствие статических секретов
* невозможность прямых изменений в prod
* полный audit trail
* детерминированный деплой через CI/CD

---

# **1. GitHub — Контур управления**

## **1.1 Branch Protection (main)**

**Settings → Branches → Add rule**

Включить:

* Require pull request before merging
* Require approvals: **2**
* Require CODEOWNERS review
* Require status checks:

  * `ci`
  * `pulumi-preview`
* Require conversation resolution
* Include administrators
* Restrict who can push → `platform-team`
* Disable force push
* Disable branch deletion

---

## **1.2 CODEOWNERS**

`.github/CODEOWNERS`

```plaintext
# Infra
pulumi/*                @platform-team
infra/*                 @platform-team

# CI/CD
.github/workflows/*     @platform-team @security-team

# Security
security/*              @security-team

# Data
data/*                  @data-team

# ML / RAG
rag/*                   @ml-team
```

---

## **1.3 Environments**

**Settings → Environments**

### dev

* auto deploy

### stage

* 1 approval
* ограничение: platform-team

### prod

* 2 approvals
* только platform + security
* wait timer: 5–10 минут

---

## **1.4 Запрет секретов**

* Secret scanning: ON
* Push protection: ON

---

## **1.5 GitHub Actions — базовые правила**

В каждом workflow:

```yaml
permissions:
  id-token: write
  contents: read
```

---

## **1.6 Ограничение запуска**

```yaml
on:
  push:
    branches: [main]

on:
  pull_request:
    branches: [main]
```

---

## **1.7 Защита от fork**

```yaml
if: github.event.pull_request.head.repo.fork == false
```

---

# **2. OIDC (GitHub → GCP)**

## **2.1 Принцип**

* GitHub получает временный токен
* GCP доверяет только конкретному repo + branch

---

## **2.2 Binding**

```bash
gcloud iam service-accounts add-iam-policy-binding \
  pulumi-deployer@PROJECT_ID.iam.gserviceaccount.com \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/github-pool/attribute.repository/ORG/REPO" \
  --condition="expression=attribute.ref=='refs/heads/main'"
```

---

# **3. Pulumi — управление инфраструктурой**

## **3.1 Разделение стеков**

| Stack         | Назначение    |
| ------------- | ------------- |
| infra-core    | IAM, сеть     |
| infra-data    | GCS, BigQuery |
| infra-runtime | GKE           |
| apps          | приложения    |

---

## **3.2 Policy as Code (обязательно)**

Запрещено:

* public IP в Cloud SQL
* bucket без versioning
* GKE без Workload Identity
* `cloud-platform` scope

---

## **3.3 State**

* Pulumi Cloud или GCS с:

  * versioning
  * locking

---

# **4. GKE Security Model**

## **4.1 Workload Identity**

```python
workload_identity_config={
  "workload_pool": f"{project}.svc.id.goog"
}
```

---

## **4.2 Node security**

```python
oauth_scopes=[]
```

---

## **4.3 Service Accounts per workload**

| Service   | SA        |
| --------- | --------- |
| API       | api-sa    |
| RAG       | rag-sa    |
| ingestion | ingest-sa |

---

## **4.4 Запрет ручного доступа**

* ❌ kubectl в prod
* ✅ только CI/CD

---

# **5. Данные (GCS / BigQuery / SQL)**

## **5.1 Разделение**

| Слой       | Контроль      |
| ---------- | ------------- |
| raw        | immutable     |
| processed  | controlled    |
| embeddings | pipeline only |

---

## **5.2 GCS**

Обязательно:

* versioning
* uniform access
* audit logs

---

## **5.3 Доступ**

| Роль        | Raw  | Embeddings |
| ----------- | ---- | ---------- |
| ML pipeline | read | write      |
| Inference   | ❌    | read       |
| Dev         | ❌    | ❌          |

---

## **5.4 Cloud SQL**

Запрещено:

```python
ipv4_enabled=True
```

Правильно:

```python
ipv4_enabled=False
private_network=VPC
```

---

# **6. RBAC (люди)**

| Роль    | Доступ     |
| ------- | ---------- |
| Admin   | JIT only   |
| DevOps  | только CI  |
| Dev     | только dev |
| QA      | read       |
| Auditor | audit only |

---

# **7. Audit**

Обязательно:

* Cloud Audit Logs (ADMIN + DATA)
* Export → BigQuery
* алерты на IAM изменения

---

# **8. CI/CD (пример)**

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    permissions:
      id-token: write
      contents: read

    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: ${{ secrets.WIF_PROVIDER }}
          service_account: ${{ secrets.GCP_SA }}

      - uses: pulumi/actions@v4

      - run: pulumi up --yes
```

---

# **9. Anti-Patterns (запрещено)**

* JSON ключи
* `cloud-platform` scope
* shared service accounts
* ручной деплой
* доступ “на всякий случай”

---

# **10. Fail-safe**

Если инцидент:

1. Отключить GitHub Actions
2. Заблокировать Service Account
3. Проверить последние deploy
4. Заморозить main

---

# **11. Финальная модель**

```text
User → PR → Review → CI (OIDC) → Pulumi + Policy → GCP IAM → GKE → Runtime
```

---

# **Итог**

Теперь это не:

> “инфраструктура, которую можно поменять”

А:

> **система, в которой изменение возможно только если оно прошло все уровни контроля**

---
