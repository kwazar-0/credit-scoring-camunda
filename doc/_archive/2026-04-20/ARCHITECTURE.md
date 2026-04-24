# Infrastructure: изоляция для нескольких разработчиков

Цель: **разделить риски** между людьми и средами, не дублируя без нужды весь GCP, и сохранить **предсказуемый** Pulumi + GitOps.

**Роли (DevOps, dev, тест, prod-user):** см. **`ROLES.md`**. Основной IaC: **`pulumi/`**.

---

## 1. Уровни изоляции (от сильной к мягкой)

| Уровень | Что отделяется | Когда использовать |
|---------|------------------|----------------------|
| **A. Отдельный GCP project** на команду / «песочницу» | Квота, биллинг, IAM, полный blast radius | Enterprise, строгий compliance, отдельный billing |
| **B. Один project, разные Pulumi stacks / backend state** (`dev` / `staging` / `prod`) | Разный конфиг и префикс state; разные SA в CI | Рекомендуемый минимум для prod vs non-prod |
| **C. Один GKE, namespace на среду** (`dev`, `staging`, `prod`) | Рабочие нагрузки и секреты | Экономия; нужны NetworkPolicy / RBAC |
| **D. Namespace на разработчика** `dev-<github>` | Изоляция preview/feature в shared dev-кластере | Быстрые итерации без второго кластера |

Практичный pet-проект: **B + C** (иногда **D** для «своей» песочницы в dev).

---

## 2. Рекомендуемая модель для команды

### Облако (GCP)

- **Один project** `my-camunda8-project` (или `…-dev` и `…-prod` — если готовы платить за два проекта).
- **Разные service account для CI** (пример имён): `ci-pulumi-dev@…` / `ci-pulumi-prod@…` — узкие роли на non-prod vs prod; prod — только из protected branch + approval.
- **State Pulumi:** `pulumi login` (SaaS или self-hosted) или backend в **GCS/S3** с префиксами по среде (`dev` / `prod`).
- **Не один ключ на всё:** GitHub Actions / Cloud Build → **OIDC → Workload Identity Federation**, без JSON в репо.

### IaC (Pulumi в `infra/pulumi/`)

- Конфиг стека: `pulumi config` (`gcp:project`, `credit-scoring:region`, `credit-scoring:clusterName`, …).
- Опционально **`k8s_namespace`** / labels с **`environment`**, **`developer_id`** — учёт и фильтры в консоли (см. доки Pulumi и `ROLES.md`).
- **Workload Identity** для приложений (GSA ↔ K8s SA) — согласовать с namespace в манифестах (`k8s/hbg/`). Референс по идее: `workload_identity_github.py`, Terraform в репо **не** хранится.

### Приложения (K8s)

- **Kustomize overlays:** `overlays/dev`, `overlays/prod` — только отличия (image tag, replicas, env).
- **Не применять prod из feature-ветки:** в CI — `pulumi preview` на PR, apply в prod только с `main` + review.

### GitOps (по желанию)

- **Argo CD / Flux** — манифесты приложений; базовая платформа (GKE, сеть, GCS, AR) — **Pulumi** (`infra/pulumi/`, при необходимости `infra/pulumi/gke-infra/`).

---

## 3. Что НЕ дублировать на каждого разработчика

- Один **shared dev-кластер** + namespaces дешевле, чем GKE на человека.
- Один **Artifact Registry** с путём образа `…/credit-backend:dev-<sha>` — достаточно; отдельный registry на dev обычно избыточен.

---

## 4. Конфигурация Pulumi

См. **`infra/pulumi/README.md`**, `pulumi config` в `Pulumi.*.yaml.example`, экспорты в `__main__.py`. Песочница GKE+SQL: **`infra/pulumi/gke-infra/`** и [docs-site/infra-pulumi-gke-sandbox.md](../docs-site/infra-pulumi-gke-sandbox.md).

---

## 5. Краткий чеклист безопасности

1. Раздельный **state** для prod и non-prod.  
2. Разные **SA** / роли CI для dev и prod.  
3. **Branch protection** + обязательный **`pulumi preview`** в PR.  
4. **Namespace + RBAC + ResourceQuota** в shared GKE.  
5. Секреты — **Secret Manager** / External Secrets, не в Git.
