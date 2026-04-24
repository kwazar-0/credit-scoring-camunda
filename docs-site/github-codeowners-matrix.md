# CODEOWNERS: 11 ролей и 6 учётных записей GitHub

Документ связывает **логические роли** (см. [gcp-saas-access-matrix-11x6.md](gcp-saas-access-matrix-11x6.md) и [prompt.md](prompt.md) §9) с **шестью пользователями GitHub**, которые участвуют в ревью через [`.github/CODEOWNERS`](https://github.com/OlehKondratow/credit-scoring-camunda/blob/develop/.github/CODEOWNERS).

Форк для примера: [kwazar-0/credit-scoring-camunda](https://github.com/kwazar-0/credit-scoring-camunda). Логины ниже должны совпадать с реальными `@username` на GitHub; при смене ника обновите и этот файл, и `CODEOWNERS`.

### Как 11 ролей укладываются в 6 учёток

**Роль** в `ROLES.md` — это *функция и границы доступа* (для аудита и политики). **Учётка** — конкретный человек в IdP/GitHub/GCP. Поэтому **не** нужно 11 логинов: одна учётка **совмещает** несколько ролей, если это не нарушает *separation of duties* у вас в банке.

| Роли, которым **не нужна** отдельная git-учётка | Почему |
|-----------------------------------------------|--------|
| **5 — prod-tester** | Работа через UI (Tasklist, Streamlit), тестовые данные; не ревью кода. |
| **6 — prod-user** | Только продукт; нет доступа к репозиторию. |
| **8 — break-glass** | Не «вечный» логин: временное повышение по runbook (часто те же люди, что **1 — devops/sre**, по дежурству). |

Остальные **8 ролей** (1–4, 7, 9–11) распределяются по **шести людям** — ниже обратная матрица: *одна учётка → какие роли она закрывает* (пример для текущего `CODEOWNERS`; подставьте свои фамилии/обязанности).

| Учётка | Какие из 11 ролей закрывает (пример) |
|--------|--------------------------------------|
| **U1** `@kwazar-0` | **1** devops/sre, часть **7** (вместе с U4), контакт **8** on-call, часть **9** (release с U2) |
| **U2** `@OlehKondratow` | **2** dev-developer, **11** ML Engineer, часть **9** release, часть **10** data (с U5) |
| **U3** `@tempb59-commits` | **3** dev-tester, **4** ref-tester |
| **U4** `@geraltwilkbialy-cloud` | **7** security/compliance (основной фокус политик) |
| **U5** `@olehkondracki-prog` | **10** data-engineer, поддержка **2** и **11** в зоне данных |
| **U6** `@tempb418-ux` | **1** co-platform (второй голос по CI/infra с U1), без дублирования владельца облака |

Если в организации **release-manager** или **security** должны быть *строго разные люди* (SOX и т.д.), переназначьте **9** или **7** на другого члена команды или заведите седьмую учётку только под этот контроль — это уже политика банка, не ограничение Git.

## Шесть учётных записей GitHub

| # | GitHub | Типичный фокус в матрице ролей |
|---|--------|--------------------------------|
| U1 | `@kwazar-0` | Платформа, владелец форка, инциденты IaC |
| U2 | `@OlehKondratow` | Разработка приложения, ML/RAG, релизный код |
| U3 | `@tempb59-commits` | QA (dev/ref), процессы в BPMN/DMN с точки зрения тестирования |
| U4 | `@geraltwilkbialy-cloud` | Security / compliance (политики, чувствительные документы) |
| U5 | `@olehkondracki-prog` | Data / пайплайны, поддержка разработки |
| U6 | `@tempb418-ux` | Co-platform: CI/CD, второй голос по `infra`/`k8s` |

## Одиннадцать ролей → кто из шести участвует в ревью кода

| # | Роль (как в ROLES.md) | Первичные владельцы ревью (GitHub) | Примечание |
|---|------------------------|-------------------------------------|------------|
| 1 | devops / sre / cloud-eng | U1, U6 | `infra/`, `k8s/`, корневой `Makefile`, `docker-compose` |
| 2 | dev-developer | U2, U5 | `backend/`, `worker/`, `ui/` |
| 3 | dev-tester | U3 | Совместно на `bpmn/`, `dmn/`; CI — U3, U1, U6 |
| 4 | ref-tester | U3 | Те же зоны процессов; релизные ветки по [git-workflow.md](git-workflow.md) |
| 5 | prod-tester | — | Нет путей в git: UAT через приложение |
| 6 | prod-user | — | Нет доступа к репозиторию |
| 7 | security / compliance | U4, U1 | `SECURITY.md`, корневые политики `*.md` (совместно) |
| 8 | break-glass (инцидент) | U1 | Не рутинный CODEOWNER; runbook вне этого файла |
| 9 | release-manager | U2, U1 | Теги `v*`, согласование через CI/Environment |
| 10 | data-engineer | U5, U2 | `data/` (ingest, выгрузки) |
| 11 | ML Engineer | U2, U5 | Модели/RAG рядом с backend и `data/` |

**Итог:** в Git не создаётся 11 команд — шесть людей покрывают ревью по зонам репозитория; роли 5–6 и 8 не требуют отдельных строк в `CODEOWNERS`.

## Связь с GitHub Teams (организация)

При переносе в **GitHub Organization** замените строки в `CODEOWNERS` на `@org/team-name` по [github-setup.md](github-setup.md); матрица «роль → team» остаётся в `ROLES.md`.
