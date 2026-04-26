# Pulumi: IaC (GCP) w repozytorium

**Źródło prawdy w kodzie:** [`infra/pulumi/`](https://github.com/kwazar-0/credit-scoring-camunda/tree/develop/infra/pulumi), opcjonalnie [`infra/pulumi/gke-infra/`](https://github.com/kwazar-0/credit-scoring-camunda/tree/develop/infra/pulumi/gke-infra). Region domyślny: **`europe-central2`**.

Zachowanie wybiera **`credit-scoring:stackRole`**.

| `stackRole` | Rola |
|-------------|------|
| `legacy` (domyślny) | GCS (warianty, versioning), BigQuery, Artifact Registry, opcj. GitHub WIF. |
| `infra-core` | Sieć, Private Service Access, opcj. WIF. |
| `infra-data` | Wersjonowane GCS, BQ, opcj. **prywatny** Cloud SQL (`createCloudSql`, `coreStackRef`). |
| `infra-runtime` | GKE (Workload Identity, wąskie OAuth), Artifact Registry; wymaga `coreStackRef`. |

**Aplikacje** (Helm/Argo) **nie** są w tym programie Pulumi.

## Dlaczego Pulumi i role `stackRole` (alternatywy)

**Narzędzie IaC:** **Terraform** i **CDK** prowadzą do tego samego („plan → apply”). **Pulumi (Python)** tutaj to wyrównanie do języka monorepo i możliwość wspólnych helperów/typów w `infra/pulumi/*.py`; modułowa migracja do Terraforma jest możliwa, jeśli organizacja standaryzuje HCL.

**`legacy` vs split (`infra-core` / `infra-data` / `infra-runtime`):** `legacy` to **świadomy tryb małej powierzchni** (mniej stosów i referencji), kosztem wspólnego blast radius. Split to **domyślna ścieżka dojrzałości**: sieć i PSA oddzielnie od danych i od klastra obliczeniowego, żeby zmiana GKE nie ciągnęła przebudowy SQL i odwrotnie.

**Czemu nie trzy osobnych repozytoriów IaC:** jedno repo z rolami stosu upraszcza review zmian, które i tak zwykle dotykają sieci i runtime. **Rozdziel repozytoria, gdy:** różne zespoły własnościowo trzymają state na poziomie organizacji i wymagają twardej izolacji uprawnień na poziomie repo.

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

Przykład configu: [`Pulumi.dev.yaml.example`](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/infra/pulumi/Pulumi.dev.yaml.example). Wskazówki: [`infra/README.md`](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/infra/README.md) — **pełny runbook pet-project** (billing, ADC/quota, IAM, bucket state Pulumi, `infra-core`, split stosy, typowe błędy).

**Split stosy:** najpierw `pulumi up` dla **`infra-core`**, potem data/runtime z `credit-scoring:coreStackRef` = pełna nazwa stosu core (format Pulumi, np. `org/credit-scoring-infra/dev-core`). Zalecane jest **osobny stack na rolę** (`dev-core`, `dev-data`, `dev-runtime`), żeby różne `stackRole` nie dzieliły jednego stanu.

Przy `infra-data` i `createCloudSql: true` ustaw nazwę instancji: `pulumi config set credit-scoring:cloudSqlInstanceName <nazwa>` (patrz [`Pulumi.dev.yaml.example`](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/infra/pulumi/Pulumi.dev.yaml.example)).

## Strony na tej witrynie

- [INFRA-IMPLEMENTATION.md](INFRA-IMPLEMENTATION.md) — fazy.  
- [cli-console.md](cli-console.md) — CLI.  
- [gcp-saas-access-matrix-11x6.md](gcp-saas-access-matrix-11x6.md) — role × GCP.  
- [prompt.md](prompt.md) — handoff, §9+.

RUS: [ /infra-pulumi-iac ](/ru/infra-pulumi-iac).
