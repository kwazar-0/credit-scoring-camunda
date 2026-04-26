# CLI / console — Handlowy Bank Galicyjski (HBG)

Копируемые команды. Значения ниже соответствуют целевой конфигурации репозитория и активному GCP-проекту **`my-camunda8-project`**.

| Параметр | Значение |
|----------|-----------|
| **GCP project** | `my-camunda8-project` |
| **Регион данных (Vertex, GCS, BQ, Artifact Registry в манифестах)** | `europe-central2` |
| **Имя репозитория Docker (Pulumi `credit-scoring:clusterName`)** | `hbg-gke` → образы: `…/hbg-gke-docker/…` |
| **Kubernetes namespace** | `hbg` |
| **Job type Zeebe** | `ai-loan-analysis` |
| **GKE в проекте (существующий кластер)** | `camunda-stable`, регион `europe-central2` |

Путь к клону: **корень репозитория** (ниже — `$(git rev-parse --show-toplevel 2>/dev/null || echo "$PWD")` или ваша папка, напр. `~/src/hbg-worktree`).

Дополнительно: [prompt](prompt.md), [git-workflow](git-workflow.md), [naming](naming.md), [ml-data-rag](ml-data-rag.md), [infra-pulumi-iac](infra-pulumi-iac.md).

---

## How-to: configure workstation

```bash
# 1) gcloud: account + project + default region
gcloud auth list
gcloud config set account tempb418@gmail.com
gcloud config set project my-camunda8-project
gcloud config set compute/region europe-central2
gcloud config set artifacts/location europe-central2

# 2) ADC for SDK/Pulumi provider
gcloud auth application-default login
gcloud auth application-default print-access-token >/dev/null && echo "ADC OK"

# 3) Docker access without sudo (re-login may be required)
sudo usermod -aG docker "$USER"
newgrp docker
docker run --rm hello-world

# 4) Pulumi local backend + stack config
cd "$(git rev-parse --show-toplevel)/infra/pulumi"
pulumi login --local
export PULUMI_CONFIG_PASSPHRASE='changeme'
pulumi stack select dev || pulumi stack init dev
pulumi config set gcp:project my-camunda8-project
pulumi config set credit-scoring:region europe-central2
pulumi config set credit-scoring:clusterName hbg-gke
```

Быстрая проверка:

```bash
docker --version
kubectl version --client
gcloud config list
pulumi version
helm version
```

---

## Локально: Docker Compose (Zeebe + backend + worker + UI)

```bash
cd "$(git rev-parse --show-toplevel)"
docker compose up --build
```

- API: `http://127.0.0.1:8000` — `GET /healthz`, `POST /analyze`
- Streamlit: `http://127.0.0.1:8501`
- Zeebe gateway: `127.0.0.1:26500`

---

## Локально: worker без Compose

```bash
cd "$(git rev-parse --show-toplevel)/worker"
pip install -r requirements.txt
export PYTHONPATH="${PWD}"
export ZEEBE_ADDRESS=127.0.0.1:26500
export BACKEND_URL=http://127.0.0.1:8000
export AI_TIMEOUT_S=45
python -m app.main
```

---

## Pulumi (`infra/pulumi/`)

```bash
cd "$(git rev-parse --show-toplevel)/infra/pulumi"
python3 -m venv venv && . venv/bin/activate
pip install -r requirements.txt
```

Локальный backend state Pulumi (если `pulumi: command not found` — CLI не в `PATH`, см. [infra-pulumi-iac](infra-pulumi-iac.md)):

```bash
export PATH="${HOME}/.pulumi/bin:${PATH}"
pulumi login --local
export PULUMI_CONFIG_PASSPHRASE='changeme'
pulumi stack init dev
pulumi config set gcp:project my-camunda8-project
pulumi config set credit-scoring:region europe-central2
pulumi config set credit-scoring:clusterName hbg-gke
gcloud auth application-default login
pulumi preview
pulumi up
pulumi stack output --json
```

