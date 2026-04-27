---
title: "Camunda na GKE + Desktop Modeler (Ubuntu)"
description: "Helm Camunda 8 na GKE, Desktop Modeler (Ubuntu), port-forward, PyZeebe gRPC (ZEEBE_ADDRESS), przykłady BPMN/DMN z repozytorium i worker lokalnie."
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

`kubectl port-forward` mapuje **localhost:26500** na serwis **Zeebe gateway** w klastrze. **Dopóki proces działa**, Modeler widzi `localhost:26500`; **Ctrl+C lub zamknięcie terminala** przerywa tunel.

- Zostaw **osobną** kartę/okno terminala włączone na czas pracy.
- Po starcie widać m.in. `Forwarding from 127.0.0.1:26500 -> 26500`.

```bash
export USE_GKE_GCLOUD_AUTH_PLUGIN=True
kubectl port-forward svc/camunda-dev-zeebe-gateway 26500:26500 -n camunda-dev
```

Inny lokalny port (np. **26501**), wtedy w Modeler: `localhost:26501`:

```bash
kubectl port-forward svc/camunda-dev-zeebe-gateway 26501:26500 -n camunda-dev
```

---

## 5. Modeler na Ubuntu

Pobierz Linux z [camunda.com/download/modeler](https://camunda.com/download/modeler/) lub [GitHub Releases](https://github.com/camunda/camunda-modeler/releases). **AppImage:** `chmod +x`, `./…AppImage`; przy FUSE — `libfuse2` lub **`.tar.gz`**. Z archiwum **linux-x64**: rozpakuj i uruchom `./camunda-modeler`.

### Błąd `chrome-sandbox` (Electron / SUID)

**A — dev na własnej maszynie:**

```bash
./camunda-modeler --no-sandbox
```

**B — z setuid (wymaga sudo), w katalogu Modeler:**

```bash
sudo chown root:root chrome-sandbox
sudo chmod 4755 chrome-sandbox
./camunda-modeler
```

Jeśli B nie działa (kernel / user namespaces), użyj **A**.

---

## 6. Deploy BPMN/DMN

1. Uruchom **port-forward** (sekcja 4) i zostaw go włączony.
2. Uruchom **Modeler** (Linux: ewent. **`--no-sandbox`** — sekcja 5).
3. W Modeler: **Deploy** → **Camunda 8 Self-Managed** → **`localhost:26500`** (lub wybrany port lokalny). Profil dev bez Identity — zwykle **bez OAuth**.
4. **Deploy** — diagram trafia do Zeebe przez tunel (przepływ zweryfikowany dla GKE + `camunda-dev`).

---

## 7. Worker PyZeebe: gRPC oraz BPMN/DMN z repozytorium

### gRPC

W [`worker/app/main.py`](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/worker/app/main.py): **`create_insecure_channel`** — **gRPC bez TLS** na gateway **:26500** (jak przy `kubectl port-forward`).

- **`ZEEBE_ADDRESS`**: `host:26500` (bez `http://`).
- Laptop + port-forward: `127.0.0.1:26500`.
- Pod w GKE, release **`camunda-dev`**, ns **`camunda-dev`**: `camunda-dev-zeebe-gateway.camunda-dev.svc.cluster.local:26500`.

[`k8s/hbg/deployment-worker.yaml`](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/k8s/hbg/deployment-worker.yaml) ma stary adres `camunda-platform…` — podmień na swój release/namespace.

### Zadanie i zmienne

- Typ zadania: **`ai-loan-analysis`**.
- Zmienna procesu **`application`** (JSON) → worker wysyła na **`BACKEND_URL`** `/analyze`.

### BPMN i DMN (przykłady)

| Plik | Link | Uwagi |
|------|------|--------|
| BPMN | [`bpmn/hbg-loan-process.bpmn`](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/bpmn/hbg-loan-process.bpmn) | `hbg-loan-process`, task **`ai-loan-analysis`**, DMN **`scoring-rules`**, wynik **`riskTier`**. |
| DMN | [`dmn/scoring-rules.dmn`](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/dmn/scoring-rules.dmn) | `scoring-rules`, wejście **`risk_score`**. |

Wdróż **oba** w Modelerze do tego samego klastra co w sekcji 6.

### Lokalnie worker + port-forward

```bash
cd worker
python3 -m venv .venv && . .venv/bin/activate
pip install -r requirements.txt
export PYTHONPATH="${PWD}"
export ZEEBE_ADDRESS=127.0.0.1:26500
export BACKEND_URL=http://127.0.0.1:8000
python -m app.main
```

### Instancja procesu ([`zbctl`](https://docs.camunda.io/docs/apis-tools/cli-client/))

```bash
zbctl create instance hbg-loan-process --variables '{"application":{"income":8000,"debt":1000}}'
```

---

## Nawigacja

- [Operations: Deployment](/pl/ops/deployment) · [Pulumi IaC](/pl/infra-pulumi-iac)  
- **English:** [Camunda GKE + Modeler](/en/camunda-gke-deploy-modeler) · **Русский:** [Camunda GKE + Modeler](/ru/camunda-gke-deploy-modeler)

---

## Przykładowe oczekiwane wyjście (bash)

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
