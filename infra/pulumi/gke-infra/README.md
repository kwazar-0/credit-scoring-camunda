# gke-infra (Pulumi) — GKE, private Cloud SQL, GCS, Artifact Registry

Pulumi app for a **sandbox** stack in **europe-central2** per repo policy: **Cloud SQL has no public IPv4** (private IP + PSA), GKE with **Workload Identity** and **empty** node `oauth_scopes`, regional GKE with private nodes and a public control plane endpoint (kubectl from a workstation with network access to the API).

## Prerequisites

- Pulumi CLI, Python 3.10+, `gcloud` and GCP project with billing
- `pulumi login` and `gcloud config set project <id>`

## Config

- `gcp:project` — required
- `gcp:region` — default `europe-central2` (do not set a legacy zone; cluster is **regional**)

Example (`Pulumi.dev.yaml` is a template; adjust project ID):

```yaml
config:
  gcp:project: your-gcp-project-id
  gcp:region: europe-central2
```

## Deploy

Use the same `pulumi-gcp` major version as `../requirements.txt` (shared `venv` under `infra/pulumi/` is fine).

```bash
cd infra/pulumi/gke-infra
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
pulumi stack select dev   # or create: pulumi stack init dev
pulumi up
```

## Outputs

- `connect_cmd` — `gcloud container clusters get-credentials ... --region europe-central2 ...`
- `bucket_url` — GCS data bucket
- `artifact_registry_url` — `REGION-docker.pkg.dev/PROJECT/REPO`
- `cloud_sql_private_ip` — private DB IP (reachable from VPC/GKE, not the internet)
- `cloud_sql_connection_name` — for Cloud SQL Auth Proxy or connector

## Migrating from an older stack (e.g. public SQL, different region)

Re-pointing the same Pulumi stack at this program may **replace** VPC, SQL, and cluster. Run `pulumi preview` and plan for one-time migration (new stack name, or destroy + recreate, or manual import) if you need zero disruption.

## Layout

- `__main__.py` — single-file stack (VPC, PSA, Cloud SQL, GKE, GCS, Artifact Registry, APIs)
