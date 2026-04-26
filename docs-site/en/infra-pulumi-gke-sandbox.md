# Pulumi `gke-infra` stack (GKE, Cloud SQL, GCS, Artifact Registry)

**Scope:** [`infra/pulumi/gke-infra/`](https://github.com/kwazar-0/credit-scoring-camunda/tree/develop/infra/pulumi/gke-infra) is a **standalone** Pulumi project (its own `Pulumi.yaml`, separate from [`infra/pulumi/`](https://github.com/kwazar-0/credit-scoring-camunda/tree/develop/infra/pulumi)). The program [__main__.py](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/infra/pulumi/gke-infra/__main__.py) provisions **Artifact Registry**, a **GCS bucket**, **private Cloud SQL (PostgreSQL 15)** and a **regional GKE** cluster in **europe-central2** (configurable as `gcp:region`, default `europe-central2`). It is a sandbox all-in-one stack. The **canonical** product IaC in this repository is still **`infra/pulumi/`** (default **`europe-central2`**, `hbg-*` naming). **Do not** apply both projects to the same GCP project without a deliberate resource naming and state plan.

**Also:** [Russian version of this page →](/ru/infra-pulumi-gke-sandbox) · in-repo: [`README.md`](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/infra/pulumi/gke-infra/README.md).

---

## 1. What the Pulumi program creates (from `__main__.py`)

| Pulumi resource | Google Cloud | Parameters in code | Purpose |
|-----------------|--------------|--------------------|---------|
| `compute.Network` + `Subnetwork` | VPC, subnet, secondary IP ranges for pods/services | CIDRs `10.40.0.0/20` primary; `pods` / `services` secondaries; **europe-central2** | GKE and PSA routing. |
| `compute.GlobalAddress` + `servicenetworking.Connection` | Private Service Access | `/16` range for peering | **Private IP** for Cloud SQL. |
| `artifactregistry.Repository` | Artifact Registry (Docker) | `location = region`, `repository_id = cs-sandbox-docker` | Push/pull images (hostname `REGION-docker.pkg.dev`). |
| `storage.Bucket` | GCS | Name `PROJECT-cs-sandbox-data-<suffix>`, `location = region`, versioning on, uniform access | Object storage. |
| `sql.DatabaseInstance` | Cloud SQL | `POSTGRES_15`, `ipv4_enabled=False`, `private_network=…`, `db-f1-micro` | **No public IPv4**; reachable from VPC. |
| `container.Cluster` | GKE | `name = cs-sandbox-cluster`, **regional** `location=region`, private nodes, public control plane endpoint, **Workload Identity** | Control plane. |
| `container.NodePool` | GKE node pool | `e2-standard-4`, 1 node, **`oauth_scopes = []`**, GKE default SA | Prefer **Workload Identity** for GCP API access. |

**Stack exports:** `gcp_project`, `gcp_region`, `connect_cmd`, `bucket_url`, `artifact_registry_url`, `cloud_sql_private_ip`, `cloud_sql_connection_name` (for proxy / connector; **no** public DB IP is exported by design).

---

## 2. Region and project layout

- **Regional** GKE and regional Cloud SQL/AR/GCS: **`europe-central2`** (default) via `gcp:region` — same default as the monorepo policy in [.cursorrules](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/.cursorrules).
- Resource name prefix in code: **`cs-sandbox-*`**, not `hbg-*` from the main Pulumi app — still a separate stack and state file.
- `Pulumi.dev.yaml` in the folder may use a **placeholder** project id; set `gcp:project` in your stack.

---

## 3. Prerequisites

- **Tools:** Pulumi CLI, `gcloud`, `kubectl`, Docker, `helm` (if deploying apps), Python 3.10+.
- **GCP:** billing, APIs enabled by the Pulumi `projects.Service` resources (compute, servicenetworking, container, sqladmin, storage, artifactregistry). You can also use: [`scripts/gcp-enable-apis-iam.sh`](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/scripts/gcp-enable-apis-iam.sh) for baseline IAM/API enablement.
- **Auth:** `gcloud auth application-default login` (or a service account key — do not commit).
- **Python:** `cd infra/pulumi/gke-infra && python3 -m venv venv && . venv/bin/activate && pip install -r requirements.txt` (uses `pulumi-random` for bucket name suffix).

---

## 4. First deploy

```bash
cd infra/pulumi/gke-infra
python3 -m venv venv && . venv/bin/activate
pip install -r requirements.txt
pulumi stack init dev
pulumi config set gcp:project YOUR_GCP_PROJECT_ID
pulumi config set gcp:region europe-central2
pulumi preview
pulumi up
```

**State:** `pulumi login` (SaaS), `pulumi login --local`, or `pulumi login gs://YOUR_STATE_BUCKET` (create bucket + IAM first).

---

## 5. After `pulumi up`

### kubectl

```bash
gcloud container clusters get-credentials cs-sandbox-cluster --region europe-central2
```

(Use `pulumi stack output connect_cmd` for the exact string including project.)

### Artifact Registry

Pattern: `europe-central2-docker.pkg.dev/PROJECT_ID/cs-sandbox-docker/IMAGE:TAG`

```bash
gcloud auth configure-docker europe-central2-docker.pkg.dev
docker tag my-app:latest europe-central2-docker.pkg.dev/PROJECT_ID/cs-sandbox-docker/my-app:1.0.0
docker push europe-central2-docker.pkg.dev/PROJECT_ID/cs-sandbox-docker/my-app:1.0.0
```

### Cloud SQL

Private IP only. Use `pulumi stack output cloud_sql_private_ip` and `cloud_sql_connection_name` (e.g. Cloud SQL Auth Proxy from a machine/Pod in the same VPC, or a connector from GKE / Cloud Run on the same network path). `db-f1-micro` is **lab** sizing, not production.

### GCS

Bucket name is unique per run (random suffix on create). **No** `force_destroy` in the current `__main__.py` (destroy behavior follows Pulumi/defaults).

---

## 6. Day-2 and destroy

- Edit `__main__.py` → `pulumi preview` / `pulumi up`.
- `pulumi destroy -y` — then check **Disks**, **GCS**, **Cloud SQL** for leftovers.

---

## 7. Camunda 8 (Helm) — example

The sample node pool is small (**1 × e2-standard-4**). Size Elasticsearch and other components to fit available RAM. Point `worker/` `ZEEBE_ADDRESS` at your in-cluster gateway (see [`k8s/hbg/`](https://github.com/kwazar-0/credit-scoring-camunda/tree/develop/k8s/hbg)).

```bash
kubectl create namespace camunda-8
helm repo add camunda https://helm.camunda.io
helm repo update
```

---

## 8. Vertex AI / GCP APIs from pods

Node pools use **empty** `oauth_scopes`; do not rely on broad `cloud-platform` scope. Prefer **Workload Identity**–bound GSA for APIs such as Vertex (`google-cloud-aiplatform`) — see [infra-pulumi-iac](infra-pulumi-iac.md) and [matrix](gcp-saas-access-matrix-11x6.md). Enable `aiplatform.googleapis.com` if you use Vertex.

---

## 9. Conflict with `infra/pulumi/`

| | `gke-infra` | Main `infra/pulumi/` |
|---|------------|------------------------|
| Default region | `europe-central2` (stack config) | `europe-central2` (default) |
| Prefix / naming | `cs-sandbox-*` | e.g. `hbg-*` and stack roles |
| Data | GCS + private SQL; no BQ in this file | GCS + BQ `hbg_analytics`, etc. (when enabled) |

Use **separate GCP projects** or rename before running both, to avoid clashing **VPC, PSA, and SQL** resources.

---

## 10. Troubleshooting and security (short)

- Quota: SSD, IPs, GKE CPU. Cloud SQL: slow to create. PSA: ensure peering is ready before the SQL instance.
- **No** public SQL; access from the internet to the database requires a deliberate jump host / VPN / proxy path — by design.
- No SA JSON keys in Git; use WIF and [prompt](/en/prompt) §9 for hardening.

*Aligned with `infra/pulumi/gke-infra/__main__.py`; re-read the file if the code changes.*
