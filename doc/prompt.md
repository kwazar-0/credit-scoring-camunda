

### 🏛️ Расширенная матрица доступа к облачным сервисам GCP

Здесь мы добавляем права на Storage, DB и AI-сервисы.



| Сервис | Роль (GCP IAM Role) | Кому назначаем | Зачем это нужно |
| :--- | :--- | :--- | :--- |
| **GCS (Pulumi State)** | `roles/storage.objectAdmin` | **DEVOPS**, **ADMIN** | Чтобы Pulumi мог сохранять и блокировать файл состояния. |
| **Vertex AI (LLM)** | `roles/aiplatform.user` | **DEV-SH**, **DEV-UX** | Чтобы бэкенд и фронтенд могли слать запросы к Gemini. |
| **Vector Search** | `roles/aiplatform.indexEditor` | **DEVOPS**, **SH-DEV** | Для управления индексами и поиска по эмбеддингам. |
| **Cloud SQL** | `roles/cloudsql.client` | **DEV-SH**, **DEVOPS** | Чтобы приложение могло подключиться к PostgreSQL. |
| **Artifact Registry** | `roles/artifactregistry.writer` | **DEVOPS** | Для пуша Docker-образов Camunda/Worker. |
| **Artifact Registry** | `roles/artifactregistry.reader` | **GKE Service Account** | Чтобы кластер мог скачивать образы. |

---

### 🛠️ Инструкция по настройке ресурсов

#### 1. Подготовка бакета для Pulumi (State)
Выполняет **ADMIN**:
```bash
# Создаем уникальный бакет
gsutil mb -l europe-central2 gs://pulumi-state-credit-scoring-camunda

# Даем доступ DevOps'у, чтобы он мог запускать pulumi up
gsutil iam ch user:geraltwilkbialy@gmail.com:roles/storage.objectAdmin gs://pulumi-state-credit-scoring-camunda
```

#### 2. Настройка Vertex AI (AI/ML)
Разработчикам нужно право вызывать модели Gemini:
```bash
# Даем права на использование Vertex AI всем разработчикам
gcloud projects add-iam-policy-binding my-camunda8-project \
    --member="user:tempb59@gmail.com" --role="roles/aiplatform.user"
gcloud projects add-iam-policy-binding my-camunda8-project \
    --member="user:awsterra3@gmail.com" --role="roles/aiplatform.user"
```

#### 3. Безопасность Cloud SQL
Мы не даем пароли. Мы используем **Cloud SQL Auth Proxy**.
* **Разработчик** получает `roles/cloudsql.client`, чтобы подключиться локально для отладки.
* **Приложение** в GKE использует **Workload Identity** (мы настроим это позже).

---

### 🚀 Полный Step-by-Step план для ADMIN (box@okondratov.pl)

Чтобы всё заработало по "фэншую", выполни эти шаги по очереди:

1.  **Наведи порядок в IAM:**
    * Отбери `container.admin` у всех, кроме себя.
    * Выдай `roles/container.viewer` всем (UX, SH, QA, DEVOPS, AUDIT).
2.  **Создай K8s Namespaces:**
    * `credit-dev`, `credit-ref`, `credit-prod`.
3.  **Примени RBAC манифесты:**
    * Используй `RoleBinding`, чтобы запереть UX и SH в `credit-dev`.
4.  **Создай инфраструктурные ресурсы:**
    * Бакет для Pulumi.
    * Репозиторий в Artifact Registry (`credit-scoring-repo`).
    * Cloud SQL инстанс.
5.  **Настрой Vertex AI:**
    * Включи API: `gcloud services enable aiplatform.googleapis.com`.
    * Создай Index и Endpoint для Vector Search (это лучше делать через Pulumi).

---

### 🛡️ Тонкий момент: Работа с "Audit"
Для роли **AUDIT** (`oleg.kondratov@gmail.com`) крайне важно выдать права на чтение логов, чтобы он мог видеть, кто и когда вызывал LLM или лез в базу:
```bash
gcloud projects add-iam-policy-binding my-camunda8-project \
    --member="user:oleg.kondratov@gmail.com" --role="roles/logging.viewer"
```

**Camunda (Helm):** актуальные values и команды — в репозитории: [`k8s/camunda/README.md`](../k8s/camunda/README.md).

---

## Актуальный handoff (репо `Credit-Scoring-V2`, не чёрновик выше)

Регион IaC по умолчанию: **`europe-central2`**. Pulumi: `infra/pulumi/__main__.py` → `credit-scoring:stackRole` = `legacy` | `infra-core` | `infra-data` | `infra-runtime`. Подробности: `docs-site/infra-pulumi-iac.md`, `infra/prompt.md`.
