---
layout: page
title: Техническая документация
description: Монорепо Credit Scoring / HBG — VitePress
outline: [2, 3]
---

# Credit Scoring / HBG

## Слои документации (с чего начать)

Порядок: **[main](/ru/main)** → [упрощённые роли](/ru/simplified) → [архитектура](/ru/architecture) → [план](/ru/plan) → [приложение](/ru/appendix). **Сводка:** [одна страница](/ru/system-summary). **Внедрение:** **[INFRA-IMPLEMENTATION](/ru/INFRA-IMPLEMENTATION)**.

---

## Аннотация решения

**HBG Credit Scoring** — это проект автоматизации кредитного конвейера, где процесс принятия решения построен как инженерная система, а не как «один LLM-вызов».  
В основе — связка **Camunda 8 (BPMN/DMN)** + **FastAPI/LangGraph** + **RAG на Vertex AI** + **GKE/Pulumi**.

Что это даёт бизнесу и эксплуатации:

- **Прозрачный процесс** — шаги решения фиксируются в BPMN/DMN и могут быть объяснены/проверены.
- **Управляемый AI-слой** — LLM работает внутри процесса, с правилами и ограничениями, а не вместо них.
- **Аудитопригодность** — роли, доступы и действия трассируются; модель подходит под контрольные проверки.
- **Масштабируемость платформы** — инфраструктура разделена по жизненному циклу (`infra-core` / `infra-data` / `infra-runtime`).

## Философия проекта

- **Git как источник правды** — инженерные решения, IaC и документация версионируются и ревьюятся вместе.
- **Оркестрация вместо ad-hoc** — кредитный процесс явный и аудитопригодный (BPMN/DMN), AI встроен как контролируемый слой.
- **Least privilege и SoD** — доступ в GCP/GitHub выдаётся по ролям, а не по модели «всем админ».
- **Разделённый жизненный цикл** — сеть, данные и runtime меняются независимо, с меньшим blast radius.

## Как читать документацию

### 1) Сюжетная линия (смысл → детали)

- **[main](/ru/main)** — что за система, короткая модель, схема.
- **[simplified](/ru/simplified)** — четыре роли и зоны ответственности.
- **[architecture](/ru/architecture)** — компоненты, поток данных, решения.
- **[plan](/ru/plan)** — фазы, эволюция, жизненный цикл.
- **[приложение](/ru/appendix)** — индекс углублённых страниц.

### 2) Старт внедрения

- **[INFRA-IMPLEMENTATION](/ru/INFRA-IMPLEMENTATION)** — основной порядок фаз и точка входа.
- **[architecture](/ru/architecture)** — архитектурная схема, границы контуров и поток данных.
- **[infra-pulumi-iac](/ru/infra-pulumi-iac)** — Pulumi, `stackRole`, split-стеки, OIDC.

### 3) Операции и debug

- **[cli-console](/ru/cli-console)** — рабочие команды `gcloud`, Pulumi, `kubectl`.
- **[ml-data-rag](/ru/ml-data-rag)** — контур RAG/Vertex и переменные backend.
- **[toc](/ru/toc)** — полное оглавление сайта.

### 4) Governance (после MVP)

- **[gcp-saas-access-matrix-11x6](/ru/gcp-saas-access-matrix-11x6)** — роли и границы доступа к GCP.
- **[team-11x6-organization](/ru/team-11x6-organization)** — модель команды, персоны и SDLC.
- **[github-codeowners-matrix](/ru/github-codeowners-matrix)** — ревью и ответственность в GitHub.

## Репозиторий

- **GitHub:** [kwazar-0/credit-scoring-camunda](https://github.com/kwazar-0/credit-scoring-camunda)
- **Именование/remote:** [naming](/ru/naming)

---

**Языки:** [Polski (по умолчанию)](/pl/) · [English](/en/) · [ADR](/adr)
