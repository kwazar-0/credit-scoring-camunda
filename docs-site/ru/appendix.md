---
title: "Приложение (детали и ссылки)"
description: "Индекс глубинных и справочных страниц (уровень 4)."
---

# Приложение (уровень 4)

Когда нужна **детализация**: персоны, CLI, RAG, длинный handoff, enterprise hardening. **Сюжет:** [main](/ru/main) → [simplified](/ru/simplified) → [architecture](/ru/architecture) → [plan](/ru/plan).

---

## A — Продукт и длинный handoff

| Страница | Когда |
|------|--------|
| [main](/ru/main) | Вход: производственный поток, компромиссы, ссылки на ops. |
| [system-philosophy-governance](/ru/system-philosophy-governance) | Полный текст governance; enterprise / hardening. |
| [INFRA-IMPLEMENTATION](/ru/INFRA-IMPLEMENTATION) | **Единая** дорожка внедрения: фазы, команды, с чего начать. |

---

## B — ML, данные, стратегия

| Страница | Когда |
|------|--------|
| [ml-data-rag](/ru/ml-data-rag) | Vertex, эмбеддинги, env backend, vector path. |
| [hbg-rag-dominance](/ru/hbg-rag-dominance) | Стратегия платформы, U1–U6. |
| [hr-offers-hbg](/ru/hr-offers-hbg) | Вакансии, RACI, 11×6 в HR-формулировке. |

---

## C — Инфраструктура и эксплуатация

| Страница | Когда |
|------|--------|
| [infra-pulumi-iac](/ru/infra-pulumi-iac) | Pulumi, `stackRole`, OIDC, split — **IaC SoT** на сайте. |
| [cli-console](/ru/cli-console) | `gcloud`, Pulumi, `kubectl`, Docker. |
| [infra-pulumi-gke-sandbox](/ru/infra-pulumi-gke-sandbox) | Опциональное Pulumi `gke-infra`; не смешивать state с основными стеками. |
| [camunda-gke-deploy-modeler](/ru/camunda-gke-deploy-modeler) | Helm Camunda в GKE, namespaces, Ubuntu Desktop Modeler + port-forward. |
| [naming](/ru/naming) | Именование в репозитории. |

---

## D — Git и GitHub

| Страница | Когда |
|------|--------|
| [git-workflow](/ru/git-workflow) | Ветки, release. |
| [github-setup](/ru/github-setup) | Защита, среды. |
| [github-codeowners-matrix](/ru/github-codeowners-matrix) | Роли ↔ CODEOWNERS. |

---

## E — Governance и команда (11×6)

| Страница | Когда |
|------|--------|
| [system-philosophy-governance](/ru/system-philosophy-governance) | Философия (также с [main](/ru/main)). |
| [team-11x6-organization](/ru/team-11x6-organization) | Модель команды, SoD, SDLC. |
| [gcp-saas-access-matrix-11x6](/ru/gcp-saas-access-matrix-11x6) | 11 ролей × GCP × 6 аккаунтов. |
| **Персоны** | [ok-admin](/ru/team-persona-ok-admin) · [gw-devops](/ru/team-persona-gw-devops) · [ux-dev](/ru/team-persona-ux-dev) · [sh-dev](/ru/team-persona-sh-dev) · [pk-qa](/ru/team-persona-pk-qa) · [ok-audit](/ru/team-persona-ok-audit) |

---

## F — ADR (отдельное дерево)

- [Индекс ADR](/adr) — зафиксированные решения, часто в отсылках из [architecture](/ru/architecture).

**Полное оглавление:** [toc](/ru/toc).

> [English](/en/appendix) · [Polski](/pl/appendix)
