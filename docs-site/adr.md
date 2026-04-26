---
layout: page
title: ADR (сводка по сайту)
description: Инженерные решения, мультиязычные оглавления
outline: [2, 3]
---

# ADR — сводка по репозиторию

Канон в Git: архитектура, IaC, роли и доступ. Документация в `docs-site/`, код и `infra/` — в репозитории; `doc/_archive/` в сборку не входит. Языки: [PL](/pl/) (по умолчанию), [RU](/ru/), [EN](/en/).

## Назначение

Здесь собрана актуальная документация монорепозитория (учебно-демонстрационный контур). Источник правды — каталог **`docs-site/`** вместе с кодом и **`infra/`**; материалы в **`doc/_archive/`** исторические и не входят в эту сборку VitePress.

---

## Инженерные решения: варианты, критерии, выбор

Ниже — сжатый аналог ADR на уровне всего сайта. Подробные схемы, команды и фазы: [Архитектура (PL)](/pl/architecture), [Архитектура (RU)](/ru/architecture), [Architecture (EN)](/en/architecture); IaC: [infra-pulumi-iac](/pl/infra-pulumi-iac) / [RU](/ru/infra-pulumi-iac) / [EN](/en/infra-pulumi-iac); дорожная карта: [INFRA-IMPLEMENTATION](/pl/INFRA-IMPLEMENTATION) и зеркала.

| Тема | Что рассматривали | Критерии выбора | Зафиксированный выбор | Когда пересмотреть |
|------|-------------------|-----------------|------------------------|---------------------|
| **Границы изменений в облаке** | один Pulumi-проект и один `pulumi up` «на всё» vs **разделение state** по жизненному циклу | blast radius, частота релизов runtime vs редкие изменения сети и долгоживущие данные | Роли стека `credit-scoring:stackRole`: **`infra-core`**, **`infra-data`**, **`infra-runtime`** (+ опционально песочница **`gke-infra`**) | Один маленький pet-дев допускает **`legacy`**; рост команд или разделение владения state — повод ужесточить split или вынести IaC в отдельные репозитории |
| **Кластер под Camunda / Zeebe** | GKE Autopilot vs **Standard** | сетевой контроль, совместимость с типовым развёртыванием Camunda 8, предсказуемость PSA/VPC | **GKE Standard** (не Autopilot как дефолт для этого контура) | Команда готова принять ограничения Autopilot после проверки Helm/PSA; или переход на **управляемый** SaaS-контур Camundy |
| **Оркестрация vs «умный скрипт»** | только код с вызовами LLM vs **BPMN/DMN + workers** | аудитопригодность этапов, human task, смена модели без переписывания схемы процесса | **Camunda 8** + воркеры в `worker/`; UI без единственной копии бизнес-логики | Регуляторика/бизнес согласны на **код + журнал** без BPMN как артефакта; или домен чисто «real-time scoring» без длительных процессов |
| **Когнитивный слой** | облачный LLM «в вакууме» vs **RAG + политика PII** | объяснимость, привязка к артефактам, снижение утечек чувствительных данных | **Vertex AI** (эмбеддинги, RAG, Gemini) в `backend/`; маскирование PII до внешних LLM | Жёсткий multi-cloud / конкретная модель только у внешнего API — тогда шлюз, отдельные DPA и усиленное маскирование |
| **Канон документации** | внешняя wiki без версии в git vs **репозиторий** | ревью вместе с кодом/IaC, воспроизводимость, CI | **VitePress** в `docs-site/`, публикация из репозитория | Корпоративный Confluence как SoT для compliance — тогда нужна явная синхронизация и владелец, иначе дрейф |
| **Мультиязычность** | один язык в корне vs **префиксы локалей** | предсказуемые URL на GitHub Pages, явный язык по умолчанию | **`/pl/` по умолчанию** (корень `/` перенаправляет); полная трёхъязычная сводка — **эта страница**; также **`/ru/`**, **`/en/`** | Смена дефолтной локали или отказ от полного зеркалирования — только осознанно (битые ссылки, SEO) |
| **Регион GCP** | «ближайший доступный» vs **явный EU** | соответствие ожиданиям по резидентности данных для EU-сценария | По умолчанию **`europe-central2`**; смена региона — только осознанно | Юридическое требование к другому региону; недоступность квоты Vertex — тогда оценка другого EU-региона с пересмотром latency и стоимости |

**Осознанно не делаем по умолчанию:** смешивать `pulumi up` основого стека и песочницы **`gke-infra`** в одном проекте без плана пересечения VPC/PSA/SQL; выдавать широкие роли «всем Editor» вместо матрицы доступа; хранить канон процесса только в неформализованных чатах без BPMN.

**Связанные развёрнутые обсуждения:** [архитектура (RU)](/ru/architecture), [architecture (EN)](/en/architecture), [architektura (PL)](/pl/architecture) — раздел про компромиссы; дорожная карта: [INFRA-IMPLEMENTATION](/ru/INFRA-IMPLEMENTATION) (и EN/PL) — порядок фаз и отвергнутые перестановки.

---

### English (summary)

This site is the **versioned** companion to the repo: architecture, Pulumi split stacks, roles (U1–U6) and GCP access patterns. Historical notes stay under `doc/_archive/` and are **not** built here. **Default locale:** Polish (`/pl/`). For the same decision table in prose, start from **[Architecture](/en/architecture)** and **[infra-pulumi-iac](/en/infra-pulumi-iac)**.

### Polski (skrót)

Witryna to **kanoniczna** dokumentacja monorepo (VitePress), spójna z kodem i `infra/`. Archiwum w `doc/_archive/` **nie** jest częścią builda. **Domyślnie:** **[Architektura](/pl/architecture)**, **[infra-pulumi-iac](/pl/infra-pulumi-iac)**.

---

**Оглавления:** [Русский](/ru/toc) · [English](/en/toc) · [Polski](/pl/toc)

**Действия (язык):** [Polski](/pl/) · [Русский](/ru/) · [English](/en/)
