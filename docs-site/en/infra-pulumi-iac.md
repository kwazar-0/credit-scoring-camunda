# Pulumi: GCP IaC in this repository

**Source of truth:** [`infra/pulumi/`](https://github.com/kwazar-0/credit-scoring-camunda/tree/develop/infra/pulumi), optional sandbox [`infra/pulumi/gke-infra/`](https://github.com/kwazar-0/credit-scoring-camunda/tree/develop/infra/pulumi/gke-infra). Default region: **`europe-central2`**.

Stack behaviour is selected with **`credit-scoring:stackRole`**.

| `stackRole` | Purpose |
|-------------|---------|
| `legacy` (default) | GCS (raw / emb / processed, versioning), BigQuery, Artifact Registry, optional GitHub WIF. |
| `infra-core` | Network, Private Service Access, optional WIF. |
| `infra-data` | Versioned GCS, BQ, optional **private** Cloud SQL (`createCloudSql`, `coreStackRef`). |
| `infra-runtime` | GKE (Workload Identity, minimal node OAuth), Artifact Registry; requires `coreStackRef`. |

**Apps** (Helm / Argo) are **out of scope** for this Pulumi program.

## Why Pulumi and `stackRole` (alternatives)

**IaC tool:** **Terraform** and **CDK** reach the same outcome (“plan → apply”). **Pulumi (Python)** here aligns with the monorepo language and allows shared helpers/types under `infra/pulumi/*.py`; a modular move to Terraform is possible if the org standardises on HCL.

**`legacy` vs split (`infra-core` / `infra-data` / `infra-runtime`):** `legacy` is a **deliberate small-footprint mode** (fewer stacks and refs) at the cost of a mixed blast radius. Split is the **default maturity path**: network/PSA separated from data and from the compute cluster so a GKE change does not drag SQL recreation and vice versa.

**Why not three separate IaC repos:** one repo with stack roles keeps reviews simpler for changes that almost always touch both network and runtime. **Split repos when:** different teams own state at org level and need hard repo-level isolation.

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

Config example: [`Pulumi.dev.yaml.example`](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/infra/pulumi/Pulumi.dev.yaml.example). Pointers: [`infra/README.md`](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/infra/README.md) — **full pet-project runbook** (billing, ADC/quota project, IAM, Pulumi state bucket, `infra-core`, split stacks, common errors).

**Split stacks:** run `pulumi up` for **`infra-core` first**, then data/runtime with `credit-scoring:coreStackRef` set to the **full core stack name** (Pulumi format, e.g. `org/credit-scoring-infra/dev-core`). Prefer **one Pulumi stack per role** (`dev-core`, `dev-data`, `dev-runtime`) so different `stackRole` values do not share one stack state.

For `infra-data` with `createCloudSql: true`, set an instance name: `pulumi config set credit-scoring:cloudSqlInstanceName <name>` (see [`Pulumi.dev.yaml.example`](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/infra/pulumi/Pulumi.dev.yaml.example)).

## On this site

- [INFRA-IMPLEMENTATION.md](INFRA-IMPLEMENTATION.md) — delivery phases.  
- [cli-console.md](cli-console.md) — CLI.  
- [gcp-saas-access-matrix-11x6.md](gcp-saas-access-matrix-11x6.md) — roles × GCP.  
- [prompt.md](prompt.md) — handoff and §9+.

RUS: [ /infra-pulumi-iac ](/ru/infra-pulumi-iac).
