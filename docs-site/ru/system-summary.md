---
title: "Сводка системы (одна страница)"
description: "Архитектура, governance и ответственность в одном месте — HBG Credit Scoring."
---

# Сводка системы (одна страница)

**HBG Credit Scoring** — **монорепо** **демо/тренинга** **автоматизированного кредитного контура**: **Camunda 8** (BPMN/DMN) оркестрирует; **FastAPI + LangGraph** и **Vertex AI** — когнитивный путь (RAG + LLM в рамках политики); **воркеры PyZeebe** исполняют задания; **GCP** (по умолчанию **europe-central2**) и **Pulumi** (стеки **infra-core** / **infra-data** / **infra-runtime**) — воспроизводимая инфраструктура. **VitePress** в `docs-site/` — SoT по документации; `doc/_archive/` **только история**.

---

## Архитектура (сжатие)

| Аспект | Выбор | Примечание |
|--------|--------|------|
| Процесс | Camunda 8, BPMN + **DMN** | Этапы, human tasks, шаги в аудите — не только «поток в коде». |
| Приложение / AI | `backend/`, `worker/` | PII: маскировать до внешнего LLM; выровняйтесь с `pii` в backend. |
| Данные | GCS, BQ, опционально Cloud SQL / вектор | RAG: [ml-data-rag](/ru/ml-data-rag). |
| Рантайм | GKE **Standard** | ADR и [architecture](/ru/architecture) — Autopilot / SaaS. |
| IaC | Pulumi, split | `stackRole` и порядок — [infra-pulumi-iac](/ru/infra-pulumi-iac). |

**Поток данных (схема):** запрос → API / граф → Zeebe → retrieval и LLM → Camunda, задачи → логи / BQ (без **PESEL** в логах в открытом виде).

**Целостность (не сливать):** **DMN** (правила) · **Camunda** (оркестрация) · **сервисы/воркеры** (исполнение) · **Pulumi/GCP** (инфраструктура) — четыре уровня.

---

## Модель governance

- **Git** — инженерные решения, IaC и доки ревьются вместе.  
- **Least privilege** — не у всех admin; доступ через **роли** (четыре — [simplified](/ru/simplified)).  
- **11×6** — одиннадцать аспектов × **шесть** **аккаунтов** в GCP, плюс GitHub/CODEOWNERS; детали [gcp-saas-access-matrix-11x6](/ru/gcp-saas-access-matrix-11x6) и [team-11x6-organization](/ru/team-11x6-organization).  
- **Философия (полный текст):** [system-philosophy-governance](/ru/system-philosophy-governance).

---

## Кто за что

- **Business** — замысел скоринга и риск-политика; **DMN** и продуктовые правила — совместно.  
- **Engineers** — сервисы, воркеры, тесты; не «обходить» процесс ради удобства.  
- **Platform** — сеть, кластер, Pulumi, IAM, релизы.  
- **Operators** — мониторинг, инциденты, SLO; изменения по **plan** и **access**, не ad-hoc shell.

**Слойное чтение:** [main](/ru/main) → [simplified](/ru/simplified) → [architecture](/ru/architecture) → [plan](/ru/plan) → [appendix](/ru/appendix).

> [REORG-CHANGE-REPORT](/REORG-CHANGE-REPORT) — отчёт о введении структуры. · [English](/en/system-summary) · [Polski](/pl/system-summary)
