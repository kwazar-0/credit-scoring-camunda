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
- Typical first run:
  - `service=worker`
  - `gcp_project_id=uplifted-env-494515-m5`
  - `gcp_region=europe-central2`
  - `gke_cluster=hbg-gke`
  - `gke_namespace=hbg`
  - `artifact_repository=hbg-gke-docker`

### Local Artifact Registry smoke check

```bash
gcloud config set project uplifted-env-494515-m5
gcloud auth configure-docker europe-central2-docker.pkg.dev --quiet
docker pull hello-world:latest
docker tag hello-world:latest europe-central2-docker.pkg.dev/uplifted-env-494515-m5/hbg-gke-docker/push-test:local-1
docker push europe-central2-docker.pkg.dev/uplifted-env-494515-m5/hbg-gke-docker/push-test:local-1
docker pull europe-central2-docker.pkg.dev/uplifted-env-494515-m5/hbg-gke-docker/push-test:local-1
```

Expected key lines:

```text
gcloud credential helpers already registered correctly.
...
local-1: digest: sha256:... size: ...
```

## Navigation

- Entry page: [main](/en/main)
- Camunda deploy + Modeler: [camunda-gke-deploy-modeler](/en/camunda-gke-deploy-modeler)
- Deployment: [ops/deployment](/en/ops/deployment)
- Observability: [ops/observability](/en/ops/observability)
- Incidents: [ops/incidents](/en/ops/incidents)
