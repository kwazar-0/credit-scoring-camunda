---
title: "Camunda on GKE + Desktop Modeler (Ubuntu)"
description: "Helm deploy Camunda Platform 8 to GKE, namespaces, and Ubuntu workstation with Camunda Desktop Modeler via kubectl port-forward."
---

# Camunda on GKE + Desktop Modeler (Ubuntu)

This page describes a **practical path**: GKE credentials, Helm install from the repo chart values, optional `camunda-dev` / `camunda-ref` / `camunda-prod` namespaces, and **Camunda Desktop Modeler** on **Ubuntu** to deploy **BPMN** and **DMN** to Zeebe over **gRPC** through `kubectl port-forward`.

Canonical Helm notes and variants live in the repository: [`k8s/camunda/README.md`](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/k8s/camunda/README.md).

**Region policy (repo default):** `europe-central2`. See [infra-pulumi-iac](/en/infra-pulumi-iac) for Pulumi stacks that create GKE.

---

## Prerequisites

- `gcloud`, `kubectl`, `helm` on the workstation.
- GKE cluster reachable from your machine (control plane endpoint as configured by Pulumi).
- For modern GKE: install **`gke-gcloud-auth-plugin`** (`gcloud components install gke-gcloud-auth-plugin`) and set `export USE_GKE_GCLOUD_AUTH_PLUGIN=True` when using `kubectl`.

---

## 1. Cluster credentials

Replace project, region, and cluster name if yours differ (`hbg-gke` is the default name from Pulumi `infra-runtime`).

```bash
gcloud config set project YOUR_GCP_PROJECT_ID
gcloud container clusters get-credentials hbg-gke \
  --region=europe-central2 \
  --project=YOUR_GCP_PROJECT_ID
kubectl get nodes
```

---

## 2. Namespaces (dev / ref / prod)

From the repository root:

```bash
kubectl apply -f k8s/camunda/namespaces/camunda-dev.yaml
kubectl apply -f k8s/camunda/namespaces/camunda-ref.yaml
kubectl apply -f k8s/camunda/namespaces/camunda-prod.yaml
```

Kubernetes names are **`camunda-dev`**, **`camunda-ref`**, **`camunda-prod`** (not bare `dev`/`ref`/`prod`).

---

## 3. Helm: Camunda Platform (example `camunda-dev`)

Chart and values in the repo target **Camunda 8.6.x** images and chart **`11.12.2`** (see [`values-camunda-platform.user.yaml`](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/k8s/camunda/values-camunda-platform.user.yaml) — dev-oriented: no Identity/Keycloak).

```bash
cd "$(git rev-parse --show-toplevel)"
helm repo add camunda https://helm.camunda.io
helm repo update

helm upgrade --install camunda-dev camunda/camunda-platform \
  --namespace camunda-dev \
  --version 11.12.2 \
  -f k8s/camunda/values-camunda-platform.user.yaml
```

Wait until Zeebe and Elasticsearch pods are ready (`kubectl get pods -n camunda-dev`).

**Cloud SQL / Operate sidecar** and multi-env overrides are documented in the same [`k8s/camunda/README.md`](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/k8s/camunda/README.md) (`values-camunda-platform.gcp-pulumi.fragment.yaml`).

---

## 4. Zeebe gateway port-forward

Keep this terminal open while you model and deploy. Service name follows the Helm release name: **`{release}-zeebe-gateway`**.

```bash
export USE_GKE_GCLOUD_AUTH_PLUGIN=True
kubectl port-forward svc/camunda-dev-zeebe-gateway 26500:26500 -n camunda-dev
```

For a release named `camunda-platform` in namespace `camunda`:

```bash
kubectl port-forward svc/camunda-platform-zeebe-gateway 26500:26500 -n camunda
```

Workers on the same machine can use `export ZEEBE_ADDRESS=127.0.0.1:26500` (see [cli-console](/en/cli-console) and the Russian [cli-console](/ru/cli-console) for full copy-paste blocks).

---

## 5. Camunda Desktop Modeler on Ubuntu

1. **Download** the latest **Camunda Desktop Modeler** for Linux from [camunda.com/download/modeler](https://camunda.com/download/modeler/) or [GitHub Releases — camunda/camunda-modeler](https://github.com/camunda/camunda-modeler/releases).

2. **AppImage (common on Ubuntu)**  
   - `chmod +x camunda-modeler-*.AppImage`  
   - Run: `./camunda-modeler-*.AppImage`  
   - If the system reports missing **FUSE**, install the library your Ubuntu version expects (e.g. `libfuse2` for older AppImages, or use the **`.tar.gz`** build from the same release page and run the bundled executable).

3. **`.tar.gz`**  
   - Extract, then run the `camunda-modeler` binary from the extracted folder (see the release archive layout).

---

## 6. Connect Modeler and deploy BPMN / DMN

1. Open a **`.bpmn`** or **`.dmn`** file in Desktop Modeler.
2. Use **Deploy** and add (or select) a **Camunda 8 Self-Managed** cluster:
   - **Cluster endpoint (gRPC):** `localhost:26500` (while `kubectl port-forward` is active).
3. With the repo’s **dev values** (Identity disabled), use the UI’s option for **no OAuth** / plain gateway as offered for local self-managed (wording varies by Modeler version).
4. Deploy — the diagram is sent to the Zeebe cluster behind the tunnel.

Optional: port-forward **Operate** / **Tasklist** for UI checks (Helm output lists `kubectl port-forward` examples per service).

---

## Navigation

- [Operations: Deployment](/en/ops/deployment) · [Pulumi IaC](/en/infra-pulumi-iac) · [CLI / console](/en/cli-console)  
- **Русский:** [Camunda GKE + Modeler](/ru/camunda-gke-deploy-modeler) · **Polski:** [Camunda GKE + Modeler](/pl/camunda-gke-deploy-modeler)
