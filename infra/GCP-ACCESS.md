# GCP: чистовая схема доступов (IAM)

Черновик для **согласования в организации** и **ввода в эксплуатацию**. Реальные **project id**, **email групп** и **номера** не храните в публичном репозитории: заполняйте копию локально — **`GCP-ACCESS.local.md`** (см. [`.gitignore`](../.gitignore)).

- **11 продуктовых ролей** и процесс: [`ROLES.md`](ROLES.md)  
- **6 учёток ↔ 11 ролей (Git, ревью):** [`doc/github-codeowners-matrix.md`](../doc/github-codeowners-matrix.md)  
- **GKE RBAC (пример без PII):** [`ROLES.gke-rbac.example.md`](ROLES.gke-rbac.example.md)  
- **Регион по умолчанию:** `europe-central2` (см. `.cursorrules`).

---

## 1. Модель идентичности

| Слой | Назначение |
|------|------------|
| **Google Cloud Identity / Workspace** | Люди и **группы** — основные principal’ы для IAM (предпочтительно группы, а не 10 отдельных user bindings на каждый ресурс). |
| **Service accounts (SA)** | Рабочие **не** логинятся под SA; SA для **приложений** и **CI (OIDC)**. |
| **Ключи JSON от SA** | **Не** выдавать людям и **не** класть в git; CI — **GitHub → Workload Identity Federation → SA** (см. `doc/github-setup.md`, Pulumi по репо). |

---

## 2. Проекты и среды (пример)

Подставьте свои id. Типично: **отдельный project на prod** и **non-prod**, либо один project с жёстким least privilege (как в [`ARCHITECTURE.md`](ARCHITECTURE.md)).

| Среда | Project id (плейсхолдер) | Примечание |
|--------|--------------------------|------------|
| Dev / песочница | `<PROJECT_DEV>` | Editor или суженные custom на dev-ресурсы |
| Staging / ref | `<PROJECT_STAGING>` | Часто `roles/viewer` + CI для deploy |
| Prod | `<PROJECT_PROD>` | Минимальные human роли; деплой через CI + approval |

**Регион GKE / региональные API:** `europe-central2`, если нет иного решения банка.

---

## 3. Группы Google → роли IAM (чистовая матрица)

Принцип: **одна группа — один «пакет» из [11 ролей](ROLES.md#полный-список-ролей)**; внутри команды 6 людей, но в **GCP** вешайте **группы**, а не личные почты по одной.

| Группа (плейсхолдер) | Покрываемые роли (из ROLES.md) | Типичные `roles/*` на **non-prod** project | Типичные `roles/*` на **prod** project |
|----------------------|--------------------------------|------------------------------------------|----------------------------------------|
| `gg-<prefix>-platform@…` | 1 devops/sre, 8 break-glass (on-call) | `container.admin` или суженный custom; + IAM по политике; **не** обязательно `owner` | Минимум для SRE: часто custom + PAM; не editor для всех |
| `gg-<prefix>-developers@…` | 2 dev-developer | `editor` *или* узкий custom на dev | Обычно **нет** `editor`; только dev project |
| `gg-<prefix>-qa-dev@…` | 3 dev-tester | `viewer` (опционально) | — |
| `gg-<prefix>-qa-staging@…` | 4 ref-tester | `viewer` на staging | `viewer` только если нужен для UAT-артефактов |
| `gg-<prefix>-security@…` | 7 security / compliance | `logging.viewer`, `cloudasset.viewer`, `iam.securityReviewer`, `orgpolicy.orgPolicyViewer` (по согласованию) | Те же read / review, **без** `container.admin` |
| `gg-<prefix>-data@…` | 10 data-engineer | `storage.objectAdmin` (префиксы), `bigquery.dataEditor`, `bigquery.jobUser` | Суженно + только нужные датасеты |
| `gg-<prefix>-ml@…` | 11 ML Engineer | `aiplatform.user`, `storage.objectViewer` на бакеты эмбеддингов; `aiplatform.admin` **только** в dev при настройке индекса | Без admin без CI/approval |
| `gg-<prefix>-release@…` | 9 release-manager | `viewer` (чтение версий/артефактов) | `viewer` read-only |
| `gg-<prefix>-breakglass@…` | 8 (членство **пустое**; только на инцидент) | Elevation по runbook (PAM / temporary binding) | То же |

Роли **5 (prod-tester)** и **6 (prod-user)** в GCP для git/IAM обычно **не** нужны: доступ через продукт (Camunda, Streamlit) и тестовые данные/флаги.

---

## 4. Сервисные учётки (SA) для автоматики

| SA (плейсхолдер) | Назначение | Примечание |
|------------------|------------|------------|
| `ci-github-apply-dev@<PROJECT>.iam.gserviceaccount.com` | Pulumi/деплой **dev** из GitHub (OIDC) | Минимальные роли на dev-ресурсы |
| `ci-github-apply-prod@<PROJECT>.iam.gserviceaccount.com` | **prod** только с protected branch + Environment approval | **Нет** JSON в репо |
| Рабочие SA приложения | GKE, Vertex, Secret Manager | Через Workload Identity / Secret Manager, см. Pulumi в `infra/pulumi/` |

---

## 5. Аудит и запреты

- Все изменения IAM — **Cloud Audit Logs**; для привилегий — **recommendations** + периодический review.  
- **Не** выдавать `roles/owner` широко; Owner — small set в org.  
- **Prod:** нет `roles/editor` для разработческих групп без исключения.  
- Секреты: **Secret Manager**; PII/PESEL — политика приложения и [`backend/app/services/pii.py`](../backend/app/services/pii.py).

---

## 6. Что сделать руками после заполнения плейсхолдеров

1. Создать группы в **Admin Console** (или Cloud Identity).  
2. `IAM & Admin` → **Grant access** per project: principal = **group**, role = по таблице выше.  
3. Проверить **IAM Recommender** / избыточные роли.  
4. Задокументировать **исключения** (кто, почему, до какой даты) внутри орг-репо или Jira, не в публичном git.

**Локальная копия с реальными id:** `infra/GCP-ACCESS.local.md` (создайте сами, в `.gitignore`).
