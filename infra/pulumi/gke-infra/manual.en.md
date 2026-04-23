# gke-infra: detailed manual (Pulumi, GCP, GKE)

**Scope:** this folder is a **standalone** Pulumi project (`Pulumi.yaml`, separate from `../` in the monorepo). The program in `__main__.py` provisions **Artifact Registry**, a **GCS bucket**, a **Cloud SQL (PostgreSQL 15)** instance, and a **GKE** cluster with a **dedicated node pool** in **europe-west1** / **europe-west1-b**. It is a sandbox / all-in-one stack; the canonical product IaC in this repository uses **`infra/pulumi/`** (typically **`europe-central2`**, `hbg-*` naming). **Do not** apply both projects to the same GCP project without a deliberate resource naming and state plan.

**Related:** [manual.md](manual.md) (Russian summary). **Docs site:** [docs-site/infra-pulumi-gke-sandbox.md](../../../docs-site/infra-pulumi-gke-sandbox.md) · [EN](../../../docs-site/en/infra-pulumi-gke-sandbox.md)

---

## 1. What the Pulumi program creates (from `__main__.py`)

| Pulumi resource | Google Cloud | Parameters in code | Purpose |
|-----------------|--------------|--------------------|---------|
| `artifactregistry.Repository` `"ai-repo"` | Artifact Registry (Docker) | `location = europe-west1`, `repository_id = credit-scoring-repo` | Push/pull container images. |
| `storage.Bucket` `"data-bucket"` | GCS | `name = credit-scoring-app-data`, `location = europe-west1`, `force_destroy = true` | App / ML / general object storage (see security note on `force_destroy`). |
| `sql.DatabaseInstance` `"postgres-instance"` | Cloud SQL | `POSTGRES_15`, region `europe-west1`, tier `db-f1-micro`, **public IPv4** enabled | PostgreSQL (metadata / Camunda-style workloads for experiments). **Not** sized for production. |
| `container.Cluster` `"gke-cluster"` | GKE | `name = credit-scoring-cluster`, `location = europe-west1-b` (zonal), `remove_default_node_pool = true`, `deletion_protection = false` | Kubernetes control plane + placeholder pool removed. |
| `container.NodePool` `"primary-nodes"` | GKE node pool | `node_count = 4`, `e2-standard-4` per node, `disk_size_gb = 25`, `oauth_scopes = [cloud-platform]` | Workloads: Camunda / services / AI sidecars. **Total** cluster: **16 vCPUs, 64 GiB RAM** (4 × 4 vCPU, 4 × 16 GiB). |

**Constants in code (not yet externalised to `pulumi config`):**

- `config_name = "credit-scoring"`
- `config_region = "europe-west1"`
- `config_zone = "europe-west1-b"`

**Stack exports:**

- `connect_cmd` — shell command to fetch kube credentials for `credit-scoring-cluster` in `europe-west1-b`.
- `db_ip` — `DatabaseInstance` **first** assigned IP (see `first_ip_address` in the Pulumi provider).
- `bucket_name` — GCS bucket URL (from `data_bucket.url`).

---

## 2. Region and project layout

- **Zonal** GKE: cluster and node pool live in **`europe-west1-b`**.
- **Regional** resources (Artifact Registry, GCS, Cloud SQL): **`europe-west1`**.
- The monorepo default data region in `.cursorrules` is **`europe-central2`**. This stack intentionally uses **west1**; align networking and compliance if you merge paths later.

**`Pulumi.dev.yaml` example keys:** `gcp:project` (set to your real project), `gcp:zone: europe-west1-b`. The project name in the checked-in file is a **placeholder** (`my-camunda8-project`).

**`Pulumi.yaml`:** project `name: my-gcp-infra` is still template text; rename the Pulumi project when you adopt the stack in production to avoid confusion.

---

## 3. Prerequisites

- **Tools:** Pulumi CLI, `gcloud`, `kubectl`, Docker (for image push), `helm` (for Camunda steps below), Python 3.7+.
- **GCP:** billing enabled, required APIs (Container, SQL, Storage, Artifact Registry, Service Networking as needed). You can use repo script `../../../scripts/gcp-enable-apis-iam.sh <PROJECT_ID>` and extend if SQL API is missing.
- **Auth:** `gcloud auth application-default login` (or a service account key with sufficient roles — do not commit keys).
- **Python deps:** from this directory: `python3 -m venv venv && . venv/bin/activate && pip install -r requirements.txt` (`pulumi`, `pulumi-gcp` per `Pulumi.yaml` virtualenv: `venv`).

---

## 4. Pulumi: first deploy

```bash
cd infra/pulumi/gke-infra
python3 -m venv venv && . venv/bin/activate
pip install -r requirements.txt
pulumi stack init dev   # or use an existing stack name
pulumi config set gcp:project YOUR_GCP_PROJECT_ID
# Optional: align with Pulumi.dev.yaml
pulumi config set gcp:zone europe-west1-b
pulumi preview
pulumi up
```

**State backend:** use `pulumi login` (Pulumi Cloud), `pulumi login --local`, or a **GCS** backend, e.g. `pulumi login gs://YOUR_STATE_BUCKET` (create the bucket and IAM separately; the placeholder in the old Russian doc was `gs://my-pulumi-state-unique`).

**Secrets in config:** if your stack uses encrypted config, set `PULUMI_CONFIG_PASSPHRASE` (or the file variant) as required by your team.

---

## 5. After `pulumi up`

### 5.1 Connect `kubectl`

Exact command (also echoed as stack output `connect_cmd`):

