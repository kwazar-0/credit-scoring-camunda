# Инфраструктура: Camunda 8 + AI scoring — рабочий трек

**Цель:** спроектировать и внедрить облачный контур для **кредитного конвейера**: оркестрация **Camunda (Zeebe)**, scoring через **FastAPI + LangGraph + Vertex (RAG)**, деплой в **GKE**, данные в **GCS / BigQuery**, регион **`europe-central2`**.

Этот файл — **единственная дорожная карта** для фокуса. Остальная документация — справочники; индекс: [toc.md](toc.md).

---

## Фазы (что делать по порядку)

| # | Фаза | Результат «готово» | Где смотреть |
|---|------|---------------------|--------------|
| **1** | **Облако + IaC (dev)** | API включены, Pulumi `pulumi up` на **dev**, есть GCS, BQ dataset, Artifact Registry, экспорты стека | [infra-pulumi-iac.md](infra-pulumi-iac.md), [cli-console.md](cli-console.md), [scripts/gcp-enable-apis-iam.sh](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/scripts/gcp-enable-apis-iam.sh) |
| **2** | **CI → GCP (OIDC)** | GitHub Actions может аутентифицироваться в GCP без JSON-ключей (WIF при необходимости) | `infra/pulumi/workload_identity_github.py`, [.github/workflows/pulumi-preview.yml](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/.github/workflows/pulumi-preview.yml) |
| **3** | **GKE + образы** | Кластер (Standard), workload в namespace, образы из Artifact Registry, Workload Identity для подов | [infra-pulumi-iac.md](infra-pulumi-iac.md) (`stackRole: infra-runtime` при split), `k8s/hbg/` |
| **4** | **Данные RAG** | PDF → GCS → ingest → эмбеддинги → Vertex Vector Search; backend без мока векторной БД | [ml-data-rag.md](ml-data-rag.md), `data/` |
| **5** | **Camunda в контуре** | BPMN/DMN задеплоены, секреты Zeebe/Tasklist из Secret Manager, worker `ai-loan-analysis` стабильно зовёт backend | `bpmn/`, `worker/`, процессы |
| **6** | **Наблюдаемость / политика** | Логи, BQ-аналитика без сырого PII, при необходимости матрица ролей | [gcp-saas-access-matrix-11x6.md](gcp-saas-access-matrix-11x6.md) |

**MVP по продукту (из [prompt.md](prompt.md) §5):** фазы **1 → 4** (ingestion, индекс, выключить mock) → затем **5** и тесты worker ↔ backend.

---

## Почему такой порядок фаз (и какие порядки мы отвергли)

**Зависимости:** фаза **1** создаёт проект, API, базовые ресурсы и «землю» под state Pulumi — без этого бессмысленны и **3** (GKE), и **4** (хранилища под корпус RAG). **2** (OIDC) логично сразу после появления стабильного GCP-проекта: иначе CI либо на JSON-ключах (антипаттерн), либо вообще не трогает облако.

**Почему не «сначала Camunda (5), потом RAG (4)»:** можно было бы поднять Zeebe и воркеры на моках retrieval — быстрый демо-скриншот, но **высокий риск переделки** контрактов job ↔ API, когда реальный векторный контур окажется с другой латентностью, лимитами и форматами цитирования. Для учебного контура зафиксирован приоритет **сквозного data-path** к модели.

**Почему не «GKE (3) до полного IaC (1)»:** ручной кластер без Pulumi возможен, но расходится с каноном репозитория и усложняет воспроизводимость для новых участников.

**Фазы 6** сознательно **после** рабочего контура: наблюдаемость и матрица ролей — зрелость, а не блокер для первого `pulumi up` и первого E2E.

---

## Минимальный набор чтения (1–2 часа, потом — код)

1. **[prompt.md](prompt.md) — §1–5, §7–8** — продукт, структура репо, **план этапов**, E2E.  
2. **[infra-pulumi-iac.md](infra-pulumi-iac.md)** — Pulumi, `stackRole`, OIDC, split стеков.  
3. **[`infra/README.md`](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/infra/README.md)** (репо) — pet-bootstrap: billing, ADC/quota, IAM, bucket для state, `infra-core`, split, типовые ошибки.  
4. **`infra/pulumi/__main__.py`** (репо) — что выбирает стек.  
5. **[cli-console.md](cli-console.md)** — Pulumi, `gcloud`, включение API.

**Отложить до отдельной задачи** (чтобы не распыляться): детальная матрица 11 ролей × 6 учёток ([gcp-saas-access-matrix-11x6.md](gcp-saas-access-matrix-11x6.md)), CODEOWNERS, [prompt.md](prompt.md) **§9.6** hardening — это про зрелый enterprise-контур, не блокирует **фазу 1–2**.

---

## Enterprise-спека (когда понадобится)

Полная цель (VPC, мульти-пул GKE, OPA, Binary Authorization) — **[prompt.md](prompt.md) с §9**. Читать **после** рабочего MVP, переносить в Pulumi по мере появления требований.

---

## Опционально: песочница GKE + Cloud SQL (`gke-infra`)

**Документация в этом сайте (подробно, RU/EN/PL):** [infra-pulumi-gke-sandbox](infra-pulumi-gke-sandbox.md) / [EN](/en/infra-pulumi-gke-sandbox) / [PL](/pl/infra-pulumi-gke-sandbox).

В репозитории — **второй** Pulumi-проект [`infra/pulumi/gke-infra/`](https://github.com/kwazar-0/credit-scoring-camunda/tree/develop/infra/pulumi/gke-infra) (GKE, приватный Cloud SQL без публичного IP, GCS, Artifact Registry в одном стеке). Ранбук: [README.md](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/infra/pulumi/gke-infra/README.md).

По умолчанию регион — **`europe-central2`**, префикс имён **`cs-sandbox-*`**, не **`infra/pulumi/`** (`hbg-*` и `stackRole`). **Не** смешивайте оба `pulumi up` в одном project без плана (пересечение VPC/PSA/SQL). См. [infra-pulumi-iac](infra-pulumi-iac.md) и [gke-infra (сайт)](infra-pulumi-gke-sandbox.md).

---

## Быстрые команды

```bash
# API в проекте
./scripts/gcp-enable-apis-iam.sh YOUR_GCP_PROJECT_ID

# Pulumi (из корня репо)
cd infra/pulumi && python3 -m venv venv && . venv/bin/activate && pip install -r requirements.txt
pulumi config set gcp:project YOUR_GCP_PROJECT_ID
pulumi config set credit-scoring:region europe-central2
pulumi preview && pulumi up
```

---

*Обновляйте таблицу фаз, когда этап закрыт; детали гита — [git-workflow.md](git-workflow.md), не смешивать с облачным чеклистом.*
