# Pulumi `gke-infra` stack (GKE, Cloud SQL, GCS, Artifact Registry)

**Scope:** [`infra/pulumi/gke-infra/`](https://github.com/OlehKondratow/credit-scoring-camunda/tree/develop/infra/pulumi/gke-infra) is a **standalone** Pulumi project (its own `Pulumi.yaml`, separate from [`infra/pulumi/`](https://github.com/OlehKondratow/credit-scoring-camunda/tree/develop/infra/pulumi)). The program [__main__.py](https://github.com/OlehKondratow/credit-scoring-camunda/blob/develop/infra/pulumi/gke-infra/__main__.py) provisions **Artifact Registry**, a **GCS bucket**, **Cloud SQL (PostgreSQL 15)**, and a **GKE** cluster with a **dedicated node pool** in **europe-west1** / **europe-west1-b**. It is a sandbox / all-in-one stack. The **canonical** product IaC in this repository is **`infra/pulumi/`** (default **`europe-central2`**, `hbg-*` naming). **Do not** apply both projects to the same GCP project without a deliberate resource naming and state plan.

**Also:** [Russian version of this page →](/infra-pulumi-gke-sandbox) · copy in repo: [`manual.en.md` / `manual.md`](https://github.com/OlehKondratow/credit-scoring-camunda/tree/develop/infra/pulumi/gke-infra).

---

## 1. What the Pulumi program creates (from `__main__.py`)

| Pulumi resource | Google Cloud | Parameters in code | Purpose |
|-----------------|--------------|--------------------|---------|
| `artifactregistry.Repository` `"ai-repo"` | Artifact Registry (Docker) | `location = europe-west1`, `repository_id = credit-scoring-repo` | Push/pull container images. |
| `storage.Bucket` `"data-bucket"` | GCS | `name = credit-scoring-app-data`, `location = europe-west1`, `force_destroy = true` | App / ML / general object storage (see security note on `force_destroy`). |
| `sql.DatabaseInstance` `"postgres-instance"` | Cloud SQL | `POSTGRES_15`, region `europe-west1`, tier `db-f1-micro`, **public IPv4** enabled | PostgreSQL (metadata / Camunda-style workloads for experiments). **Not** sized for production. |
| `container.Cluster` `"gke-cluster"` | GKE | `name = credit-scoring-cluster`, `location = europe-west1-b` (zonal), `remove_default_node_pool = true`, `deletion_protection = false` | Control plane; default node pool removed. |
| `container.NodePool` `"primary-nodes"` | GKE node pool | `node_count = 4`, `e2-standard-4` per node, `disk_size_gb = 25`, `oauth_scopes = [cloud-platform]` | Workloads. **Total cluster:** **16 vCPUs, 64 GiB RAM** (4 × 4 vCPU, 4 × 16 GiB). |

**Constants in code (not yet externalised to `pulumi config`):** `config_name = "credit-scoring"`, `config_region = "europe-west1"`, `config_zone = "europe-west1-b"`.

**Stack exports:** `connect_cmd` (kubectl credentials command), `db_ip` (first instance IP), `bucket_name` (GCS URL).

---

## 2. Region and project layout

- **Zonal** GKE: **europe-west1-b**. **Regional** services: **europe-west1**.
- The monorepo default for product data is **`europe-central2`** (see [INFRA-IMPLEMENTATION](/en/INFRA-IMPLEMENTATION)). This stack is intentionally **europe-west1**; align networking and policy if you merge paths.
- `Pulumi.dev.yaml` in the folder may use a **placeholder** project id; set `gcp:project` in your stack. `Pulumi.yaml` `name: my-gcp-infra` is still template text — rename when you own the project.

---

## 3. Prerequisites

- **Tools:** Pulumi CLI, `gcloud`, `kubectl`, Docker, `helm`, Python 3.7+.
- **GCP:** billing, APIs (Container, SQL, Storage, Artifact Registry, etc.). From the repo root: [`scripts/gcp-enable-apis-iam.sh`](https://github.com/OlehKondratow/credit-scoring-camunda/blob/develop/scripts/gcp-enable-apis-iam.sh) `PROJECT_ID` (add SQL API if needed).
- **Auth:** `gcloud auth application-default login` (or a service account key — do not commit).
- **Python:** `cd infra/pulumi/gke-infra && python3 -m venv venv && . venv/bin/activate && pip install -r requirements.txt`.

---

## 4. First deploy

```bash
cd infra/pulumi/gke-infra
python3 -m venv venv && . venv/bin/activate
pip install -r requirements.txt
pulumi stack init dev
pulumi config set gcp:project YOUR_GCP_PROJECT_ID
pulumi config set gcp:zone europe-west1-b
pulumi preview
pulumi up
```

**State:** `pulumi login` (SaaS), `pulumi login --local`, or `pulumi login gs://YOUR_STATE_BUCKET` (create bucket + IAM first).

---

## 5. After `pulumi up`

### kubectl

```bash
gcloud container clusters get-credentials credit-scoring-cluster --zone europe-west1-b
```

Expect **4** nodes: `kubectl get nodes`.

### Artifact Registry

Pattern: `europe-west1-docker.pkg.dev/PROJECT_ID/credit-scoring-repo/IMAGE:TAG`

```bash
gcloud auth configure-docker europe-west1-docker.pkg.dev
docker tag my-app:latest europe-west1-docker.pkg.dev/PROJECT_ID/credit-scoring-repo/my-app:1.0.0
docker push europe-west1-docker.pkg.dev/PROJECT_ID/credit-scoring-repo/my-app:1.0.0
```

### Cloud SQL

`db-f1-micro`, **public** IP in code — lab only. Use **`db_ip`** from `pulumi stack output`. Users/passwords/SSL: add via IaC or console (not in this `__main__.py`).

### GCS

Bucket name **`credit-scoring-app-data`** (globally unique). `force_destroy: true` — ok for throwaway envs, not for regulated data.

---

## 6. Day-2 and destroy

- Edit `__main__.py` → `pulumi preview` / `pulumi up`.
- `pulumi destroy -y` — then check **Disks**, **GCS**, **Cloud SQL** for leftovers.

---

## 7. Camunda 8 (Helm)

```bash
kubectl create namespace camunda-8
helm repo add camunda https://helm.camunda.io
helm repo update
```

Size **Elasticsearch** and other components to fit **~64 GiB** cluster RAM (often **8–12+ GiB** for ES in small setups). Point `worker/` `ZEEBE_ADDRESS` at your in-cluster gateway (see [`k8s/hbg/`](https://github.com/OlehKondratow/credit-scoring-camunda/tree/develop/k8s/hbg)).

---

## 8. Vertex AI

Nodes use `cloud-platform` scope — ADC for `google-cloud-aiplatform` in pods. For production, prefer **Workload Identity** (see main stack / [`infra/ROLES.md`](https://github.com/OlehKondratow/credit-scoring-camunda/blob/develop/infra/ROLES.md)). Enable `aiplatform.googleapis.com`.

---

## 9. Conflict with `infra/pulumi/`

| | `gke-infra` | Main `infra/pulumi/` |
|---|------------|------------------------|
| Region | `europe-west1` | `europe-central2` (default) |
| Artifact Registry | `credit-scoring-repo` | e.g. `hbg-gke-docker` |
| Data | one GCS bucket; no BQ in this file | GCS + BQ `hbg_analytics`, etc. |

Use **separate GCP projects** or rename before running both.

---

## 10. Troubleshooting and security (short)

- Quota: SSD, IPs, GKE CPU. APIs: wait after enable. Cloud SQL: slow to create.
- Public SQL + `db-f1-micro` + `force_destroy` = **dev defaults** only. No SA JSON keys in Git; use WIF and [prompt](/prompt) §9 for hardening.

*Aligned with `infra/pulumi/gke-infra/__main__.py`; re-read the file if the code changes.*
