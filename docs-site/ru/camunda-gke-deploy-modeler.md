---
title: "Camunda в GKE + Desktop Modeler (Ubuntu)"
description: "Helm Camunda 8 в GKE, Desktop Modeler (Ubuntu), port-forward, PyZeebe и gRPC (ZEEBE_ADDRESS), примеры BPMN/DMN из репозитория и локальный worker."
---

# Camunda в GKE + Desktop Modeler (Ubuntu)

Практическая цепочка: доступ к **GKE**, установка **Camunda Platform** через **Helm** из values репозитория, неймспейсы **`camunda-dev` / `camunda-ref` / `camunda-prod`**, и **Camunda Desktop Modeler** на **Ubuntu** для выгрузки **BPMN** и **DMN** в Zeebe по **gRPC** через **`kubectl port-forward`**.

Каноничное описание Helm и вариантов: [`k8s/camunda/README.md`](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/k8s/camunda/README.md).

**Регион по умолчанию в репо:** `europe-central2`. Кластер GKE создаётся стеком Pulumi **`infra-runtime`**: [infra-pulumi-iac](/ru/infra-pulumi-iac).

---

## Что нужно на рабочей машине

- `gcloud`, `kubectl`, `helm`.
- Для актуального GKE: плагин **`gke-gcloud-auth-plugin`** (`gcloud components install gke-gcloud-auth-plugin`) и при работе с `kubectl`: `export USE_GKE_GCLOUD_AUTH_PLUGIN=True`.

---

## 1. Credentials кластера

Подставьте свой проект, регион и имя кластера (дефолт имени из Pulumi — **`hbg-gke`**).

```bash
gcloud config set project YOUR_GCP_PROJECT_ID
gcloud container clusters get-credentials hbg-gke \
  --region=europe-central2 \
  --project=YOUR_GCP_PROJECT_ID
kubectl get nodes
```

Расширенные команды: [cli-console](/ru/cli-console).

---

## 2. Неймспейсы dev / ref / prod

Из корня репозитория:

```bash
kubectl apply -f k8s/camunda/namespaces/camunda-dev.yaml
kubectl apply -f k8s/camunda/namespaces/camunda-ref.yaml
kubectl apply -f k8s/camunda/namespaces/camunda-prod.yaml
```

В Kubernetes имена **`camunda-dev`**, **`camunda-ref`**, **`camunda-prod`**.

---

## 3. Helm: пример релиза `camunda-dev`

Образы **8.6.x**, chart **`11.12.2`**, values без Identity — см. [`values-camunda-platform.user.yaml`](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/k8s/camunda/values-camunda-platform.user.yaml).

```bash
cd "$(git rev-parse --show-toplevel)"
helm repo add camunda https://helm.camunda.io
helm repo update

helm upgrade --install camunda-dev camunda/camunda-platform \
  --namespace camunda-dev \
  --version 11.12.2 \
  -f k8s/camunda/values-camunda-platform.user.yaml
```

Дождитесь готовности подов Zeebe и Elasticsearch: `kubectl get pods -n camunda-dev`.

Путь **Cloud SQL + sidecar** и фрагмент values для Pulumi — в [`k8s/camunda/README.md`](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/k8s/camunda/README.md).

---

## 4. Port-forward к Zeebe Gateway

`kubectl port-forward` пробрасывает **localhost:26500** на машине на сервис **Zeebe gateway** в кластере. **Пока этот процесс запущен**, Modeler (и worker) ходят на `localhost:26500`; **Ctrl+C или закрытие терминала обрывает туннель** — без него deploy в Modeler не дойдёт до Zeebe.

- Держите **отдельную вкладку/окно терминала** открытой на всё время работы с диаграммами.
- При успешном старте обычно видно строку вида `Forwarding from 127.0.0.1:26500 -> 26500`.
- Имя сервиса: **`{имя-helm-релиза}-zeebe-gateway`**.

```bash
export USE_GKE_GCLOUD_AUTH_PLUGIN=True
kubectl port-forward svc/camunda-dev-zeebe-gateway 26500:26500 -n camunda-dev
```

Для варианта из README (`camunda-platform`, namespace `camunda`):

```bash
kubectl port-forward svc/camunda-platform-zeebe-gateway 26500:26500 -n camunda
```

Если порт **26500** занят, возьмите другой локальный порт (пример **26501**) и в Modeler укажите `localhost:26501`:

```bash
kubectl port-forward svc/camunda-dev-zeebe-gateway 26501:26500 -n camunda-dev
```

Для `worker/` на той же машине: `export ZEEBE_ADDRESS=127.0.0.1:26500` (или тот локальный порт, который пробросили).

---

## 5. Camunda Desktop Modeler на Ubuntu

