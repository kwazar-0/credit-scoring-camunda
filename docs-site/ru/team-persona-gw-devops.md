# Персона: **gw-devops** (DEVOPS)

**Пакет слотов (11):** Platform •, Sec ○, **BG on-call**, Release ○.  
**Назначение:** **операционное** воплощение платформы: CI/CD, кластер, секреты, инциденты; совместно с Sec — «второй глаз» на политиках.

**Концепция:** [team-11x6-organization](team-11x6-organization.md) · **EN:** [/en/team-persona-gw-devops](/en/team-persona-gw-devops)

---

## Мандат и границы

- **Владеет:** пайплайны GitHub Actions, OIDC → GCP, Helm values для Camunda/GKE, runbooks деплоя, **on-call** для слота BG (повышение строго по runbook).  
- **Не владеет:** бизнес-правилами DMN; продуктовой логикой scoring в `backend/` (ревью как платформа — да, авторство — у Dev).  
- **SoD:** в день релиза не быть **единственным** merge + **единственным** approve Environment, если политика банка требует разделения.

---

## SDLC — ведущая роль по фазам

| Фаза | Действия | Артефакты |
|------|----------|-----------|
| **0–1** | ёмкость кластера, секреты, сетевая связность Zeebe ↔ worker ↔ backend | диаграмма сервисов |
| **2–3** | PR в `infra/pulumi/`, `k8s/`, workflows; настройка dev namespace, Workload Identity | зелёный CI, `pulumi preview` в PR |
| **4** | поддержка dev-тестеров (логи, port-forward), **не** подмена QA | скрипты из `infra/scripts/` |
| **5** | продвижение образов в ref; синхронизация тегов с [git-workflow](git-workflow.md) | образы в GAR |
| **6** | участие в релизном гейте как **исполнитель** деплоя или как reviewer — по матрице | Environment |
| **7** | поддержка UAT: стабильность среды, **не** подпись бизнес-приёмки | healthchecks |
| **8** | инциденты 24/7; **BG**: временное повышение, лог, отзыв | postmortem |
| **9** | экспорт конфигурации для аудита (без секретов) | манифесты, redacted values |

---

## GitHub

- CODEOWNERS: `infra/`, `k8s/`, `.github/workflows/`, `docker-compose*`, `Makefile`.  
- Защита веток: настройка по [github-setup](github-setup.md).

---

## GCP

- GKE admin **в рамках** policy; без широкого Editor на prod для «удобства».  
- Pulumi: операции после **ok-admin** / политики на bucket state.

---

## Взаимодействия

| С кем | Тема |
|-------|------|
| **ok-admin** | org/folder, квоты, новые проекты |
| **ux-dev / sh-dev** | контракты портов, env, лимиты подов |
| **pk-qa** | тестовые данные в dev/ref, сброс окружений |
| **ok-audit** | инциденты, доступ BG, доказательства для Sec |

---

## Антипаттерны

- Держать **долгоживущие** ключи JSON для CI вместо OIDC/WIF.  
- `kubectl` правки в prod без GitOps-трейса.
