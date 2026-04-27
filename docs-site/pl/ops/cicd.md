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
- Status: zweryfikowany w tym repo (sciezka build -> push -> deploy do GKE dziala).
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
- `exec: executable gke-gcloud-auth-plugin not found`: zainstaluj plugin w runnerze przed krokami `kubectl` (w manual workflow juz dodane).

## Walidacja dostepu i CI po etapach (bash + expected output)

### Etap 1. WIF / Service Account (GCP)

```bash
gcloud iam workload-identity-pools describe github-actions-pool \
  --location=global \
  --project=uplifted-env-494515-m5

gcloud iam workload-identity-pools providers describe github-provider \
  --location=global \
  --workload-identity-pool=github-actions-pool \
  --project=uplifted-env-494515-m5
```

Oczekiwane:

```text
state: ACTIVE
name: projects/.../workloadIdentityPools/github-actions-pool
...
state: ACTIVE
name: projects/.../providers/github-provider
```

### Etap 2. Role SA w projekcie klastra

```bash
gcloud projects get-iam-policy credit-scoring-camunda-project \
  --flatten="bindings[].members" \
  --filter="bindings.members:serviceAccount:github-actions-ci@uplifted-env-494515-m5.iam.gserviceaccount.com" \
  --format="table(bindings.role)"
```

Minimum:

```text
ROLE
roles/artifactregistry.writer
roles/container.developer
```

### Etap 3. Lokalny Artifact Registry push/pull

```bash
docker tag hello-world:latest europe-central2-docker.pkg.dev/credit-scoring-camunda-project/hbg-gke-docker/push-test:local-1
docker push europe-central2-docker.pkg.dev/credit-scoring-camunda-project/hbg-gke-docker/push-test:local-1
docker pull europe-central2-docker.pkg.dev/credit-scoring-camunda-project/hbg-gke-docker/push-test:local-1
```

Oczekiwane:

```text
...: Pushed
local-1: digest: sha256:... size: ...
Status: Image is up to date for ...
```

### Etap 4. Klaster w projekcie docelowym

```bash
gcloud container clusters list --project=credit-scoring-camunda-project --region=europe-central2
```

Oczekiwane:

```text
NAME     LOCATION         ...  STATUS
hbg-gke  europe-central2  ...  RUNNING
```

### Etap 5. Manual workflow (GitHub Actions)

Uruchom z:

```text
service=worker
gcp_project_id=credit-scoring-camunda-project
gcp_region=europe-central2
gke_cluster=hbg-gke
gke_namespace=hbg
artifact_repository=hbg-gke-docker
```

Kluczowe kroki i expected output:

```text
Authenticate to Google Cloud (WIF) -> success
Build Docker image -> success
Push Docker image -> digest sha256:...
Configure kubectl context -> kubeconfig entry generated for hbg-gke
Wait rollout -> deployment "credit-worker" successfully rolled out
Post-deploy smoke -> kubectl get pods / logs without fatal errors
```

## Navigation

- Entry page: [main](/pl/main)
- Camunda deploy + Modeler: [camunda-gke-deploy-modeler](/pl/camunda-gke-deploy-modeler)
- Deployment: [ops/deployment](/pl/ops/deployment)
- Observability: [ops/observability](/pl/ops/observability)
- Incidents: [ops/incidents](/pl/ops/incidents)
