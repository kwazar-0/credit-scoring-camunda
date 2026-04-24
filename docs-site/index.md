---
layout: home

hero:
  name: Handlowy Bank Galicyjski (HBG)
  text: Camunda 8 + AI credit pipeline
  tagline: >-
    Монорепо: FastAPI + LangGraph, PyZeebe, Streamlit, Pulumi (GCP, europe-central2), RAG и Vertex AI.
    Ниже — быстрый обзор; детальная схема в разделе «Архитектура».
  image:
    src: /images/hbg-bf1.png
    alt: Handlowy Bank Galicyjski
  actions:
    - theme: brand
      text: Архитектура
      link: /architecture
    - theme: brand
      text: Дорожная карта (infra)
      link: /INFRA-IMPLEMENTATION
    - theme: alt
      text: Оглавление
      link: /toc

features:
  - icon: 🏦
    title: Процесс и оркестрация
    details: Zeebe, BPMN/DMN, воркеры в worker/ — детерминизм бизнес-шагов вместо «одного чата».
  - icon: 🧠
    title: Vertex AI и RAG
    details: Эмбеддинги, поиск, LLM (Gemini) в backend/; политика PII в коде. См. ml-data-rag, hbg-rag-dominance.
  - icon: 🏛
    title: Облако и IaC
    details: Pulumi, GKE, OIDC, split-стеки, CLI — INFRA-IMPLEMENTATION и infra-pulumi-iac (канон).
  - icon: 🖥
    title: API и UI
    details: backend/ (HTTP, граф), ui/ (Streamlit) — граница ответственности по .cursorrules.
  - icon: 📋
    title: Роли и найм
    details: Матрица U1–U6, вакансии и RACI — hr-offers-hbg; матрица GCP — gcp-saas-access-matrix-11x6.
  - icon: 🔗
    title: Репозиторий
    details: Исходники и CI на GitHub; витринная документация собирается из docs-site/ (VitePress).
---

## О проекте

Репозиторий — **учебно-демонстрационный** контур **кредитного решения** с **Camunda 8** (оркестрация), **Vertex AI** (RAG, генерация) и **GCP**. Регион по умолчанию для IaC: **europe-central2**. Полный разбор слоёв, таблица компонентов и поток данных — на странице **[Архитектура](/architecture)**.

| Куда пойти | Документ |
|------------|----------|
| С чего начать внедрение | [INFRA-IMPLEMENTATION](INFRA-IMPLEMENTATION) — фазы, Camunda+AI, ссылки |
| Pulumi, GKE, OIDC | [infra-pulumi-iac](infra-pulumi-iac) |
| ML, эмбеддинги, env | [ml-data-rag](ml-data-rag) |
| Стратегия HBG, роли U* | [hbg-rag-dominance](hbg-rag-dominance) |
| Команды gcloud / kubectl | [cli-console](cli-console) |
| Полный список страниц | [toc](toc) |

> Другие языки: [English](/en/) · [Polski](/pl/)