1. Скачайте сборку **Linux** с [camunda.com/download/modeler](https://camunda.com/download/modeler/) или [релизов camunda/camunda-modeler](https://github.com/camunda/camunda-modeler/releases).

2. **AppImage:** `chmod +x …AppImage`, запуск `./camunda-modeler-….AppImage`. При ошибке FUSE — пакет вроде **`libfuse2`** (зависит от версии Ubuntu) либо возьмите **`.tar.gz`** с той же страницы релизов.

3. **Архив `.tar.gz` (linux-x64):** распакуйте и запустите `./camunda-modeler` из каталога распаковки.

### Linux: ошибка Electron `chrome-sandbox` (SUID)

Если Modeler сразу завершается с текстом, что **`chrome-sandbox`** должен быть **владельца root** и иметь **права 4755** — это нормальное поведение Chromium/Electron на части Linux-конфигураций.

**Вариант A — удобно для личной dev-машины (без смены владельца на root):**

```bash
./camunda-modeler --no-sandbox
```

**Вариант B — включить setuid-helper (нужен sudo), из каталога с Modeler:**

```bash
sudo chown root:root chrome-sandbox
sudo chmod 4755 chrome-sandbox
./camunda-modeler
```

Если вариант B не помогает (политика ядра / user namespaces), используйте **вариант A**.

---

## 6. Подключение и деплой BPMN / DMN

1. Запустите **port-forward** (раздел 4) и не закрывайте терминал.
2. Запустите **Desktop Modeler** (на Linux при необходимости с **`--no-sandbox`** — раздел 5).
3. Откройте `.bpmn` или `.dmn`.
4. **Deploy** → кластер **Camunda 8 Self-Managed**:
   - **gRPC endpoint:** `localhost:26500` (или выбранный локальный порт) **пока активен** `kubectl port-forward`.
5. В профиле **без Identity** обычно достаточно режима **без OAuth** (формулировки в UI зависят от версии Modeler).
6. Выполните **Deploy** — диаграмма уходит в Zeebe через туннель (сценарий проверен для GKE + релиз `camunda-dev`).

Проверка в UI: при необходимости отдельный `port-forward` на Operate/Tasklist — см. вывод `helm install` / `helm upgrade`.

---

## 7. Воркер PyZeebe: gRPC и примеры BPMN / DMN из репозитория

### Подключение gRPC

В [`worker/app/main.py`](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/worker/app/main.py) используется **PyZeebe** с **`create_insecure_channel(grpc_address=…)`** — это **обычный gRPC без TLS** на **Zeebe gateway**, порт **26500** (как при `kubectl port-forward` и как в типичном dev Helm).

- Переменная **`ZEEBE_ADDRESS`**, формат **`хост:26500`** (без префикса `http://`).
- **С ноутбука** при активном port-forward: `ZEEBE_ADDRESS=127.0.0.1:26500`.
- **Из пода в том же GKE**, релиз **`camunda-dev`**, namespace **`camunda-dev`**:

  `ZEEBE_ADDRESS=camunda-dev-zeebe-gateway.camunda-dev.svc.cluster.local:26500`

  Шаблон: `{релиз}-zeebe-gateway.{namespace}.svc.cluster.local:26500`.

Пример в [`k8s/hbg/deployment-worker.yaml`](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/k8s/hbg/deployment-worker.yaml) указывает **`camunda-platform-zeebe-gateway.camunda…`** — замените на **ваш** релиз/namespace (например `camunda-dev` выше).

### Тип задачи и переменные

- Подписка воркера: **`ai-loan-analysis`**.
- В BPMN в задачу должен передаваться объект **`application`** (JSON). Воркер шлёт его в **`BACKEND_URL`** на `POST /analyze` (для локали: `http://127.0.0.1:8000`).

### BPMN и DMN в репозитории

| Артефакт | Путь | Идентификаторы |
|----------|------|----------------|
| **BPMN** | [`bpmn/hbg-loan-process.bpmn`](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/bpmn/hbg-loan-process.bpmn) | Process id **`hbg-loan-process`**, тип задачи **`ai-loan-analysis`**, DMN **`scoring-rules`**, результат в **`riskTier`**. |
| **DMN** | [`dmn/scoring-rules.dmn`](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/dmn/scoring-rules.dmn) | Decision id **`scoring-rules`**, вход **`risk_score`** (число) — приходит из выхода воркера после `/analyze`. |

В **Desktop Modeler** задеплойте **оба** файла в тот же кластер, что в разделе 6 (при активном port-forward). Без DMN шаг business rule в процессе не сможет разрешить **`scoring-rules`**.

### Локальный запуск воркера (через port-forward)

```bash
cd worker
python3 -m venv .venv && . .venv/bin/activate
pip install -r requirements.txt
export PYTHONPATH="${PWD}"
export ZEEBE_ADDRESS=127.0.0.1:26500
export BACKEND_URL=http://127.0.0.1:8000
python -m app.main
```

Во втором терминале держите **`kubectl port-forward … 26500:26500`**.

### Запуск экземпляра процесса (smoke)

Через [**`zbctl`**](https://docs.camunda.io/docs/apis-tools/cli-client/) или Operate (с port-forward), процесс **`hbg-loan-process`** с переменной **`application`**, например:

```bash
zbctl create instance hbg-loan-process --variables '{"application":{"income":8000,"debt":1000}}'
```

Структура **`application`** должна подходить графу backend ([`/analyze`](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/backend/app/main.py)); для тестов подставьте нужные поля.

---

## Навигация

- [Operations: Deployment](/ru/ops/deployment) · [Pulumi IaC](/ru/infra-pulumi-iac) · [CLI / console](/ru/cli-console)  
- **English:** [Camunda GKE + Modeler](/en/camunda-gke-deploy-modeler) · **Polski:** [Camunda GKE + Modeler](/pl/camunda-gke-deploy-modeler)

---

## Примеры ожидаемого вывода (bash)

### `gcloud container clusters get-credentials`

```text
Fetching cluster endpoint and auth data.
kubeconfig entry generated for hbg-gke.
```

### `kubectl port-forward ... 26500:26500`

```text
Forwarding from 127.0.0.1:26500 -> 26500
Forwarding from [::1]:26500 -> 26500
Handling connection for 26500
```

### `helm upgrade --install camunda-dev ...`

```text
Release "camunda-dev" does not exist. Installing it now.
NAME: camunda-dev
NAMESPACE: camunda-dev
STATUS: deployed
REVISION: 1
```

### `zbctl create instance hbg-loan-process ...`

```text
{
  "processDefinitionKey": "...",
  "bpmnProcessId": "hbg-loan-process",
  "version": ...,
  "processInstanceKey": "...",
  "tenantId": "<default>"
}
```
