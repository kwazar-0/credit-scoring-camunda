# Инфраструктура: Camunda 8 + AI scoring — рабочий трек

**Цель:** спроектировать и внедрить облачный контур для **кредитного конвейера**: оркестрация **Camunda (Zeebe)**, scoring через **FastAPI + LangGraph + Vertex (RAG)**, деплой в **GKE**, данные в **GCS / BigQuery**, регион **`europe-central2`**.

Этот файл — **единственная дорожная карта** для фокуса. Остальная документация — справочники; индекс: [README.md](README.md).

---

## Фазы (что делать по порядку)

| # | Фаза | Результат «готово» | Где смотреть |
|---|------|---------------------|--------------|
| **1** | **Облако + IaC (dev)** | API включены, Pulumi `pulumi up` на **dev**, есть GCS, BQ dataset, Artifact Registry, экспорты стека | [infra/pulumi/README.md](../infra/pulumi/README.md), [cli-console.md](cli-console.md), [scripts/gcp-enable-apis-iam.sh](../scripts/gcp-enable-apis-iam.sh) |
| **2** | **CI → GCP (OIDC)** | GitHub Actions может аутентифицироваться в GCP без JSON-ключей (WIF при необходимости) | `infra/pulumi/workload_identity_github.py`, [.github/workflows/pulumi-preview.yml](../.github/workflows/pulumi-preview.yml) |
| **3** | **GKE + образы** | Кластер (Standard), workload в namespace, образы из Artifact Registry, Workload Identity для подов | [doc/_archive/2026-04-20/ARCHITECTURE.md](../doc/_archive/2026-04-20/ARCHITECTURE.md), `k8s/hbg/` |
| **4** | **Данные RAG** | PDF → GCS → ingest → эмбеддинги → Vertex Vector Search; backend без мока векторной БД | [ml-data-rag.md](ml-data-rag.md), `data/` |
| **5** | **Camunda в контуре** | BPMN/DMN задеплоены, секреты Zeebe/Tasklist из Secret Manager, worker `ai-loan-analysis` стабильно зовёт backend | `bpmn/`, `worker/`, процессы |
| **6** | **Наблюдаемость / политика** | Логи, BQ-аналитика без сырого PII, при необходимости матрица ролей | [doc/_archive/2026-04-20/ROLES.md](../doc/_archive/2026-04-20/ROLES.md) |

**MVP по продукту (из [prompt.md](prompt.md) §5):** фазы **1 → 4** (ingestion, индекс, выключить mock) → затем **5** и тесты worker ↔ backend.

---

## Минимальный набор чтения (1–2 часа, потом — код)

1. **[prompt.md](prompt.md) — §1–5, §7–8** — продукт, структура репо, **план этапов**, E2E.  
2. **[doc/_archive/2026-04-20/ARCHITECTURE.md](../doc/_archive/2026-04-20/ARCHITECTURE.md)** — изоляция, OIDC, state.  
3. **[infra/pulumi/README.md](../infra/pulumi/README.md) + `__main__.py`** — что уже создаётся в облаке.  
4. **[cli-console.md](cli-console.md)** — Pulumi, `gcloud`, включение API.

**Отложить до отдельной задачи** (чтобы не распыляться): детальная матрица 11 ролей × 6 учёток ([gcp-saas-access-matrix-11x6.md](gcp-saas-access-matrix-11x6.md)), CODEOWNERS, [prompt.md](prompt.md) **§9.6** hardening — это про зрелый enterprise-контур, не блокирует **фазу 1–2**.

---

## Enterprise-спека (когда понадобится)

Полная цель (VPC, мульти-пул GKE, OPA, Binary Authorization) — **[prompt.md](prompt.md) с §9**. Читать **после** рабочего MVP, переносить в Pulumi по мере появления требований.

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
