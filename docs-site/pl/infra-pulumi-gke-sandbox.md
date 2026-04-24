# Pulumi: stos `gke-infra` (GKE, Cloud SQL, GCS, Artifact Registry)

**Cel:** katalog [`infra/pulumi/gke-infra/`](https://github.com/OlehKondratow/credit-scoring-camunda/tree/develop/infra/pulumi/gke-infra) to **osobny** projekt Pulumi (własny `Pulumi.yaml`) — nie mylić z głównym [`infra/pulumi/`](https://github.com/OlehKondratow/credit-scoring-camunda/tree/develop/infra/pulumi). Program [__main__.py](https://github.com/OlehKondratow/credit-scoring-camunda/blob/develop/infra/pulumi/gke-infra/__main__.py) tworzy **VPC + PSA**, **Artifact Registry**, bucket **GCS** (wersjonowanie), **prywatny** **Cloud SQL (PostgreSQL 15)** (bez publicznego IPv4) oraz **regionalny** klaster **GKE** w **europe-central2** (domyślnie; `gcp:region`).

**Kanon** produkcyjnego IaC w tym repozytorium to **`infra/pulumi/`** (domyślnie **europe-central2**, prefiksy `hbg-*`). **Nie** uruchamiaj obu stosów w jednym projekcie GCP bez planu nazw, VPC i state.

**Specyfikacja (EN, pełna):** [infra-pulumi-gke-sandbox →](/en/infra-pulumi-gke-sandbox) · **RU:** [→](/infra-pulumi-gke-sandbox) · w repo: [`README.md`](https://github.com/OlehKondratow/credit-scoring-camunda/blob/develop/infra/pulumi/gke-infra/README.md).

---

## Skrót (co robi stos)

| Zasób | GCP | W kodzie |
|-------|-----|----------|
| VPC + PSA | Peering, prywatny IP dla SQL | `10.40.0.0/20`, secondary pods/services |
| Artifact Registry | Docker | `cs-sandbox-docker`, `europe-central2` |
| GCS | Bucket | nazwa z sufiksem, versioning |
| Cloud SQL | PostgreSQL 15 | tylko prywatny IP, `db-f1-micro` (lab) |
| GKE | Klaster + pula | `cs-sandbox-cluster`, 1×`e2-standard-4`, `oauth_scopes=[]`, Workload Identity |

**Eksporty Pulumi:** `gcp_project`, `gcp_region`, `connect_cmd`, `bucket_url`, `artifact_registry_url`, `cloud_sql_private_ip`, `cloud_sql_connection_name`.

## Pierwsze kroki (skrót)

```bash
cd infra/pulumi/gke-infra
python3 -m venv venv && . venv/bin/activate && pip install -r requirements.txt
pulumi stack init dev
pulumi config set gcp:project YOUR_GCP_PROJECT_ID
pulumi config set gcp:region europe-central2
pulumi up
```

`kubectl`: `gcloud container clusters get-credentials cs-sandbox-cluster --region europe-central2` — szczegóły: [EN →](/en/infra-pulumi-gke-sandbox). API: [`scripts/gcp-enable-apis-iam.sh`](https://github.com/OlehKondratow/credit-scoring-camunda/blob/develop/scripts/gcp-enable-apis-iam.sh), mapa: [INFRA-IMPLEMENTATION](/pl/INFRA-IMPLEMENTATION), role: [gcp-saas-access-matrix-11x6.md](/pl/gcp-saas-access-matrix-11x6) i [prompt](/pl/prompt) §9.

Główne różnice wobec głównego `infra/pulumi/`: ten plik to **osobna** piaskownica z prefiksem `cs-sandbox-*` — nadal unikaj dwóch `pulumi up` w jednym projekcie bez planu (kolizje **VPC, PSA, SQL**).
