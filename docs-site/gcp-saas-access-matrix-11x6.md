# Чистовая матрица: 11 ролей доступа к сервисам GCP и 6 учёток

Согласовано с [`infra/ROLES.md`](https://github.com/OlehKondratow/credit-scoring-camunda/blob/develop/infra/ROLES.md), [`prompt.md`](prompt.md) §9.1–9.2 (в т.ч. **§9.2.1** — Vertex, BigQuery, GCS, Vector Search, Cloud SQL и IaC) и hardening §9.6. Регион по умолчанию: **`europe-central2`**.

## 1. Можно ли «11 ролей» при «6 пользователях»?

Да. **11** — это *логические роли* (обязанности и границы). **6** — это *люди* (учётки Google / членство в группах). Каждая учётка **несёт пакет** из нескольких ролей; роли **UAT** и **App** (прод) в основном **без** консоли GCP; **BG** (break-glass) — **событийная**, не постоянный профиль.

В **проде** (см. `prompt.md` §9.6) права в IAM и RBAC лучше выдавать **Google Groups** (одна учётка → одна или несколько групп), а не вешать 11 `roles/*` на одного человека вручную. Этот документ — **чистовая схема «что какая роль может в GCP»**; внедрение — через **группы** с такими же семантиками.

## 2. 11 ролей × ключевые «слои» GCP (SaaS-облако)

Колонки — типичные **области** (не исчерпывающий список API; детализация — custom IAM + политика орг-а).

| Слот | Роль | Resource Manager / IAM | GKE | Storage (GCS) | BigQuery | Vertex / Vertex AI Search | SecOps / logging | Artifacts (GAR) | Примечание |
|------|------|------------------------|-----|---------------|----------|----------------------------|------------------|-----------------|------------|
| **Platform** | devops / sre / cloud-eng | admin binding groups/SA, folders | admin / platform SA | согласование бакетов/labels | датасеты, интеграции | чтение/согласование, не data science | org-level logs, sinks | read/push per env | Pulumi, state, CI OIDC — ответственные |
| **Dev** | dev-developer | **нет** проектного Owner/Editor в prod (часто 0) | **dev** NS: high per policy | read/write **dev** префиксы | dev datasets | use endpoints **dev** | logs **dev** | pull/push **dev** | Основной код, не платформа |
| **Tst-dev** | dev-tester | обычно 0 | view **dev** (или 0) | list/read тест-данных | read jobs **dev** | 0 / read-only порталы | 0 / read **dev** | read | Через UI/CI, не Pulumi |
| **Tst-ref** | ref-tester | 0 / viewer staging | view или edit **ref** NS по политике | read **ref** | read **ref** | read inference **ref** | read **ref** | read **ref** | Регресс, не prod |
| **UAT** | prod-tester (UAT) | 0 | **нет** kubectl prod | 0 (данные — через приложение) | обычно 0; агрегаты по политике | 0 (UI приложения) | 0 / только audit UI | 0 | Только **Camunda / Streamlit** в prod |
| **App** | prod-user | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **Только** Tasklist/приложение (SSO) |
| **Sec** | security / compliance | security reviewer / org policy read | view **all** NS | metadata / policy | policy tags / audit | 0 / metadata | **audit logs**, sinks | read metadata | OPA/Gatekeeper policy — change через Git |
| **BG** | break-glass | **временно** PAM/ elevation | **временно** elevated | по runbook | по runbook | по runbook | по runbook | по runbook | Только тикет/окно, отзыв |
| **Release** | release-manager | viewer чтения версий/артефактов | 0 (или view) | 0 | 0 | 0 | 0 / релизные отчёты | 0 / read tags | **Approve** в GitHub Environment `production` — главный gate |
| **Data** | data-engineer | 0 / narrow SA alignment | 0 | object admin **data** бакетов | data editor + jobUser | 0, если не ML | 0 | 0 | Ingest, без GKE admin |
| **ML** | ML Engineer | 0 / narrow | 0/optional dev | read/write эмбеддингов | по необходимости | **aiplatform** + vector/index **dev**→promoted by CI | 0 | read | Без `container.admin` в prod (см. `ROLES.md`) |

*«0»* = нет прямого доступа в консоли; **не** ноль с точки зрения бизнес-процесса (есть UI приложения, Camunda, и т.д.).

## 3. Те же 11 ролей, упакованные в 6 учёток (пример)

Одна строка = один человек (учётка). Символ **•** = основная **логическая** роль на этом человеке; **○** = совместно; **on-call** у колонки **BG** = break-glass по событию. Реальные **IAM bindings** в проде — на **группу**, в которую человек входит.

**Колонки** — те же **слоты ролей**, что в §2. **BG** = break-glass; **OWNER** (вне таблицы) — владелец org/repo/политик форка; **не** строка пакетирования, но учитывается в согласованиях. Пример **логинов** с **ярлыком пакета** (IdP / группа; не путать с `roles/owner` в IAM):

| Учётка (логин · ярлык) | Platform | Dev | Tst-dev | Tst-ref | UAT | App | Sec | BG | Release | Data | ML |
|------------------------|:-:|:-:|:-:|:-:|:-:|:-:|:--:|:-:|:-:|:--:|:--:|
| **ok-admin** · **ADMIN** | • | | | | | | | | ○ | | |
| **gw-devops** · **DEVOPS** | • | | | | | | ○ | **on-call** | ○ | | |
| **ux-dev** · **DEV-UX** | | • | | | | | | | • | ○ | • |
| **sh-dev** · **DEV-SH** | | ○ | | | | | | | | • | • |
| **pk-qa** · **QA-TEST** | | | • | • | | | | | | | |
| **ok-audit** · **AUDIT** | | | | | | | • | | | | |

- **•** — основная зона. **○** — совместно / второй голос. **on-call** для **BG** — не отдельный логин, а роль, активируемая по runbook.
- **UAT** и **App** в таблице пусты: нет роли в GCP Console (доступ в продукте).
- Соответствие **примеров логинов** (в т.ч. **U1–U6** в `github-codeowners-matrix`) ↔ GitHub: [`github-codeowners-matrix.md`](github-codeowners-matrix.md).

## 4. Соответствие «4 GitHub Teams» из `prompt.md` §2

В System Prompt (matrix 11) предложено **4 группы** GitHub. Их удобно **наложить** на 6 людей: каждый входит в 1–2 team.

| GitHub Team (пример) | Какие логические роли (слоты) внутри |
|----------------------|--------------------------------------|
| `platform` | Platform, часть Sec, BG, часть Release, инжиниринг CI |
| `engineers` | Dev, Data, ML |
| `quality` | Tst-dev, Tst-ref, Release (release-approve) |
| `compliance` | Sec, опционально аудит Release (если SoD) |

`Business` (prod-user / prod-tester) — **не** в Git репо; `Incident` (break-glass) — **процедура**, не standing role.

## 5. Важно для аудита

- Не дублировать **Release** и **Sec** на **одного** человека, если внутренняя политика требует SoD; тогда **Sec** = отдельный сотрудник или отдельная группа.
- Для **строгого** hardening (§9.6): заменить широкие `roles/*` на **custom roles** + folder/project разделение **dev / ref / prod**.

## 6. Связанные файлы

- Детальная матрица GCP/Pulumi/K8s/Git: [`../infra/ROLES.md`](https://github.com/OlehKondratow/credit-scoring-camunda/blob/develop/infra/ROLES.md)
- Маппинг 11 → 6 для Git: [`github-codeowners-matrix.md`](github-codeowners-matrix.md)
- K8S RBAC пример: [`../infra/ROLES.gke-rbac.example.md`](https://github.com/OlehKondratow/credit-scoring-camunda/blob/develop/infra/ROLES.gke-rbac.example.md)
