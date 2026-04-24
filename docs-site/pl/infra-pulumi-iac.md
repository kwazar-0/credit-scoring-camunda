# Pulumi: IaC (GCP) w repozytorium

**Źródło prawdy w kodzie:** [`infra/pulumi/`](https://github.com/OlehKondratow/credit-scoring-camunda/tree/develop/infra/pulumi), opcjonalnie [`infra/pulumi/gke-infra/`](https://github.com/OlehKondratow/credit-scoring-camunda/tree/develop/infra/pulumi/gke-infra). Region domyślny: **`europe-central2`**.

Zachowanie wybiera **`credit-scoring:stackRole`**.

| `stackRole` | Rola |
|-------------|------|
| `legacy` (domyślny) | GCS (warianty, versioning), BigQuery, Artifact Registry, opcj. GitHub WIF. |
| `infra-core` | Sieć, Private Service Access, opcj. WIF. |
| `infra-data` | Wersjonowane GCS, BQ, opcj. **prywatny** Cloud SQL (`createCloudSql`, `coreStackRef`). |
| `infra-runtime` | GKE (Workload Identity, wąskie OAuth), Artifact Registry; wymaga `coreStackRef`. |

**Aplikacje** (Helm/Argo) **nie** są w tym programie Pulumi.

## Start lokalny

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

Przykład configu: [`Pulumi.dev.yaml.example`](https://github.com/OlehKondratow/credit-scoring-camunda/blob/develop/infra/pulumi/Pulumi.dev.yaml.example). Wskazówki: [`infra/README.md`](https://github.com/OlehKondratow/credit-scoring-camunda/blob/develop/infra/README.md).

## Strony na tej witrynie

- [INFRA-IMPLEMENTATION.md](INFRA-IMPLEMENTATION.md) — fazy.  
- [cli-console.md](cli-console.md) — CLI.  
- [gcp-saas-access-matrix-11x6.md](gcp-saas-access-matrix-11x6.md) — role × GCP.  
- [prompt.md](prompt.md) — handoff, §9+.

RUS: [ /infra-pulumi-iac ](/infra-pulumi-iac).
