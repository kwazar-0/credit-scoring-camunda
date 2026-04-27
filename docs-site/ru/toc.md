# Документация — оглавление

**Начните с:** **[INFRA-IMPLEMENTATION.md](INFRA-IMPLEMENTATION.md)** — единая дорожная карта: Camunda + AI scoring, фазы, что читать, что отложить.

---

## Трек A — инфраструктура и облако (основной фокус)

| Документ | Назначение |
|----------|------------|
| [system-philosophy-governance.md](system-philosophy-governance.md) | Философия системы и governance (pełny/przeniesiony tekst z root README) |
| [architecture.md](architecture.md) | **Архитектура репозитория:** контура, стек, поток данных, пути в монорепо |
| [INFRA-IMPLEMENTATION.md](INFRA-IMPLEMENTATION.md) | Фазы, порядок работ, ссылки — **точка входа** |
| [prompt.md](prompt.md) §1–8 | Handoff, продукт, план, пути в репо |
| [infra-pulumi-iac.md](infra-pulumi-iac.md) | Pulumi, `stackRole`, OIDC, split-стеки — **канон IaC** |
| [`infra/README.md` (в репо)](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/infra/README.md) | **Pet-project bootstrap:** billing, IAM, GCS state, `infra-core` / split-стеки, частые ошибки |
| [gke-infra (песочница) →](infra-pulumi-gke-sandbox.md) | Отдельный Pulumi-проект (тот же регион по умолчанию; не смешивать VPC/state с основым стеком) |
| [cli-console.md](cli-console.md) | `gcloud`, Pulumi, Docker, `kubectl` |
| [ml-data-rag.md](ml-data-rag.md) | Vertex, эмбеддинги, env backend |
| [hbg-rag-dominance.md](hbg-rag-dominance.md) | HBG: стратегия платформы, роли U1–U6 |
| [hr-offers-hbg.md](hr-offers-hbg.md) | HBG: вакансии, RACI, 11 этапов, матрица 6×11 |
| [../scripts/gcp-enable-apis-iam.sh](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/scripts/gcp-enable-apis-iam.sh) | Включение GCP API (CLI) |

## Трек B — Git, GitHub, соглашения

| Документ | Назначение |
|----------|------------|
| [git-workflow.md](git-workflow.md) | Ветки `develop` / `main`, `release/*`, теги |
| [github-setup.md](github-setup.md) | Branch protection, Environments |
| [branch-notes.md](branch-notes.md) | Legacy-ветки, пояснения |
| [naming.md](naming.md) | Имена репо, теги |

## Трек C — governance, роли, доступ (после MVP или по запросу аудита)

| Документ | Назначение |
|----------|------------|
| [team-11x6-organization.md](team-11x6-organization.md) | **Команда 11×6:** концепция (слои, SoD, SDLC), ссылки на **шесть персон** с полным циклом разработки |
| [team-persona-ok-admin.md](team-persona-ok-admin.md) · [gw-devops](team-persona-gw-devops.md) · [ux-dev](team-persona-ux-dev.md) · [sh-dev](team-persona-sh-dev.md) · [pk-qa](team-persona-pk-qa.md) · [ok-audit](team-persona-ok-audit.md) | Одна страница на учётку: мандат, фазы SDLC, GitHub/GCP, взаимодействия, антипаттерны |
| [gcp-saas-access-matrix-11x6.md](gcp-saas-access-matrix-11x6.md) | 11 ролей × сервисы GCP, 6 учёток; пошаговые сценарии — [prompt](prompt.md) §9 |
| [github-codeowners-matrix.md](github-codeowners-matrix.md) | Роли ↔ GitHub, CODEOWNERS |
| [accounts.md](accounts.md) | Канонический remote; local PII в `accounts.local.md` (gitignore) |
| [prompt.md](prompt.md) §9+ | Enterprise blueprint, hardening (EN), SoD |

## Прочее

| Документ | Назначение |
|----------|------------|
| [prompt.md](prompt.md) | **Длинный:** §1–8 = handoff; §9+ = расширенная спека — не читать подряд при старте инфраструктуры |

---

**Корневой [README.md](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/README.md)** даёт краткий обзор репозитория и ссылку сюда.

> Другие языки: [English (table of contents)](/en/toc) · [Polski (spis treści)](/pl/toc)