```bash
gcloud container clusters get-credentials credit-scoring-cluster --zone europe-west1-b
```

Verify: `kubectl get nodes` — expect **4** nodes from `primary-nodes`.

### 5.2 Artifact Registry

- **Hostname:** `europe-west1-docker.pkg.dev`
- **Repository ID:** `credit-scoring-repo`
- **Image reference pattern:**

  `europe-west1-docker.pkg.dev/PROJECT_ID/credit-scoring-repo/IMAGE:TAG`

**Docker auth and push example:**

```bash
gcloud auth configure-docker europe-west1-docker.pkg.dev
docker tag my-app:latest europe-west1-docker.pkg.dev/PROJECT_ID/credit-scoring-repo/my-app:1.0.0
docker push europe-west1-docker.pkg.dev/PROJECT_ID/credit-scoring-repo/my-app:1.0.0
```

### 5.3 Cloud SQL

- **Engine:** PostgreSQL 15.
- **Tier:** `db-f1-micro` (development only; increase for RAG, Camunda persistence, or concurrent load; see code comment re `db-g1-small` as a next step for “serious” tests).
- **Network:** public IPv4 is **enabled** in code — acceptable for a lab, **not** a hardened production pattern. Prefer **private IP** + Serverless / VPC peering for real environments.

**Connect:** use the **`db_ip`** value from Pulumi output (or `pulumi stack output db_ip`); add Cloud SQL user/password and SSL policy via additional IaC or the console (not defined in this `__main__.py`).

### 5.4 GCS bucket

- **Name:** `credit-scoring-app-data` (global bucket name must be unique; if taken, change `__main__.py` and re-run).
- **`force_destroy: true`** — the bucket (and some contents, per GCP rules) can be removed when the Pulumi resource is deleted. **Do not** use this for regulated production data.

---

## 6. Day-2 operations

- **Change node count, machine type, or disk** — edit `__main__.py` (`NodePool` / `node_config`), then `pulumi preview` and `pulumi up`.
- **Tear down everything in this stack:**

  ```bash
  pulumi destroy -y
  ```

  Afterward, check **Compute Engine → Disks** and **GCS** for orphaned resources, and **Cloud SQL** if destroy failed partway.

---

## 7. Camunda 8 (Helm) — follow-up

After the cluster is healthy:

```bash
kubectl create namespace camunda-8
helm repo add camunda https://helm.camunda.io
helm repo update
```

Install with a `values.yaml` appropriate for your licence and sizing. The node pool has **~64 GiB** total schedulable memory; reserve a realistic slice for **Elasticsearch** or the chosen Camunda 8 **often 8–12+ GiB** for ES in small HA setups (adjust values to your actual chart requirements).

**Zeebe address for workers (example):** when Camunda is installed, point `worker/` env `ZEEBE_ADDRESS` to your gateway service DNS inside the cluster (as in the main monorepo manifests under `k8s/hbg/`, e.g. `…zeebe-gateway…:26500` in the Camunda namespace).

---

## 8. Vertex AI and node identity

GKE nodes use the **`https://www.googleapis.com/auth/cloud-platform`** scope. Workloads on the **default** node identity can use Application Default Credentials with client libraries (e.g. `google-cloud-aiplatform`). For **tighter** control, the main monorepo uses **Workload Identity** and a dedicated GSA for the app — mirror that pattern in this cluster for production.

**Example (application code, not infrastructure):**

```python
from vertexai.generative_models import GenerativeModel
model = GenerativeModel("gemini-1.5-pro")
response = model.generate_content("…")
```

Enable **`aiplatform.googleapis.com`** in the project if not already enabled.

---

## 9. Conflict with `infra/pulumi/` (monorepo main stack)

| Item | `gke-infra` (this project) | Main `infra/pulumi/` |
|------|-----------------------------|------------------------|
| Region | `europe-west1` (code) | `europe-central2` (config default) |
| Artifact Registry ID | `credit-scoring-repo` | `clusterName` + `-docker` (e.g. `hbg-gke-docker`) |
| GCS / BQ | `credit-scoring-app-data` bucket only; no BQ in this file | Randomized emb/raw buckets, `hbg_analytics` dataset, etc. |

Running **both** stacks in the **same** GCP project can duplicate or collide on **Artifact Registry** repository IDs, **bucket** names, or **IAM** assumptions. Use **separate projects** or rename resources before a combined life cycle.

---

## 10. Troubleshooting

- **Quota errors:** raise limits for SSD, `IN_USE_ADDRESSES`, or **GKE** node / CPU quota in the target region/zone.
- **API not enabled:** wait after first enable, or run `gcloud services enable` for `sqladmin`, `container`, `artifactregistry`, `storage`.
- **Pulumi + Cloud SQL:** instance creation is slow; `pulumi up` may take many minutes.
- **Python export errors:** if `db_ip` is empty in preview, the instance may not be created yet; use `pulumi stack output` after a successful `up`.

---

## 11. Security checklist (summary)

- Public Cloud SQL and `db-f1-micro` are **lab defaults** in this template.
- `force_destroy` on the bucket is convenient for **disposable** sandboxes.
- **Never** store long-lived service account **JSON** keys in Git; prefer **WIF** for CI and **Secret Manager** for app secrets.
- For organization policy (Org Policy: disable SA keys, require VPC-SC, etc.), see the main doc `infra/ROLES.md` and `docs-site/prompt.md` §9.

This manual reflects **`__main__.py`** in this directory at the time of writing; re-read the code if behaviour diverges.
