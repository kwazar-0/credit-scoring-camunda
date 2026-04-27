---
title: "Camunda on GKE + Desktop Modeler (Ubuntu)"
description: "Helm deploy Camunda 8 on GKE, Desktop Modeler (Ubuntu), kubectl port-forward, PyZeebe gRPC (ZEEBE_ADDRESS), and repo BPMN/DMN examples."
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

## 0. Local Artifact Registry check (push/pull)

Quick precheck only: ensure local Docker auth and at least one test push/pull works.

Full GitHub/WIF/Artifact Registry setup and command blocks are in [Operations: CI/CD](/en/ops/cicd).

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

`kubectl port-forward` maps **localhost:26500** on your workstation to the **Zeebe gateway** service inside the cluster. **While this process runs**, Modeler (and workers) can use `localhost:26500`; **Ctrl+C or closing the terminal stops the tunnel** — deploy will then fail until you start it again.

- Use a **dedicated terminal tab/window** and leave it open for the whole modelling session.
- You should see a line like `Forwarding from 127.0.0.1:26500 -> 26500` when it is working.
- Service name follows the Helm release: **`{release}-zeebe-gateway`**.

```bash
export USE_GKE_GCLOUD_AUTH_PLUGIN=True
kubectl port-forward svc/camunda-dev-zeebe-gateway 26500:26500 -n camunda-dev
```

For a release named `camunda-platform` in namespace `camunda`:

```bash
kubectl port-forward svc/camunda-platform-zeebe-gateway 26500:26500 -n camunda
```

If the local port is busy, use another local port (example **26501**) and point Modeler to `localhost:26501`:

```bash
kubectl port-forward svc/camunda-dev-zeebe-gateway 26501:26500 -n camunda-dev
```

Workers on the same machine can use `export ZEEBE_ADDRESS=127.0.0.1:26500` (see [cli-console](/en/cli-console) and the Russian [cli-console](/ru/cli-console) for full copy-paste blocks).

---

## 5. Camunda Desktop Modeler on Ubuntu

