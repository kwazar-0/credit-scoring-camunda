# Operations: CI/CD

## Lifecycle pipeline

```text
Build -> Test -> Security Scan -> Package -> Deploy -> Promote
```

## Kontrole

- Build once, promote same artifact digest.
- CI gates: lint, testy, security/dependency checks.
- CD gates: approvals, environment checks, rollout health.
- Dowody audytowe: commit, digest, approvals i wynik wdrozenia.

## Promotion path

`dev` -> `stage` -> `prod` bez pomijania etapow.

## GitHub + Registry setup (manualny test CD)

Ten rozdzial dotyczy **GitHub Environment**, **WIF secrets** i lokalnego testu **Artifact Registry**. Szczegoly Camunda/Modeler: [camunda-gke-deploy-modeler](/pl/camunda-gke-deploy-modeler).

### GitHub Environment

- Utworz environment: `GCP_WORKLOAD`.
- Dodaj sekrety:
  - `GCP_WORKLOAD_IDENTITY_PROVIDER`
  - `GCP_GITHUB_ACTIONS_SA_EMAIL`

### Manualny workflow

- Plik: `.github/workflows/manual-build-push-deploy-gke.yml`
- Trigger: `workflow_dispatch`
- Pierwszy run (typowo):
  - `service=worker`
  - `gcp_project_id=credit-scoring-camunda-project`
  - `gcp_region=europe-central2`
  - `gke_cluster=hbg-gke`
  - `gke_namespace=hbg`
  - `artifact_repository=hbg-gke-docker`

### Lokalny smoke check Artifact Registry

```bash
gcloud config set project credit-scoring-camunda-project
gcloud auth configure-docker europe-central2-docker.pkg.dev --quiet
docker pull hello-world:latest
docker tag hello-world:latest europe-central2-docker.pkg.dev/credit-scoring-camunda-project/hbg-gke-docker/push-test:local-1
docker push europe-central2-docker.pkg.dev/credit-scoring-camunda-project/hbg-gke-docker/push-test:local-1
docker pull europe-central2-docker.pkg.dev/credit-scoring-camunda-project/hbg-gke-docker/push-test:local-1
```

Oczekiwane linie:

```text
gcloud credential helpers already registered correctly.
...
local-1: digest: sha256:... size: ...
```

### Typowe bledy i szybkie poprawki

- `Not found: ... clusters/hbg-gke`: mismatch project/cluster. Dla tego klastra ustaw `gcp_project_id=credit-scoring-camunda-project`.
- `artifactregistry.repositories.uploadArtifacts denied`: nadaj GitHub SA role `roles/artifactregistry.writer` w **docelowym** projekcie.
- `Repository "... not found"`: utworz Docker repository (np. `hbg-gke-docker`) w `europe-central2`.

## Navigation

- Entry page: [main](/pl/main)
- Camunda deploy + Modeler: [camunda-gke-deploy-modeler](/pl/camunda-gke-deploy-modeler)
- Deployment: [ops/deployment](/pl/ops/deployment)
- Observability: [ops/observability](/pl/ops/observability)
- Incidents: [ops/incidents](/pl/ops/incidents)
