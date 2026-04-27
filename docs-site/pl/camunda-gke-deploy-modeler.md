---
title: "Camunda na GKE + Desktop Modeler (Ubuntu)"
description: "Wdrożenie Camunda Platform 8 na GKE (Helm), namespaces oraz Camunda Desktop Modeler na Ubuntu — BPMN/DMN przez port-forward do Zeebe."
---

# Camunda na GKE + Desktop Modeler (Ubuntu)

Ta strona opisuje **ścieżkę operacyjną**: dostęp do **GKE**, instalacja **Camunda Platform** przez **Helm** z plików values w repozytorium, namespaces **`camunda-dev` / `camunda-ref` / `camunda-prod`** oraz **Camunda Desktop Modeler** na **Ubuntu** do wdrażania **BPMN** i **DMN** do Zeebe (**gRPC**) przez **`kubectl port-forward`**.

Źródło Helm i wariantów: [`k8s/camunda/README.md`](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/k8s/camunda/README.md).

**Region (domyślnie w repo):** `europe-central2`. GKE z Pulumi: [infra-pulumi-iac](/pl/infra-pulumi-iac).

---

## Wymagania

- `gcloud`, `kubectl`, `helm`.
- Dla nowego GKE: **`gke-gcloud-auth-plugin`** oraz `export USE_GKE_GCLOUD_AUTH_PLUGIN=True` przy `kubectl`.

---

## 1. Credentials klastra

```bash
gcloud config set project YOUR_GCP_PROJECT_ID
gcloud container clusters get-credentials hbg-gke \
  --region=europe-central2 \
  --project=YOUR_GCP_PROJECT_ID
kubectl get nodes
```

Więcej poleceń: [cli-console](/pl/cli-console).

---

## 2. Namespaces

```bash
kubectl apply -f k8s/camunda/namespaces/camunda-dev.yaml
kubectl apply -f k8s/camunda/namespaces/camunda-ref.yaml
kubectl apply -f k8s/camunda/namespaces/camunda-prod.yaml
```

---

## 3. Helm (przykład `camunda-dev`)

```bash
cd "$(git rev-parse --show-toplevel)"
helm repo add camunda https://helm.camunda.io
helm repo update

helm upgrade --install camunda-dev camunda/camunda-platform \
  --namespace camunda-dev \
  --version 11.12.2 \
  -f k8s/camunda/values-camunda-platform.user.yaml
```

---

## 4. Port-forward Zeebe

```bash
export USE_GKE_GCLOUD_AUTH_PLUGIN=True
kubectl port-forward svc/camunda-dev-zeebe-gateway 26500:26500 -n camunda-dev
```

---

## 5. Modeler na Ubuntu

Pobierz Linux z [camunda.com/download/modeler](https://camunda.com/download/modeler/) lub [GitHub Releases](https://github.com/camunda/camunda-modeler/releases). **AppImage:** `chmod +x`, uruchomienie `./…AppImage`; przy FUSE — `libfuse2` lub archiwum **`.tar.gz`**.

---

## 6. Deploy BPMN/DMN

W Modeler: **Deploy** → **Camunda 8 Self-Managed** → endpoint **`localhost:26500`** (przy aktywnym port-forward). Profil dev bez Identity — zwykle **bez OAuth**.

---

## Nawigacja

- [Operations: Deployment](/pl/ops/deployment) · [Pulumi IaC](/pl/infra-pulumi-iac)  
- **English:** [Camunda GKE + Modeler](/en/camunda-gke-deploy-modeler) · **Русский:** [Camunda GKE + Modeler](/ru/camunda-gke-deploy-modeler)
