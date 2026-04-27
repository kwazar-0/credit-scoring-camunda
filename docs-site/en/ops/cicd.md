# Operations: CI/CD

## Pipeline lifecycle

```text
Build -> Test -> Security Scan -> Package -> Deploy -> Promote
```

## Controls

- Build once and promote same artifact digest through environments.
- CI gates: lint, unit/integration tests, security and dependency checks.
- CD gates: approvals, environment checks, and rollout health validation.
- Release evidence includes commit, artifact digest, approvals, and deployment result.

## Promotion

- No direct prod deployment from feature branches.
- Promotion path: `dev` -> `stage` -> `prod`.

## GitHub + Registry setup (manual test CD)

Use this section for **GitHub Environment**, **WIF secrets**, and **Artifact Registry** checks. Keep Camunda runtime details in [camunda-gke-deploy-modeler](/en/camunda-gke-deploy-modeler).

### Required GitHub Environment

- Create environment: `GCP_WORKLOAD`.
- Add environment secrets:
  - `GCP_WORKLOAD_IDENTITY_PROVIDER`
  - `GCP_GITHUB_ACTIONS_SA_EMAIL`

### Manual workflow

- Workflow file: `.github/workflows/manual-build-push-deploy-gke.yml`
- Trigger: `workflow_dispatch`
- Status: validated in this repo (build -> push -> GKE deploy path is working with current settings).
- Typical first run:
  - `service=worker`
  - `gcp_project_id=credit-scoring-camunda-project`
  - `gcp_region=europe-central2`
  - `gke_cluster=hbg-gke`
  - `gke_namespace=hbg`
  - `artifact_repository=hbg-gke-docker`

### Local Artifact Registry smoke check

```bash
gcloud config set project credit-scoring-camunda-project
gcloud auth configure-docker europe-central2-docker.pkg.dev --quiet
docker pull hello-world:latest
docker tag hello-world:latest europe-central2-docker.pkg.dev/credit-scoring-camunda-project/hbg-gke-docker/push-test:local-1
docker push europe-central2-docker.pkg.dev/credit-scoring-camunda-project/hbg-gke-docker/push-test:local-1
docker pull europe-central2-docker.pkg.dev/credit-scoring-camunda-project/hbg-gke-docker/push-test:local-1
```

Expected key lines:

```text
gcloud credential helpers already registered correctly.
...
local-1: digest: sha256:... size: ...
```

### Common failures and quick fixes

- `Not found: ... clusters/hbg-gke` in workflow: project/cluster mismatch. Use `gcp_project_id=credit-scoring-camunda-project`.
- `artifactregistry.repositories.uploadArtifacts denied`: grant `roles/artifactregistry.writer` to the GitHub SA in the **target** project.
- `Repository "... not found"`: create Docker repository (e.g. `hbg-gke-docker`) in `europe-central2`.
- `exec: executable gke-gcloud-auth-plugin not found`: install plugin in runner before `kubectl` steps (already added to manual workflow).

## Access and CI validation by stage (bash + expected output)

### Stage 1. WIF / Service Account (GCP)

```bash
gcloud iam workload-identity-pools describe github-actions-pool \
  --location=global \
  --project=uplifted-env-494515-m5

gcloud iam workload-identity-pools providers describe github-provider \
  --location=global \
  --workload-identity-pool=github-actions-pool \
  --project=uplifted-env-494515-m5
```

Expected:

```text
state: ACTIVE
name: projects/.../workloadIdentityPools/github-actions-pool
...
state: ACTIVE
name: projects/.../providers/github-provider
```

### Stage 2. SA IAM roles in cluster project

```bash
gcloud projects get-iam-policy credit-scoring-camunda-project \
  --flatten="bindings[].members" \
  --filter="bindings.members:serviceAccount:github-actions-ci@uplifted-env-494515-m5.iam.gserviceaccount.com" \
  --format="table(bindings.role)"
```

Expected minimum:

```text
ROLE
roles/artifactregistry.writer
roles/container.developer
```

### Stage 3. Local Artifact Registry push/pull

```bash
docker tag hello-world:latest europe-central2-docker.pkg.dev/credit-scoring-camunda-project/hbg-gke-docker/push-test:local-1
docker push europe-central2-docker.pkg.dev/credit-scoring-camunda-project/hbg-gke-docker/push-test:local-1
docker pull europe-central2-docker.pkg.dev/credit-scoring-camunda-project/hbg-gke-docker/push-test:local-1
```

Expected:

```text
...: Pushed
local-1: digest: sha256:... size: ...
Status: Image is up to date for ...
```

### Stage 4. Cluster presence in target project

```bash
gcloud container clusters list --project=credit-scoring-camunda-project --region=europe-central2
```

Expected:

```text
NAME     LOCATION         ...  STATUS
hbg-gke  europe-central2  ...  RUNNING
```

### Stage 5. Manual workflow (GitHub Actions)

Run with:

```text
service=worker
gcp_project_id=credit-scoring-camunda-project
gcp_region=europe-central2
gke_cluster=hbg-gke
gke_namespace=hbg
artifact_repository=hbg-gke-docker
```

Key steps and expected output:

```text
Authenticate to Google Cloud (WIF) -> success
Build Docker image -> success
Push Docker image -> digest sha256:...
Configure kubectl context -> kubeconfig entry generated for hbg-gke
Wait rollout -> deployment "credit-worker" successfully rolled out
Post-deploy smoke -> kubectl get pods / logs without fatal errors
```

## Navigation

- Entry page: [main](/en/main)
- Camunda deploy + Modeler: [camunda-gke-deploy-modeler](/en/camunda-gke-deploy-modeler)
- Deployment: [ops/deployment](/en/ops/deployment)
- Observability: [ops/observability](/en/ops/observability)
- Incidents: [ops/incidents](/en/ops/incidents)
