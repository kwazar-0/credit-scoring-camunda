# Helm: Camunda Platform

**Закоммиченный профиль:** [`values-camunda-platform.user.yaml`](values-camunda-platform.user.yaml) — лёгкая песочница: Zeebe 1/1/1, ES 1×20 Gi, Operate + Tasklist, без Identity/Keycloak/Optimize/Connectors, образы **`8.6.1`**, chart **`11.12.2`**.

## Установка (как в репо)

```bash
helm repo add camunda https://helm.camunda.io
helm repo update

helm install camunda-platform camunda/camunda-platform \
  --namespace camunda \
  --create-namespace \
  --version 11.12.2 \
  -f k8s/camunda/values-camunda-platform.user.yaml
```

Эквивалент прежней установки через множество `--set` (тот же результат, что и файл выше).

## Upgrade

```bash
helm upgrade camunda-platform camunda/camunda-platform \
  --namespace camunda \
  --version 11.12.2 \
  -f k8s/camunda/values-camunda-platform.user.yaml
```

**Uwagi (PL):** to profil **dev**; Identity wyłączone — nie wdrażać tak na produkcję bez IAM.

## Zrzuty wartości z klastra

Skrypt nadpisuje pliki w **tym katalogu** — patrz [`scripts/fetch-helm-values.sh`](../../scripts/fetch-helm-values.sh).

Z katalogu **głównym repozytorium**:

```bash
chmod +x scripts/fetch-helm-values.sh
kubectl config current-context   # upewnij się, że to Twój GKE
./scripts/fetch-helm-values.sh camunda camunda-platform
```

| Plik | Zawartość |
|------|-----------|
| `k8s/camunda/values-camunda-platform.user.yaml` | Ręczny szablon w repo (nie nadpisywany przez skrypt) |
| `k8s/camunda/camunda-platform-user-values.yaml` | Zrzut: tylko nadpisania użytkownika |
| `k8s/camunda/camunda-platform-all-values.yaml` | Zrzut: pełne wartości (`--all`); duży — domyślnie w `.gitignore` |

Opcjonalnie pełny manifest release (może być bardzo duży):

```bash
FETCH_MANIFEST=1 ./scripts/fetch-helm-values.sh camunda camunda-platform
```

Jeśli inna nazwa release lub namespace — podaj je jako pierwszy i drugi argument.

## Dev / ref / prod (GKE) + Pulumi: Cloud SQL, Vertex (Gemini), sidecar

**Pulumi (данные + рантайм):**

- **infra-data** с `credit-scoring:createCloudSql: "true"`: приватный `sql.DatabaseInstance` (имя по умолчанию см. `credit-scoring:cloudSqlInstanceName`, например `postgres-instance`), базы `camunda_dev` / `camunda_ref` / `camunda_prod`, пользователь `camunda`, пароль в Secret Manager `hbg-camunda-postgres`.
- **infra-runtime**: API `aiplatform.googleapis.com`, GSA `hbg-vertex-llm` (`roles/aiplatform.user` для **Gemini** / Vertex) и GSA `hbg-camunda-csql` (`roles/cloudsql.client` для **Cloud SQL Auth Proxy**). Привязка Workload Identity: `credit-scoring:vertexWorkloadIdentities` и `credit-scoring:cloudSqlWorkloadIdentities` (формат `namespace:ksa`, через запятую).

**Выходы** (`pulumi stack output`): `cloud_sql_connection_name`, `vertex_gcp_service_account`, `cloudsql_gcp_service_account` и др.

**Kubernetes:** неймспейсы `camunda-dev` / `camunda-ref` / `camunda-prod` — смотри [namespaces/](namespaces/). Для **operate** задано имя K8s SA `hbg-camunda-operate` (совпадает с примерами в Pulumi-конфиге для WI).

**Helm (пример, подставьте выходы Pulumi):**

```bash
cd "$(git rev-parse --show-toplevel)"
for env in dev ref prod; do kubectl apply -f "k8s/camunda/namespaces/camunda-${env}.yaml"; done
CONN="$(pulumi -C infra/pulumi stack output --stack <your-data-stack> cloud_sql_connection_name 2>/dev/null || true)"
VSA="$(pulumi -C infra/pulumi stack output --stack <your-runtime-stack> cloudsql_gcp_service_account 2>/dev/null || true)"
# Замените __CLOUD_SQL_CONNECTION_NAME__ и __CLOUDSQL_GCP_SA__ в fragment и установите three релизы:
# helm install camunda-dev camunda/camunda-platform -n camunda-dev --version 11.12.2 \
#   -f k8s/camunda/values-camunda-platform.user.yaml \
#   -f k8s/camunda/values-camunda-platform.gcp-pulumi.fragment.yaml
```

Фрагмент sidecar: [values-camunda-platform.gcp-pulumi.fragment.yaml](values-camunda-platform.gcp-pulumi.fragment.yaml) — **cloud-sql-proxy** рядом с **operate** (JDBC на `localhost:5432`, база в URI — `camunda_dev` / `camunda_ref` / `camunda_prod`). PVC для Zeebe/ES заданы в user + fragment. Для ref/prod при необходимости увеличьте `persistence` в отдельных `-f` overrides.

**Бэкенд (Gemini):** сервисам в `hbg` выдайте WI на `hbg-vertex-llm` (см. `vertexWorkloadIdentities`); `GOOGLE_CLOUD_REGION` / проект — как в [`backend/app/config.py`](../../backend/app/config.py) и `vertex_vector` / LangChain Vertex.
