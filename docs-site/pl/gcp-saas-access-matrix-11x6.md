# Czysta macierz: 11 ról vs usługi GCP i 6 kont

Zgodne z [`prompt.md`](prompt.md) §9.1–9.2 (w tym **§9.2.1** — Vertex, BigQuery, GCS, Vector Search, Cloud SQL, IaC) i hardening §9.6. Region domyślny: **`europe-central2`**.

**Organizacja zespołu (koncepcja + sześć person, pełny SDLC):** [team-11x6-organization](/pl/team-11x6-organization).

## 1. Czy 11 ról i „6 użytkowników”?

Tak. **11** to *role logiczne*. **6** to *ludzie* (konta Google / grupy). Jedna osoba **nosi pakiet** ról; **UAT** i **App** zwykle **bez** konsoli GCP; **BG** (break-glass) to rola **zdarzeniowa**, nie stały profil.

W **prod** (zob. `prompt.md` §9.6) lepiej **Google Groups** w IAM/RBAC, niż 11 `roles/*` na jedną osobę. Ten dokument to **mapa** „co dana rola może w GCP”; wdrożenie — przez **grupy** o tym samym znaczeniu.

## 2. 11 ról × warstwy GCP (chmura SaaS)

Kolumny to **obszary** (niepełna lista API; szczegóły = własne role IAM + polityka org.).

| Slot | Rola | Resource Manager / IAM | GKE | Storage (GCS) | BigQuery | Vertex / Search | Logi / SecOps | GAR | Uwaga |
|------|------|------------------------|-----|---------------|----------|-----------------|--------------|-----|--------|
| **Platform** | devops / sre | bindy admin, SA, foldery | admin / platform SA | buckety, etykiety | datasety, integracje | czytanie/akceptacja | org-level logi | read/push / env | Pulumi, state, CI |
| **Dev** | dev-developer | brak Owner/Editor na prod (często 0) | NS **dev** | read/write **dev** | datasety dev | endpointy **dev** | logi **dev** | push/pull **dev** | Kod aplikacji |
| **Tst-dev** | dev-tester | zwykle 0 | view **dev** | testowe dane | read jobs | portale read-only | read **dev** | read | UI/CI |
| **Tst-ref** | ref-tester | viewer staging | NS **ref** | read **ref** | read | read inference | read | read | Regres, nie prod |
| **UAT** | prod-tester | 0 | brak kubectl prod | 0 (dane w aplikacji) | agregaty wg polityki | UI | audit UI | 0 | Camunda/Streamlit |
| **App** | prod-user | 0 | 0 | 0 | 0 | 0 | 0 | 0 | Tylko Tasklist/SSO |
| **Sec** | security / compliance | policy read | view wszystkich NS | metadane | tagi, audyt | metadane | **audit logi** | read | Zmiany w Git |
| **BG** | break-glass | PAM / tymczasowe | elevated tymczasowo | runbook | runbook | runbook | runbook | runbook | Tylko ticket/okno |
| **Release** | release manager | czytanie wersji | 0 / view | 0 | 0 | 0 | raporty | tagi | Approve w GHE `production` |
| **Data** | data engineer | wąskie SA | 0 | admin bucketów danych | edytor + jobUser | 0 / ML w osobnej roli | 0 | 0 | Ingest, bez GKE admin |
| **ML** | ML engineer | wąskie | opcjonalnie dev | embeddingi | wg potrzeb | aiplatform + indeks | 0 | read | Bez `container.admin` na prod (ROLES) |

*„0”* = brak bezpośredniego konsoli; nie zero biznesowe (Camunda, UI).

## 3. Te same 11 ról w 6 kontach (przykład)

Jeden wiersz = jedna osoba. **Kolumny** — te same **sloty** co w §2. **•** = główna rola, **○** = współudział, **on-call** przy **BG**.

| Konto (login · etykieta) | Platform | Dev | Tst-dev | Tst-ref | UAT | App | Sec | BG | Release | Data | ML |
|--------------------------|:-:|:-:|:-:|:-:|:-:|:-:|:--:|:-:|:-:|:--:|:--:|
| **ok-admin** · **ADMIN** | • | | | | | | | | ○ | | |
| **gw-devops** · **DEVOPS** | • | | | | | | ○ | **on-call** | ○ | | |
| **ux-dev** · **DEV-UX** | | • | | | | | | | • | ○ | • |
| **sh-dev** · **DEV-SH** | | ○ | | | | | | | | • | • |
| **pk-qa** · **QA-TEST** | | | • | • | | | | | | | |
| **ok-audit** · **AUDIT** | | | | | | | • | | | | |

- **UAT** / **App** puste: brak roli konsoli (dostęp przez produkt).
- Zgodność przykładowych loginów: [`github-codeowners-matrix.md`](github-codeowners-matrix.md).

## 4. Cztery zespoły Git z `prompt.md` §2

| Team | Sloty ról |
|------|-----------|
| `platform` | Platform, część Sec, BG, część Release, CI |
| `engineers` | Dev, Data, ML |
| `quality` | Tst-dev, Tst-ref, Release |
| `compliance` | Sec, ewent. audyt Release (SoD) |

`Business` — **nie** w repozytorium; `Incident` — **procedura**.

## 5. Audyt

- Nie łącz **Release** i **Sec** na jednej osobie, jeśli SoD wymaga rozdziału.
- Hardening: **custom role** + podział **dev / ref / prod**.

## 6. Powiązane

- [`github-codeowners-matrix.md`](github-codeowners-matrix.md)
- Przykład RBAC K8s w repozytorium: `infra/ROLES.gke-rbac.local.md`
