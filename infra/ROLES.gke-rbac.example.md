# GKE: пример матрицы IAM + RBAC (без реальных email)

Связь с 11 [логическими ролями](ROLES.md#полный-список-ролей): персона **OWNER / ADMIN** ≈ *devops/sre*; **DEVOPS** ≈ *devops/sre*; **DEV-*** ≈ *dev-developer*; **QA-TEST** ≈ *dev-tester* / *ref-tester*; **AUDIT** ≈ *security/compliance* (частично). Подставьте свои идентификаторы (Google accounts), регион (**по политике проекта: `europe-central2`**) и имя кластера.

## 1. GCP IAM (пример)

| Персона | Principal (пример) | Типичный `roles/*` |
|---------|--------------------|--------------------|
| OWNER | `owner@example.com` | `roles/owner` (только владельцы облака) |
| ADMIN | `platform-admin@example.com` | `roles/container.admin` или суженный custom |
| DEVOPS | `devops@example.com` | `roles/container.developer` (или `container.admin` в dev) |
| DEV-* / QA / AUDIT | `...` | `roles/container.viewer` — детальные права в namespace задаёт K8s RBAC |

## 2. Namespaces

Имена согласуйте с [README](../README.md) / манифестами в `k8s/` (например `credit-dev`, `credit-ref`, `credit-prod`).

## 3. RBAC

Роли `Role` / `RoleBinding` лучше оформлять **манифестами** в `k8s/` и применять через GitOps/CI, а не одноразовыми `kubectl create` (воспроизводимость, аудит).

Проверка:

```bash
gcloud container clusters get-credentials <CLUSTER> --region <europe-central2> --project <PROJECT>
kubectl auth can-i get pods -n credit-dev --as=user@example.com
```

## 4. Секреты

Рабочие email и настоящие cluster names не храните в публичном репозитории — используйте **локальный** файл `ROLES.gke-rbac.local.md` (см. `.gitignore`).
