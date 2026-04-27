---
title: "Camunda в GKE + Desktop Modeler (Ubuntu)"
description: "Helm-установка Camunda Platform 8 в GKE, неймспейсы и Camunda Desktop Modeler на Ubuntu — деплой BPMN/DMN через port-forward на Zeebe."
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

Терминал не закрывать, пока работаете в Modeler. Сервис: **`{имя-helm-релиза}-zeebe-gateway`**.

```bash
export USE_GKE_GCLOUD_AUTH_PLUGIN=True
kubectl port-forward svc/camunda-dev-zeebe-gateway 26500:26500 -n camunda-dev
```

Для варианта из README (`camunda-platform`, namespace `camunda`):

```bash
kubectl port-forward svc/camunda-platform-zeebe-gateway 26500:26500 -n camunda
```

Для `worker/` на той же машине: `export ZEEBE_ADDRESS=127.0.0.1:26500`.

---

## 5. Camunda Desktop Modeler на Ubuntu

1. Скачайте сборку **Linux** с [camunda.com/download/modeler](https://camunda.com/download/modeler/) или [релизов camunda/camunda-modeler](https://github.com/camunda/camunda-modeler/releases).

2. **AppImage:** `chmod +x …AppImage`, запуск `./camunda-modeler-….AppImage`. При ошибке FUSE — пакет вроде **`libfuse2`** (зависит от версии Ubuntu) либо возьмите **`.tar.gz`** с той же страницы релизов.

3. **Архив `.tar.gz`:** распакуйте и запустите бинарник из каталога (структура указана в релизе).

---

## 6. Подключение и деплой BPMN / DMN

1. Откройте `.bpmn` или `.dmn`.
2. **Deploy** → кластер **Camunda 8 Self-Managed**:
   - **gRPC endpoint:** `localhost:26500` (при активном `port-forward`).
3. В профиле **без Identity** обычно достаточно режима **без OAuth** / незащищённого gateway (формулировки в UI зависят от версии Modeler).
4. Выполните deploy.

Проверка в UI: при необходимости отдельный `port-forward` на Operate/Tasklist — см. вывод `helm install` / `helm upgrade`.

---

## Навигация

- [Operations: Deployment](/ru/ops/deployment) · [Pulumi IaC](/ru/infra-pulumi-iac) · [CLI / console](/ru/cli-console)  
- **English:** [Camunda GKE + Modeler](/en/camunda-gke-deploy-modeler) · **Polski:** [Camunda GKE + Modeler](/pl/camunda-gke-deploy-modeler)
