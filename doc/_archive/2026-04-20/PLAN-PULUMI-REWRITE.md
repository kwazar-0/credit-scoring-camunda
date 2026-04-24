# План: новый Pulumi в `infra/` (исторический документ)

*Перенесён в этот каталог вместе с `infra/temp/`. Код: **`../../infra/pulumi/`**; этот план — справка о намерениях, часть шагов уже сделана.*

## Источники требований (прочитать до кода)

| Документ | Содержимое |
|----------|------------|
| [`../../infra/prompt.md`](../../infra/prompt.md) | Указатель → в этом каталоге: [`./prompt-system-architecture.md`](./prompt-system-architecture.md) — контуры, OIDC, Policy as Code, стеки, GKE, данные, RBAC, audit |
| [`../2026-04-21/manual.md`](../2026-04-21/manual.md) | Навигация → [`./doc-archive-manual-secure-v2.md`](./doc-archive-manual-secure-v2.md) — branch protection, Environments, WIF, разделение стеков, практика |

## Состояние (на момент фиксации)

- **Актуальный Pulumi:** [`../../infra/pulumi/`](../../infra/pulumi/) и [`../../infra/pulumi/gke-infra/`](../../infra/pulumi/gke-infra/) — `Pulumi.yaml`, `__main__.py` (роли `stackRole`), WIF.
- **Снимок сравнения:** папка [`./pulumi-snapshot-legacy/`](./pulumi-snapshot-legacy/) (не для prod `pulumi up`).

## Порядок работ (предлагаемый — на будущее)

1. Сверить `pulumi-snapshot-legacy` с текущим `../../infra/pulumi/` при смене state.
2. Минимум по manual: WIF, API, GCS/BQ/AR, затем GKE/сеть — по фазам из [`./doc-archive-manual-secure-v2.md`](./doc-archive-manual-secure-v2.md).
3. **Policy as Code** (OPA / Sentinel) — согласно [`./prompt-system-architecture.md`](./prompt-system-architecture.md) §4, когда появятся критерии.

## Примечание

Перенос **только** каталога `pulumi/` вверх (слияние `infra/pulumi` → `infra`) требует обновить **все** относительные импорты, `Pulumi` backend и `npm`/docs ссылки. Делайте одним PR с поиском `infra/pulumi` по репо.
