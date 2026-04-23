# 📘 Manual: Инфраструктура Credit-Scoring-V2 (GCP + GKE)

**English (detailed, aligned with `__main__.py`):** [manual.en.md](manual.en.md)  
**Сайт документации (VitePress):** [docs-site/infra-pulumi-gke-sandbox.md](../../../docs-site/infra-pulumi-gke-sandbox.md) · [EN](../../../docs-site/en/infra-pulumi-gke-sandbox.md)

Данный документ описывает архитектуру и процессы управления облачной инфраструктурой для проекта Camunda 8 + AI.

## 🏗 Архитектура системы

Инфраструктура развернута в регионе `europe-west1` (Бельгия) и включает следующие компоненты:

| Компонент | Технология | Характеристики | Назначение |
| :--- | :--- | :--- | :--- |
| **Orchestration** | GKE (Kubernetes) | 4 ноды `e2-standard-4` | Запуск Camunda 8, Zeebe и микросервисов. |
| **Database** | Cloud SQL (PostgreSQL 15) | Tier: `db-f1-micro` | Хранение бизнес-данных и метаданных. |
| **Docker Storage** | Artifact Registry | Docker Format | Хранение приватных образов приложений. |
| **File Storage** | Cloud Storage (GCS) | Standard Storage | Хранение документов, ML-моделей и логов. |
| **AI/ML** | Vertex AI (API) | Gemini / Embeddings | Обработка естественного языка и RAG. |

---

## 🔐 Управление состоянием (State Management)

Состояние Pulumi (State) хранится **децентрализованно** в Google Cloud Storage. Это позволяет нескольким разработчикам работать над одной инфраструктурой без конфликтов.

* **Bucket:** `gs://my-pulumi-state-unique`
* **Команда для входа:**
    ```bash
    pulumi login gs://my-pulumi-state-unique
    ```

---

## 🛠 Команды обслуживания

### 1. Подключение к кластеру
Чтобы использовать `kubectl`, необходимо получить учетные данные:
```bash
gcloud container clusters get-credentials credit-scoring-cluster --zone europe-west1-b
```

### 2. Работа с Artifact Registry
Чтобы загрузить свой образ в облачный реестр:
```bash
# Авторизация Docker
gcloud auth configure-docker europe-west1-docker.pkg.dev

# Тегирование и пуш
docker tag my-app:latest europe-west1-docker.pkg.dev/[PROJECT_ID]/credit-scoring-repo/my-app:1.0
docker push europe-west1-docker.pkg.dev/[PROJECT_ID]/credit-scoring-repo/my-app:1.0
```

### 3. Обновление инфраструктуры
Если вы изменили код в `__main__.py` (например, увеличили количество нод):
```bash
pulumi up -y
```

---

## 🚀 Деплой Camunda 8 (Next Steps)

После того как GKE будет готов, выполните следующие действия для установки Camunda:

1.  **Создайте Namespace:**
    ```bash
    kubectl create namespace camunda-8
    ```
2.  **Добавьте Helm репозиторий:**
    ```bash
    helm repo add camunda https://helm.camunda.io
    helm repo update
    ```
3.  **Установка:** Используйте файл `values.yaml`, оптимизированный под 64 ГБ RAM (выделяйте минимум 8-12 ГБ для Elasticsearch).

---

## ⚠️ Важные замечания (Troubleshooting)

* **Квоты:** Если вы видите ошибку `Quota Exceeded`, проверьте лимиты на SSD-диски и статические IP в панели управления GCP.
* **Очистка:** Чтобы полностью удалить все ресурсы и перестать платить за них:
    ```bash
    pulumi destroy -y
    ```
    *После удаления ресурсов рекомендуется проверить вкладку "Disks" в Compute Engine на наличие "осиротевших" дисков.*

---

## 🤖 Интеграция с AI (Vertex AI)

Ваш кластер имеет права `https://www.googleapis.com/auth/cloud-platform`. Это позволяет вашим Python-приложениям внутри Kubernetes использовать библиотеку `google-cloud-aiplatform` без дополнительных ключей.

**Пример использования Gemini в коде приложения:**
```python
from vertexai.generative_models import GenerativeModel
model = GenerativeModel("gemini-1.5-pro")
response = model.generate_content("Analyze this credit score report...")
```
