# Архитектура и назначение репозитория

Репозиторий **Credit-Scoring / HBG** (Handlowy Bank Galicyjski) — **учебный/демонстрационный** стек: автоматизированный кредитный сценарий с оркестрацией (Camunda 8), RAG и генеративными моделями (Vertex AI / Gemini) и облачной инфраструктурой (GCP, по умолчанию **europe-central2**). См. также [HBG: стратегия RAG-DOMINANCE](hbg-rag-dominance.md) и [ml-data-rag](ml-data-rag.md).

**Границы кода (монорепо):**

| Область | Каталог | Назначение |
|---------|---------|------------|
| API и граф анализа | `backend/` | FastAPI, LangGraph, маршруты, интеграция с Vertex |
| Zeebe workers | `worker/` | PyZeebe, job type (например `ai-loan-analysis`) |
| Аналитик UI | `ui/` | Streamlit (не дублировать бизнес-логику) |
| IaC | `infra/pulumi/` + `infra/pulumi/gke-infra/` | Pulumi, split-стеки, при необходимости песочница GKE+SQL |
| K8s | `k8s/hbg/`, `k8s/camunda/` | манифесты и Helm values |
| Документация (канон) | `docs-site/` (этот сайт) | VitePress; устаревшее в `doc/_archive/` |

---

## Три контура (high level)

1. **Оркестрация** — Camunda 8 (BPMN/DMN, Zeebe, при необходимости Operate/Tasklist). Процесс жёстко фиксирует этапы; сбои и низкая уверенность модели ведут к human task или инциденту.
2. **Когнитивный слой** — Vertex AI: эмбеддинги, при необходимости Matching Engine / Vector Search, LLM (конфигурация модели — в `backend`, см. [ml-data-rag](ml-data-rag.md)).
3. **Память и артефакты** — GCS, BigQuery (аналитика/аудит), Cloud SQL (PostgreSQL) при включении в Pulumi; в приложении RAG-цепочка описана в `backend` и [ml-data-rag](ml-data-rag.md).

---

## Слой A: Camunda 8 (оркестрация)

- **BPMN** — путь заявки (см. `bpmn/`), **DMN** — детерминированные правила (`dmn/`), без лишних вызовов LLM.
- **Воркеры** — `worker/`, связь с API через Zeebe job workers.
- **Развёртывание** — Docker Compose для локалки; в облаке — GKE, см. [infra-pulumi-iac](infra-pulumi-iac.md) и [Helm: Camunda в репозитории](https://github.com/OlehKondratow/credit-scoring-camunda/blob/develop/k8s/camunda/README.md).

## Слой B: Vertex AI и LLM

- Вызовы к Gemini и вспомогательная логика — в `backend` (см. `app/services/`, PII — по политике репо, маскирование для внешних LLM).
- Включение API, IAM, регион — [infra-pulumi-iac](infra-pulumi-iac.md), [cli-console](cli-console.md).

## Слой C: RAG и данные

- **Индексация** — `data/ingest` и сценарии в [ml-data-rag](ml-data-rag.md).
- **Retrieval** — конфигурация в backend (Vertex Vector / fallback в коде), без сырых PII в логах.

---

## Таблица: компоненты и владельцы (ролевой смысл)

| Компонент | Технология | Смысловая роль (HBG U-роли) |
|-----------|-------------|-----------------------------|
| Облако | GCP (GKE, Cloud SQL, GCS, BQ, Vertex) | U1 — архитектура, политика региона |
| Кластер / релиз | GKE, Helm (Camunda), Pulumi | U2 — эксплуатация |
| Когнитивный дизайн / промпты | Vertex, LangChain | U3 — ML/промпты (в терминах [hr-offers-hbg](hr-offers-hbg.md)) |
| Данные и векторы | GCS, BQ, PostgreSQL/ pgvector (по пайплайну) | U4 — данные |
| Качество | PyTest, сценарии к процессу | U5 — тестирование |
| Аудит | BQ, логирование, политика доступа [gcp-saas-access-matrix-11x6](gcp-saas-access-matrix-11x6.md) | U6 — аудит |

---

## Поток данных (упрощённо)

1. Вход: HTTP API (`backend`) — заявка / анализ.
2. Zeebe: старт/продолжение процесса, job в `worker/`.
3. Retrieval: релевантные фрагменты политик/данных (RAG).
4. LLM: ответ/скоринг согласно графу и настройкам safety.
5. Камунда: фиксация состояния, human task при необходимости.
6. Учёт: агрегаты и метаданные — в BQ/логи по политике, без сырых PII.

---

## Почему «RAG-DOMINANCE»

Коротко: **BPMN/DMN** задают контур, **RAG+LLM** — объяснимые ответы с опорой на артефакты; **облако** — масштаб и смена модели без переписывания схемы процесса. Подробнее — [hbg-rag-dominance](hbg-rag-dominance.md).

---

**Далее:** дорожная карта внедрения — [INFRA-IMPLEMENTATION](INFRA-IMPLEMENTATION.md), операторская шпаргалка — [cli-console](cli-console.md), полный список страниц — [toc](toc.md).

> Другие языки: [English (architecture)](/en/architecture) · [Polski (architektura)](/pl/architecture)
