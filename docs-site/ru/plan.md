---
title: "План и roadmap"
description: "Стратегия эволюции, фазы поставки и жизненный цикл компонентов; ссылка на инфра-трек."
---

# План и roadmap

**Уровень 3** — **как система развивается**. Подробные шаги оператора и «куда смотреть в коде» — [INFRA-IMPLEMENTATION](/ru/INFRA-IMPLEMENTATION) (единый трек). Здесь **фазы** связаны с **архитектурными слоями** и **governance**, без копии каждой команды.

---

## Стратегия эволюции

1. **Сначала фундамент** — проект GCP, API, Pulumi state, split-стеки, базовые артефакты (GCS, BQ, registry). *Без этого GKE и RAG не воспроизводимы.*
2. **Доверие к автоматизации** — CI в GCP (OIDC / WIF), без долгоживущих JSON-ключей в pipeline.
3. **Рантайм** — GKE (Standard), нагрузки, Workload Identity, namespace в духе `k8s/hbg/` и `k8s/camunda/`.
4. **Данные и когнитив** — RAG (GCS → ingest → эмбеддинги / vector search), чтобы поведение backend соответствовало реальным задержкам и лимитам, а не только мокам.
5. **Процесс в облаке** — BPMN/DMN, Zeebe, воркеры, секреты; сквозные тесты процесса.
6. **Зрелость** — observability, матрица доступа, CODEOWNERS, hardening (см. [system-philosophy-governance](/ru/system-philosophy-governance) и [appendix](/ru/appendix)).

**Отклонённый «шорткат»:** сначала Camunda и воркеры, RAG в конце — **высокий риск рефакторинга** при смене контрактов retrieval. В репозитории сначала **согласованный data path**, затем «готовность» процесса.

---

## Фазы (сводка)

| # | Фаза | «Готово» (коротко) | Детали |
|---|--------|----------------------|--------|
| 1 | Cloud + IaC (dev) | Pulumi up на **dev**, база ресурсов, state | [INFRA-IMPLEMENTATION](/ru/INFRA-IMPLEMENTATION), [infra-pulumi-iac](/ru/infra-pulumi-iac) |
| 2 | CI → GCP | Pipeline на OIDC, не ключи в репо | Workflows, `workload_identity_github.py` |
| 3 | GKE + images | Standard, образы в AR, WI для pod | [infra-pulumi-iac](/ru/infra-pulumi-iac), `k8s/hbg/` |
| 4 | RAG data | PDF → GCS → эмбеддинги, vector без мок-БД | [ml-data-rag](/ru/ml-data-rag), `data/` |
| 5 | Camunda в стеке | BPMN/DMN, стабильные воркеры с backend | `bpmn/`, `dmn/`, `worker/` |
| 6 | Наблюдаемость / policy | Логи, BQ, матрица, least privilege | [gcp-saas-access-matrix-11x6](/ru/gcp-saas-access-matrix-11x6) |

**Контур MVP (из handoff):** в приоритете **1 → 4**, затем **5** и E2E; **6** часто post-MVP.

---

## Жизненный цикл крупных компонентов

- **BPMN/DMN** — версионируются в репо; деплой с той же **дисциплиной ревью**, что и код; смена процесса = **первоклассное** изменение.
- **Backend / workers** — **монорепо**, чтобы согласовать job types и API; отдельные репо — только при отдельных release train (см. [architecture](/ru/architecture)).
- **Стеки Pulumi** — **infra-core** (медленно: VPC, PSA), **infra-data** (долгоживущие хранилища), **infra-runtime** (GKE, чаще); не один `up` на всё.
- **Модели** — Vertex in-region; внешние LFM — **шлюз** и PII-политика (см. `pii` в backend).

**Модель масштабирования:** воркеры и кластер — по throughput; RAG и BQ — по объёму доказательств; governance (роли, SDLC) — через **11×6**, а не ad-hoc admin.

---

## Терминология (согласованность)

- **Среды** — например **dev** / **stage** / **prod** (как в Pulumi — [naming](/ru/naming), [accounts](/ru/accounts)).
- **Stacks** — `stackRole` Pulumi; не смешивать с *процессом* Camunda и *namespace* Kubernetes без контекста.
- **Workflows** — экземпляры **Camunda** vs CI **GitHub Actions** — различать в runbook.

**Далее:** [appendix](/ru/appendix) · [main](/ru/main).

> [English](/en/plan) · [Polski](/pl/plan)
