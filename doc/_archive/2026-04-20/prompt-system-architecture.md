# **Архитектура доступа и инфраструктуры (GitHub + GCP + GKE + Pulumi)**

## **1. Базовый принцип (переписан)**

Было:

> доступ есть → можно действовать

Станет:

> действие возможно → только если политика это разрешает

---

## **2. Контуры системы (жёсткое разделение)**

### **2.1. Control Plane (GitHub + CI/CD)**

* Единственная точка изменения инфраструктуры
* Использует OIDC
* Не хранит секреты

---

### **2.2. Infrastructure Plane (GCP IAM + Pulumi)**

* Реализует политику
* Не доверяет входящим запросам
* Все изменения проходят через policy check

---

### **2.3. Runtime Plane (GKE + Workloads)**

* Не имеет прав изменять инфраструктуру
* Только исполняет

---

### **2.4. Data Plane (GCS / BigQuery / SQL)**

* Изолирован
* Доступ только через сервис-аккаунты

---

# **3. GitHub → GCP (усиленная модель OIDC)**

## **Ограничение не только по repo, но и по контексту**

```bash
--condition="expression=
  attribute.repository=='ORG/REPO' &&
  attribute.ref=='refs/heads/main' &&
  attribute.actor!='dependabot[bot]'
"
```

Да, даже боты не должны деплоить без контроля.

---

## **GitHub Environments (обязательно)**

* `dev` → auto deploy
* `stage` → 1 approval
* `prod` → 2 approvals + restricted users

---

# **4. Pulumi → из “инструмента” в “политику”**

## **4.1. Вводим обязательный слой: Policy as Code**

### Запрещено на уровне политики:

* public IP в Cloud SQL
* `cloud-platform` scope
* bucket без versioning
* GKE без Workload Identity

---

### Пример:

```python
def validate_bucket(bucket):
    if not bucket.versioning:
        raise Exception("Bucket must have versioning enabled")
```

---

## **4.2. Разделение стеков**

| Stack         | Назначение        |
| ------------- | ----------------- |
| infra-core    | сеть, IAM         |
| infra-data    | GCS, BigQuery     |
| infra-runtime | GKE               |
| apps          | деплой приложений |

---

# **5. GKE (усиление модели)**

## **5.1. Node-level доступ = 0**

```python
oauth_scopes=[]
```

---

## **5.2. Каждый workload = отдельный identity**

| Service    | SA        |
| ---------- | --------- |
| API        | api-sa    |
| RAG worker | rag-sa    |
| ingestion  | ingest-sa |

---

## **5.3. Запрет прямого доступа**

* ❌ `kubectl` в prod
* ❌ ручные изменения
* ✅ только через GitOps / CI

---

# **6. Данные (переписанная модель)**

## **6.1. Слои**

| Слой       | Контроль      |
| ---------- | ------------- |
| raw        | immutable     |
| processed  | controlled    |
| embeddings | pipeline only |

---

## **6.2. Ключевое изменение**

Раньше:

> доступ к bucket

Теперь:

> доступ к **операции**

---

# **7. Пользователи (жёсткий RBAC)**

| Роль    | Доступ         |
| ------- | -------------- |
| Admin   | только JIT     |
| DevOps  | только CI/CD   |
| Dev     | только dev env |
| QA      | только тесты   |
| Auditor | только audit   |

---

## **Новое правило**

> человек не может напрямую изменить прод ни при каких условиях

---

# **8. Audit и контроль**

## **Обязательные компоненты:**

* Cloud Audit Logs (ADMIN + DATA)
* Log export → BigQuery
* Alerting (аномалии IAM)

---

## **Что фиксируется:**

* кто инициировал
* какой commit
* какой pipeline
* какие ресурсы изменены

---

# **9. Kill-switch механизм**

Да, это то, что все забывают.

Должно быть:

* возможность:

  * отключить CI service account
  * заблокировать деплой
* за секунды, не за часы

---

# **10. Anti-fragility (новый раздел)**

Система должна:

* переживать компрометацию GitHub
* переживать ошибку DevOps
* переживать неправильный PR

---

# **11. Финальная модель**

Теперь система выглядит так:

```id="hnhu4s"
User → PR → Review → CI (OIDC) → Pulumi + Policy → GCP IAM → GKE → Runtime
```

---

# **12. Главная разница (и причина переделки)**

Было:

> “мы настроили доступы”

Стало:

> **“мы построили систему, где неправильное действие невозможно выполнить”**

---
