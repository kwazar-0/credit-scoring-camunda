# CODEOWNERS: 11 ról i 6 kont GitHub

Dokument mapuje **role logiczne** (zob. [gcp-saas-access-matrix-11x6.md](gcp-saas-access-matrix-11x6.md) i [prompt.md](prompt.md) §9) na **sześć użytkowników** w recenzjach [`.github/CODEOWNERS`](https://github.com/OlehKondratow/credit-scoring-camunda/blob/develop/.github/CODEOWNERS).

Fork przykładowy: [kwazar-0/credit-scoring-camunda](https://github.com/kwazar-0/credit-scoring-camunda). Loginy = rzeczywiste `@username`; przy zmianie nika zaktualizuj ten plik i `CODEOWNERS`.

### Jak 11 ról mieści się w 6 kontach

**Rola** w `ROLES.md` to *funkcja i granice dostępu* (audyt, polityka). **Konto** to człowiek w IdP / GitHub / GCP. **Nie** trzeba 11 loginów: jedna osoba może łączyć role, jeśli to nie łamie *separation of duties* w banku.

| Role, które **nie** wymagają osobnego git | Dlaczego |
|-------------------------------------------|----------|
| **5 — prod-tester (UAT)** | Praca w UI, nie review kodu. |
| **6 — prod-user** | Tylko produkt, brak repozytorium. |
| **8 — break-glass** | Czasowe podniesienie, nie stały profil. |

Pozostałe **8 ról** rozdziela **sześć osób** (przykładowa macierz odwrotna).

| Konto | Jakie z 11 ról (przykład) |
|-------|----------------------------|
| **U1** `@kwazar-0` | **1** devops, część **7**, on-call **8**, część **9** (z U2) |
| **U2** `@OlehKondratow` | **2** dev, **11** ML, część **9**, część **10** (z U5) |
| **U3** `@tempb59-commits` | **3** / **4** testery |
| **U4** `@geraltwilkbialy-cloud` | **7** security |
| **U5** `@olehkondracki-prog` | **10** data, wsparcie **2**/**11** w danych |
| **U6** `@tempb418-ux` | **1** współplatforma (z U1) |

Jeśli **release** i **security** muszą być *rozdzielone* (SOX), przenieś **9** lub **7** — polityka banku.

## Sześć kont

| # | GitHub | Typowy fokus |
|---|--------|--------------|
| U1 | `@kwazar-0` | Platforma, fork, incydenty IaC |
| U2 | `@OlehKondratow` | Aplikacja, ML, release |
| U3 | `@tempb59-commits` | QA, BPMN/DMN |
| U4 | `@geraltwilkbialy-cloud` | Security / compliance |
| U5 | `@olehkondracki-prog` | Data |
| U6 | `@tempb418-ux` | Co-devops, CI, `infra`/`k8s` |

## 11 ról → kto w recenzjach

| # | Rola | Główni właściciele (GitHub) | Uwaga |
|---|------|----------------------------|--------|
| 1 | devops / sre | U1, U6 | `infra/`, `k8s/`, itd. |
| 2 | dev-developer | U2, U5 | `backend/`, `worker/`, `ui/` |
| 3 | dev-tester | U3 | `bpmn/`, `dmn/` |
| 4 | ref-tester | U3 | wydania — [git-workflow](git-workflow.md) |
| 5 | prod-tester | — | UAT w aplikacji |
| 6 | prod-user | — | brak git |
| 7 | security | U4, U1 | `SECURITY.md` |
| 8 | break-glass | U1 | runbook |
| 9 | release-manager | U2, U1 | tagi `v*` |
| 10 | data engineer | U5, U2 | `data/` |
| 11 | ML | U2, U5 | RAG, modele |

**Wniosek:** w Git nie tworzymy 11 zespołów — sześć osób; role 5–6 i 8 zwykle bez osobnych linii w `CODEOWNERS`.

## Zespoły w organizacji

Przy przenosinach do org użyj `@org/zespół` zgodnie z [github-setup](github-setup.md); mapa ról zostaje w `ROLES.md`.
