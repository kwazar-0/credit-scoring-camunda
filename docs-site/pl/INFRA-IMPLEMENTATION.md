# Infrastruktura: Camunda 8 + AI scoring — plan prac

**Cel:** zaprojektować i wdrożyć kontur chmurowy dla **kredytowego pipeline’u**: orkiestracja **Camunda (Zeebe)**, scoring przez **FastAPI + LangGraph + Vertex (RAG)**, wdrożenie na **GKE**, dane w **GCS / BigQuery**, region **`europe-central2`**.

Ten plik to **jedyna mapa drogowa** jako punkt fokusa. Reszta dokumentacji to spis; indeks: [toc.md](toc.md).

---

## Fazy (kolejno)

| # | Faza | Kryterium „gotowe” | Gdzie patrzeć |
|---|------|--------------------|----------------|
| **1** | **Chmura + IaC (dev)** | API włączone, Pulumi `pulumi up` na **dev**, GCS, dataset BQ, Artifact Registry, eksporty stosu | [infra-pulumi-iac.md](infra-pulumi-iac.md), [cli-console.md](cli-console.md), [scripts/gcp-enable-apis-iam.sh](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/scripts/gcp-enable-apis-iam.sh) |
| **2** | **CI → GCP (OIDC)** | GitHub Actions uwierzytelnia się w GCP bez JSON-owych kluczy (WIF w razie potrzeby) | `infra/pulumi/workload_identity_github.py`, [.github/workflows/pulumi-preview.yml](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/.github/workflows/pulumi-preview.yml) |
| **3** | **GKE + obrazy** | Klaster (Standard), workload w namespace, obrazy z Artifact Registry, Workload Identity dla podów | [infra-pulumi-iac.md](infra-pulumi-iac.md) (split: `stackRole: infra-runtime`), `k8s/hbg/` |
| **4** | **Dane RAG** | PDF → GCS → ingest → embeddingi → Vertex Vector Search; backend bez mocka bazy wektorowej | [ml-data-rag.md](ml-data-rag.md), `data/` |
| **5** | **Camunda w kontraście** | BPMN/DMN wdrożone, sekrety Zeebe/Tasklist z Secret Manager, worker `ai-loan-analysis` stabilnie woła backend | `bpmn/`, `worker/`, procesy |
| **6** | **Obserwowalność / polityka** | Logi, analityka BQ bez surowych PII, ewent. macierz ról | [gcp-saas-access-matrix-11x6.md](gcp-saas-access-matrix-11x6.md) |

**MVP produktu (z [plan.md](plan.md) — fazy dostawy):** fazy **1 → 4** (ingest, indeks, wyłączyć mock) → potem **5** i testy worker ↔ backend.

---

## Dlaczego taka kolejność faz (a jakie odrzuciliśmy)

**Zależności:** faza **1** tworzy projekt, API, zasoby bazowe i grunt pod state Pulumi — bez tego **3** (GKE) i **4** (magazyny pod korpus RAG) są przypadkowe. **2** (OIDC) naturalnie zaraz po stabilnym projekcie GCP; inaczej CI zostaje na kluczach JSON (antywzorzec) albo wcale nie dotyka chmury.

**Czemu nie „najpierw Camunda (5), potem RAG (4)”:** da się podnieść Zeebe i workery na mocku retrieval — szybki demo, ale **wysokie ryzyko przeróbek** kontraktów job ↔ API, gdy realny wektorowy kontur zmieni latencję, limity i kształt cytowań. W tym repozytorium priorytet ma **działająca ścieżka danych** do modelu.

**Czemu nie „GKE (3) przed pełnym IaC (1)”:** ręczny klaster bez Pulumi jest możliwy, ale rozjeżdża się z kanonem repozytorium i utrudnia odtwarzalność dla nowych osób.

**Faza 6** świadomie **po** działającym kontraście: obserwowalność i macierz ról to dojrzałość, nie blokada pierwszego `pulumi up` i pierwszego E2E.

---

## Minimalny zestaw czytania (1–2 h, potem kod)

1. **[main.md](main.md)** — wejście operacyjne; **[plan.md](plan.md)** — **plan faz** i ewolucja; **[appendix.md](appendix.md)** — indeks głęboki.  
2. **[infra-pulumi-iac.md](infra-pulumi-iac.md)** — Pulumi, `stackRole`, OIDC, podział staków.  
3. **[`infra/README.md`](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/infra/README.md)** (repo) — bootstrap pet: billing, ADC/quota, IAM, bucket state, `infra-core`, split, typowe błędy.  
4. **`infra/pulumi/__main__.py` (w repo)** — wybór stosu.  
5. **[cli-console.md](cli-console.md)** — Pulumi, `gcloud`, włączanie API.

**Odłożyć do osobnego zadania:** szczegółowa macierz 11 ról × 6 kont ([gcp-saas-access-matrix-11x6.md](gcp-saas-access-matrix-11x6.md)), CODEOWNERS, [system-philosophy-governance.md](system-philosophy-governance.md) (hardening operacyjny) — dojrzały enterprise, **nie** blokuje **faz 1–2**.

---

## Spec enterprise (gdy będzie potrzebna)

Pełny cel (VPC, wielopool’owy GKE, OPA, Binary Authorization) — **[system-philosophy-governance.md](system-philosophy-governance.md)** oraz **[gcp-saas-access-matrix-11x6.md](gcp-saas-access-matrix-11x6.md)** (enterprise IAM i hardening). Czytać **po** działającym MVP, przenosić do Pulumi wraz z wymaganiami.

---

## Opcjonalnie: piaskownica GKE + Cloud SQL (`gke-infra`)

**Dokumentacja w tej witrynie:** [PL](infra-pulumi-gke-sandbox.md) · [EN](/en/infra-pulumi-gke-sandbox) · [RU](/ru/infra-pulumi-gke-sandbox).

**Drugi** projekt Pulumi: [`infra/pulumi/gke-infra/`](https://github.com/kwazar-0/credit-scoring-camunda/tree/develop/infra/pulumi/gke-infra). Runbook: [README.md](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/infra/pulumi/gke-infra/README.md) (GKE, prywatny Cloud SQL, GCS, AR).

Domyślnie **`europe-central2`**, prefiks `cs-sandbox-*` — nadal inny niż główne **`infra/pulumi/`** (`hbg-*`, `stackRole`). Nie łącz obu `pulumi up` w jednym projekcie bez planu (VPC/PSA/SQL). Zob. [infra-pulumi-iac](infra-pulumi-iac.md), [gke (witryna)](infra-pulumi-gke-sandbox.md).

---

## Szybkie polecenia

```bash
./scripts/gcp-enable-apis-iam.sh YOUR_GCP_PROJECT_ID
cd infra/pulumi && python3 -m venv venv && . venv/bin/activate && pip install -r requirements.txt
pulumi config set gcp:project YOUR_GCP_PROJECT_ID
pulumi config set credit-scoring:region europe-central2
pulumi preview && pulumi up
```

---

*Aktualizuj tabelę faz po zamknięciu etapu; szczegóły gita — [git-workflow.md](git-workflow.md), nie myl z checklistą chmury.*
