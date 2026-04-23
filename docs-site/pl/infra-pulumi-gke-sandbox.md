# Pulumi: stos `gke-infra` (GKE, Cloud SQL, GCS, Artifact Registry)

**Cel:** katalog [`infra/pulumi/gke-infra/`](https://github.com/OlehKondratow/credit-scoring-camunda/tree/develop/infra/pulumi/gke-infra) to **osobny** projekt Pulumi (własny `Pulumi.yaml`) — nie mylić z głównym [`infra/pulumi/`](https://github.com/OlehKondratow/credit-scoring-camunda/tree/develop/infra/pulumi). Program [__main__.py](https://github.com/OlehKondratow/credit-scoring-camunda/blob/develop/infra/pulumi/gke-infra/__main__.py) tworzy **Artifact Registry**, bucket **GCS**, **Cloud SQL (PostgreSQL 15)** i klaster **GKE** w **europe-west1** / **europe-west1-b** (piaskownica „wszystko w jednym”).

**Kanon** produkcyjnego IaC w tym repozytorium to **`infra/pulumi/`** (domyślnie **europe-central2**, prefiksy `hbg-*`). **Nie** uruchamiaj obu stosów w jednym projekcie GCP bez planu nazw i state.

**Pełna specyfikacja techniczna (EN):** [infra-pulumi-gke-sandbox →](/en/infra-pulumi-gke-sandbox) · **wersja RU:** [infra-pulumi-gke-sandbox (RU) →](/infra-pulumi-gke-sandbox) · pliki w repo: [`manual.md` / `manual.en.md`](https://github.com/OlehKondratow/credit-scoring-camunda/tree/develop/infra/pulumi/gke-infra).

---

## Skrót (co robi stos)

| Zasób | GCP | W kodzie |
|-------|-----|----------|
| Artifact Registry | Docker | `credit-scoring-repo`, `europe-west1` |
| GCS | Bucket | `credit-scoring-app-data`, `force_destroy: true` |
| Cloud SQL | PostgreSQL 15 | `db-f1-micro`, publiczny IPv4 (tylko lab) |
| GKE | Klaster + pula | `credit-scoring-cluster`, 4×`e2-standard-4` w `europe-west1-b` (łącznie 16 vCPU, 64 GiB RAM) |

**Eksporty Pulumi:** `connect_cmd`, `db_ip`, `bucket_name`.

## Pierwsze kroki (skrót)

```bash
cd infra/pulumi/gke-infra
python3 -m venv venv && . venv/bin/activate && pip install -r requirements.txt
pulumi stack init dev
pulumi config set gcp:project YOUR_GCP_PROJECT_ID
pulumi config set gcp:zone europe-west1-b
pulumi up
```

`kubectl`: `gcloud container clusters get-credentials credit-scoring-cluster --zone europe-west1-b` — szczegóły i Camunda/Helm/Vertex: strona [EN →](/en/infra-pulumi-gke-sandbox). API: [`scripts/gcp-enable-apis-iam.sh`](https://github.com/OlehKondratow/credit-scoring-camunda/blob/develop/scripts/gcp-enable-apis-iam.sh), mapa: [INFRA-IMPLEMENTATION](/pl/INFRA-IMPLEMENTATION), role: [`infra/ROLES.md`](https://github.com/OlehKondratow/credit-scoring-camunda/blob/develop/infra/ROLES.md).