Экспорты: `gcp_project`, `gcp_region`, `artifact_repository_id`, `artifact_registry_url`, `vector_embeddings_bucket`, `raw_regulations_bucket`, `bigquery_dataset` — см. `infra/pulumi/__main__.py`.

### Включить API (и IAM-зависимые сервисы) в проекте

Один раз **до** или **параллельно** с Pulumi: скрипт включает **Service Management** API, **IAM/STS/Resource Manager** (для WIF и привязок ролей), **aiplatform, bigquery, storage, artifactregistry, sql, container, compute, servicenetworking, secretmanager, logging, monitoring** — в одном `gcloud services enable`.

```bash
cd "$(git rev-parse --show-toplevel)"
chmod +x scripts/gcp-enable-apis-iam.sh   # при необходимости
./scripts/gcp-enable-apis-iam.sh my-camunda8-project
```

После запуска скрипт печатает **подсказки** по `gcloud projects add-iam-policy-binding` (группы, SA) — **не** хранить личные email в репо; SoT в IaC по [`prompt.md`](prompt.md) §9.2.1, §9.6.

---

## GCP и kubectl

Активный проект и список кластеров:

```bash
gcloud config set project my-camunda8-project
gcloud container clusters list --project=my-camunda8-project
```

Kubeconfig для **текущего** кластера Camunda в этом проекте:

```bash
gcloud container clusters get-credentials camunda-stable \
  --region=europe-central2 \
  --project=my-camunda8-project
kubectl config current-context
kubectl get ns
```

Манифесты примера банка (`k8s/hbg/`) рассчитаны на образы в **`europe-central2-docker.pkg.dev`**. При необходимости разверните отдельный кластер в **`europe-central2`** (IaC / консоль). Для zonal-кластера укажите `--zone` (например `europe-central2-a`) вместо `--region`.

---

## Kubernetes: `k8s/hbg/`

В `deployment-*.yaml` замените плейсхолдер **`PROJECT_ID`** на **`my-camunda8-project`** (или примените через `envsubst` / правку в редакторе).

Секреты не коммитить: скопировать `secret-env.example.yaml` → `secret-env.yaml`, выставить `GOOGLE_CLOUD_PROJECT: "my-camunda8-project"` и токены.

```bash
cd "$(git rev-parse --show-toplevel)"
kubectl apply -f k8s/hbg/namespace.yaml
kubectl apply -f k8s/hbg/secret-env.yaml
kubectl apply -f k8s/hbg/serviceaccount-backend.yaml
kubectl apply -f k8s/hbg/deployment-backend.yaml
kubectl apply -f k8s/hbg/deployment-worker.yaml
kubectl apply -f k8s/hbg/deployment-ui.yaml
kubectl -n hbg get pods,svc
kubectl -n hbg logs deploy/credit-worker -f
kubectl -n hbg logs deploy/credit-backend -f
```

---

## Образы: сборка и push (регион `europe-central2`)

После `pulumi up` проверьте `artifact_registry_url` в выводе стека.

```bash
export REGION=europe-central2
export PROJECT_ID=my-camunda8-project
export REPO=hbg-gke-docker

docker build -t credit-backend:latest "$(git rev-parse --show-toplevel)/backend"
docker tag credit-backend:latest \
  ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO}/credit-backend:latest
gcloud auth configure-docker ${REGION}-docker.pkg.dev --project=${PROJECT_ID}
docker push ${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO}/credit-backend:latest
```

Аналогично: контексты сборки `worker/` → `credit-worker`, `ui/` → `credit-ui`; теги должны совпадать с `deployment-*.yaml`.

---

## GitOps: Argo CD

Установка в кластер и пример `Application` для `k8s/hbg/`: **`k8s/argocd/README.md`**.

---

## BPMN

Процесс: `bpmn/hbg-loan-process.bpmn` — service task с типом **`ai-loan-analysis`**, затем DMN `scoring-rules`.
