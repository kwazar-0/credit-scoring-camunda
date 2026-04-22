# GCP IAM: 11 логических ролей и 6 людей (черновик для внедрения)

Документ — **чистовая** сводка для выдачи доступов в **Google Cloud** (SaaS «первой очереди» в этом репо: GKE, GCS, BigQuery, Vertex AI, Secret Manager, Artifact Registry, Logging, IAM на чтение). Детальная гуманитарка — в [`infra/ROLES.md`](../infra/ROLES.md). Связка с Git / CODEOWNERS — в [`github-codeowners-matrix.md`](github-codeowners-matrix.md).

**Принципы**

- **11** — *функции* (аудит, релиз, данные, платформа). **6** — *люди* (U1…U6). Один человек = несколько функций, если не нарушает политику SoD.
- **Регион по умолчанию:** `europe-central2` (см. `.cursorrules`).
- Реальные email и **custom roles** с префиксом организации вносите в **внутренний** реестр; здесь — только `roles/...` и U1…U6.
- **CI / сервисные аккаунты** (GitHub OIDC) выдают отдельно: люди **не** дублируют права `terraform apply` / `gcloud` prod-деплоя без необходимости.

---

## 1. Одиннадцать ролей → типовые `roles/...` GCP (по средам)

Ниже — **стартовый** набор для проектов **dev** / **staging (ref)** / **prod**. Сужайте до **Custom Roles** и условий IAM (C*), когда зрелость процесса потребует.

| № | Логическая роль | Dev-проект | Staging / ref | Prod |
|---|------------------|------------|---------------|------|
| **1** | devops / sre / cloud-eng | `roles/editor` *или* суженный набор: `roles/compute.admin`, `roles/container.admin`, `roles/iam.serviceAccountAdmin`, `roles/resourcemanager.projectIamAdmin` (по least privilege) | `roles/container.admin` + `roles/artifactregistry.admin` (или read+write к нужным репо) + доступ к state/секретам по политике | **Чаще** рутинный `pulumi`/деплой — **SA CI**; персонал — `viewer` + break-glass (роль **8**), не Owner «навсегда» |
| **2** | dev-developer | `roles/editor` на dev *или* без прямого GCP (только CI) | `roles/viewer` | `roles/viewer` (чтение артефактов/логов) либо **нет** проекта |
| **3** | dev-tester | `roles/viewer` (опционально) | — (staging ≠ dev-тест) | — |
| **4** | ref-tester | `roles/viewer` (если смотрят логи dev) | `roles/viewer` + доступ к app-only флагам | `roles/viewer` минимум или 0 (через UI) |
| **5** | prod-tester | — | `roles/viewer` (ref) | **App only** (Tasklist, Streamlit); **не** обязателен IAM на prod-проекте |
| **6** | prod-user | — | — | **Только продукт**; IAM GCP обычно **нет** |
| **7** | security / compliance | `roles/logging.viewer`, `roles/cloudasset.viewer`, `roles/iam.securityReviewer` (и org-уровень при необходимости) | Те же *read* на ref | Те же *read* на prod (аудит, политика) **без** `container.admin` без согласования |
| **8** | break-glass | — | — | **PAM** / временная выдача `roles/owner` или break-glass SA; **не** standing access |
| **9** | release-manager | `roles/viewer` (по желанию) | `roles/viewer` | `roles/viewer` (версии, артефакты) **или** только approve в GitHub Environments |
| **10** | data-engineer | `roles/storage.objectAdmin` (префиксы data-бакетов), `roles/bigquery.dataEditor`, `roles/bigquery.jobUser` | Суженные по данным, как в dev, на ref-проект | **По политике** — только согласованные бакеты/Dataset, без PII в сыром виде |
| **11** | ML Engineer | `roles/aiplatform.user` (+ при настройке индекса в dev: `roles/aiplatform.admin` *только* dev), `roles/storage.objectViewer` на бакет эмбеддингов | `roles/aiplatform.user`, `viewer` + логи — по модели | В основном **через CI**; prod — минимум, без админ-Vertex с ноутбука |

**Camunda, Streamlit** и другой SaaS вне GCP настраиваются **отдельно** (SSO, группы продукта) — не заменяют таблицу выше, а дополняют для ролей **5–6**.

---

## 2. Шесть пользователей (U1…U6) — как агрегировать IAM

В Cloud Identity / Workspace заведите **6 групп** (или 6 субъектов `user:`), по одному **человеку** на U*. В IAM **привязывайте не людей напрямую к 11 ролям**, а **группу** + набор `roles/...` из таблицы п.1 для каждой среды.

| Слот | Кого обычно сопоставляют (см. [github-codeowners-matrix](github-codeowners-matrix.md)) | Какие **номера** логических ролей (из 11) |
|------|----------------------------------------------------------------------------------------|-------------------------------------------|
| **U1** | `@kwazar-0` (платформа) | 1, часть 7, on-call 8, часть 9 |
| **U2** | `@OlehKondratow` | 2, 9 (часть), 10 (часть), 11 |
| **U3** | `@tempb59-commits` | 3, 4 |
| **U4** | `@geraltwilkbialy-cloud` | 7 (основной) |
| **U5** | `@olehkondracki-prog` | 10, 2/11 (зона data) |
| **U6** | `@tempb418-ux` | 1 (co-platform с U1) |

**Как «собрать» `roles/...` для U1 (пример):** на **dev** — `roles/editor` *или* platform-narrow; на **prod** — **не** полный `roles/owner` для повседневной работы; совместить с `roles/viewer` + approve в CI. Точные имена custom roles — ваша внутренняя политика.

**Как собрать для U3 (QA):** на **dev** + **staging** — преимущественно `roles/viewer` + (по необходимости) `roles/logging.viewer`; без `container.admin` на prod.

**Как собрать для U4:** **только read/review** роли из строки 7 (Logging, Cloud Asset, Security Reviewer) на нужных проектах/папке org.

**Роли 5–6** не требуют строк в проектном IAM для **людей**; **роль 8** — не группа, а runbook + PAM.

---

## 3. Чеклист перед фиксацией в org

- [ ] Для **prod** подтверждён, что **люди** не копируют права **CI / SA** без отдельного согласования.
- [ ] **BigQuery / GCS** с PII: только префиксы, маскирование, отдельные датасеты.
- [ ] **Vertex / Vertex Vector Search** — отдельно согласованы `aiplatform.*` на prod.
- [ ] [Workload Identity + GitHub](https://github.com/google-github-actions/auth) сопоставлены с **SA**, не с личными U1…U6.

---

## См. также

- [infra/ROLES.md](../infra/ROLES.md) — полная матрица (Pulumi, K8s, Git).
- [infra/ROLES.gke-rbac.example.md](../infra/ROLES.gke-rbac.example.md) — пример GKE RBAC.
- [github-codeowners-matrix.md](github-codeowners-matrix.md) — 11 → 6 для **Git** ревью.
