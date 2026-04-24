# Документация — оглавление

**Начните с:** **[INFRA-IMPLEMENTATION.md](INFRA-IMPLEMENTATION.md)** — единая дорожная карта: Camunda + AI scoring, фазы, что читать, что отложить.

---

## Трек A — инфраструктура и облако (основной фокус)

| Документ | Назначение |
|----------|------------|
| [INFRA-IMPLEMENTATION.md](INFRA-IMPLEMENTATION.md) | Фазы, порядок работ, ссылки — **точка входа** |
| [prompt.md](prompt.md) §1–8 | Handoff, продукт, план, пути в репо |
| [../2026-04-20/ARCHITECTURE.md](../2026-04-20/ARCHITECTURE.md) | Проекты, namespaces, OIDC, state |
| [../../infra/README.md](../../infra/README.md) | Pulumi: каталог, ссылки |
| [cli-console.md](cli-console.md) | `gcloud`, Pulumi, Docker, `kubectl` |
| [ml-data-rag.md](ml-data-rag.md) | Vertex, эмбеддинги, env backend |
| [../scripts/gcp-enable-apis-iam.sh](../scripts/gcp-enable-apis-iam.sh) | Включение GCP API (CLI) |

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
| [../2026-04-20/ROLES.md](../2026-04-20/ROLES.md) | 11 ролей, GCP/Pulumi/K8s/Git, пошаговые этапы |
| [gcp-saas-access-matrix-11x6.md](gcp-saas-access-matrix-11x6.md) | 11 ролей × сервисы GCP, 6 учёток |
| [github-codeowners-matrix.md](github-codeowners-matrix.md) | Роли ↔ GitHub, CODEOWNERS |
| [accounts.md](accounts.md) | Канонический remote; local PII в `accounts.local.md` (gitignore) |
| [prompt.md](prompt.md) §9+ | Enterprise blueprint, hardening (EN), SoD |

## Прочее

| Документ | Назначение |
|----------|------------|
| [prompt.md](prompt.md) | **Длинный:** §1–8 = handoff; §9+ = расширенная спека — не читать подряд при старте инфраструктуры |

---

**Корневой [README.md](../../../README.md)** даёт краткий обзор репозитория и ссылку сюда.
