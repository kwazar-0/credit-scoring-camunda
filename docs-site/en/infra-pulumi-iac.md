# Pulumi: GCP IaC in this repository

**Source of truth:** [`infra/pulumi/`](https://github.com/OlehKondratow/credit-scoring-camunda/tree/develop/infra/pulumi), optional sandbox [`infra/pulumi/gke-infra/`](https://github.com/OlehKondratow/credit-scoring-camunda/tree/develop/infra/pulumi/gke-infra). Default region: **`europe-central2`**.

Stack behaviour is selected with **`credit-scoring:stackRole`**.

| `stackRole` | Purpose |
|-------------|---------|
| `legacy` (default) | GCS (raw / emb / processed, versioning), BigQuery, Artifact Registry, optional GitHub WIF. |
| `infra-core` | Network, Private Service Access, optional WIF. |
| `infra-data` | Versioned GCS, BQ, optional **private** Cloud SQL (`createCloudSql`, `coreStackRef`). |
| `infra-runtime` | GKE (Workload Identity, minimal node OAuth), Artifact Registry; requires `coreStackRef`. |

**Apps** (Helm / Argo) are **out of scope** for this Pulumi program.

## Run (local)

```bash
cd infra/pulumi
python3 -m venv venv && . venv/bin/activate
pip install -r requirements.txt
pulumi stack init dev
pulumi config set gcp:project YOUR_GCP_PROJECT_ID
pulumi config set credit-scoring:region europe-central2
pulumi config set credit-scoring:stackRole legacy
pulumi preview
pulumi up
```

Config example: [`Pulumi.dev.yaml.example`](https://github.com/OlehKondratow/credit-scoring-camunda/blob/develop/infra/pulumi/Pulumi.dev.yaml.example). Pointers: [`infra/README.md`](https://github.com/OlehKondratow/credit-scoring-camunda/blob/develop/infra/README.md).

## On this site

- [INFRA-IMPLEMENTATION.md](INFRA-IMPLEMENTATION.md) — delivery phases.  
- [cli-console.md](cli-console.md) — CLI.  
- [gcp-saas-access-matrix-11x6.md](gcp-saas-access-matrix-11x6.md) — roles × GCP.  
- [prompt.md](prompt.md) — handoff and §9+.

RUS: [ /infra-pulumi-iac ](/infra-pulumi-iac).