1. **Download** the latest **Camunda Desktop Modeler** for Linux from [camunda.com/download/modeler](https://camunda.com/download/modeler/) or [GitHub Releases — camunda/camunda-modeler](https://github.com/camunda/camunda-modeler/releases).

2. **AppImage (common on Ubuntu)**  
   - `chmod +x camunda-modeler-*.AppImage`  
   - Run: `./camunda-modeler-*.AppImage`  
   - If the system reports missing **FUSE**, install the library your Ubuntu version expects (e.g. `libfuse2` for older AppImages, or use the **`.tar.gz`** build from the same release page and run the bundled executable).

3. **`.tar.gz` (linux-x64 archive)**  
   - Extract, then run `./camunda-modeler` from the extracted folder.

### Linux: Electron `chrome-sandbox` error (SUID)

If Modeler exits immediately with a message that **`chrome-sandbox`** must be **owned by root** and **mode 4755**, that is normal Chromium/Electron behaviour on some Linux setups.

**Option A — typical for a personal dev machine (no root change):**

```bash
./camunda-modeler --no-sandbox
```

**Option B — enable the setuid helper (requires sudo), from the Modeler directory:**

```bash
sudo chown root:root chrome-sandbox
sudo chmod 4755 chrome-sandbox
./camunda-modeler
```

If option B still fails (kernel / user namespace policy), use **option A**.

---

## 6. Connect Modeler and deploy BPMN / DMN

1. Start **port-forward** (section 4) and keep it running.
2. Start **Desktop Modeler** (with `--no-sandbox` on Linux if needed — section 5).
3. Open a **`.bpmn`** or **`.dmn`** file in Desktop Modeler.
4. Use **Deploy** and add (or select) a **Camunda 8 Self-Managed** cluster:
   - **Cluster endpoint (gRPC):** `localhost:26500` (or the local port you chose) while `kubectl port-forward` is active.
5. With the repo’s **dev values** (Identity disabled), use the UI’s option for **no OAuth** / plain gateway as offered for local self-managed (wording varies by Modeler version).
6. **Deploy** — the diagram is sent to Zeebe through the tunnel (this flow is validated for GKE + `camunda-dev`).

Optional: port-forward **Operate** / **Tasklist** for UI checks (Helm output lists `kubectl port-forward` examples per service).

---

## 7. PyZeebe worker: gRPC and repo BPMN / DMN

### gRPC connection (what the worker uses)

The worker ([`worker/app/main.py`](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/worker/app/main.py)) uses **PyZeebe** with **`create_insecure_channel(grpc_address=…)`** — that is **plain gRPC** to the **Zeebe gateway** on port **26500**, **no TLS** (aligned with a typical dev Helm profile and with `kubectl port-forward` to the gateway).

- Environment variable: **`ZEEBE_ADDRESS`**, format **`host:26500`** (no `http://` prefix).
- **From your laptop** while port-forward is running: `ZEEBE_ADDRESS=127.0.0.1:26500` (or `localhost:26500`).
- **From a pod in the same GKE cluster** talking to the `camunda-dev` Helm release in namespace `camunda-dev`:

  `ZEEBE_ADDRESS=camunda-dev-zeebe-gateway.camunda-dev.svc.cluster.local:26500`

  (Pattern: `{release}-zeebe-gateway.{namespace}.svc.cluster.local:26500`.)

The sample [`k8s/hbg/deployment-worker.yaml`](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/k8s/hbg/deployment-worker.yaml) still points at **`camunda-platform-zeebe-gateway.camunda.svc…`** — adjust release/namespace to match **your** Camunda install (e.g. `camunda-dev` above).

### Job type and variables

- **Task type** subscribed by the worker: **`ai-loan-analysis`** (`TASK_TYPE` in code).
- The service task must pass process variable **`application`** (JSON object). The worker POSTs it to the FastAPI backend **`BACKEND_URL`** (default in code `http://backend:8000`; for local dev use e.g. `http://127.0.0.1:8000`).

### BPMN and DMN in this repository (examples to deploy)

| Artifact | Path | IDs / notes |
|----------|------|----------------|
| **BPMN** | [`bpmn/hbg-loan-process.bpmn`](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/bpmn/hbg-loan-process.bpmn) | Process id **`hbg-loan-process`**. Service task **`ai-loan-analysis`**. Business rule task calls DMN **`scoring-rules`** (`bindingType="latest"`, result variable **`riskTier`**). |
| **DMN** | [`dmn/scoring-rules.dmn`](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/dmn/scoring-rules.dmn) | Decision id **`scoring-rules`**. Input **`risk_score`** (number) — produced by the worker from `/analyze`. |

In **Desktop Modeler**, open each file and **Deploy** to the same **Camunda 8 Self-Managed** cluster as in section 6 (with port-forward active). Deploy **both** BPMN and DMN so the business rule task can resolve **`scoring-rules`**.

### Run the worker locally (against port-forward)

From repo root (with backend reachable at `BACKEND_URL`):

```bash
cd worker
python3 -m venv .venv && . .venv/bin/activate
pip install -r requirements.txt
export PYTHONPATH="${PWD}"
export ZEEBE_ADDRESS=127.0.0.1:26500
export BACKEND_URL=http://127.0.0.1:8000
python -m app.main
```

Keep **`kubectl port-forward … 26500:26500`** running in another terminal.

### Start a process instance (smoke)

With [**`zbctl`**](https://docs.camunda.io/docs/apis-tools/cli-client/) (or Operate after port-forward), create an instance of **`hbg-loan-process`** with variable **`application`** (JSON), for example:

```bash
zbctl create instance hbg-loan-process --variables '{"application":{"income":8000,"debt":1000}}'
```

The exact shape of **`application`** must satisfy the backend graph (see [`backend/app/main.py`](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/backend/app/main.py) `/analyze`); adjust fields as needed for your test.

---

## Navigation

- [Operations: Deployment](/en/ops/deployment) · [Pulumi IaC](/en/infra-pulumi-iac) · [CLI / console](/en/cli-console)  
- **Русский:** [Camunda GKE + Modeler](/ru/camunda-gke-deploy-modeler) · **Polski:** [Camunda GKE + Modeler](/pl/camunda-gke-deploy-modeler)

---

## Expected Bash Output Examples

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
