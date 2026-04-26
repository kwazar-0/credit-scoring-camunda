# Organizacja zespołu: 11 ról logicznych × 6 kont (koncepcja)

**Status:** model referencyjny dla HBG / konturu demo; dostosuj do polityki banku.  
**Powiązane:** [gcp-saas-access-matrix-11x6](/pl/gcp-saas-access-matrix-11x6), [github-codeowners-matrix](/pl/github-codeowners-matrix), [hr-offers-hbg](/pl/hr-offers-hbg) (U1–U6, RACI, 11 etapów wniosku).

**Języki:** [Русский](/ru/team-11x6-organization) · [English](/en/team-11x6-organization)

---

## 1. Po co „11 × 6”

Audyt pyta: **kto może zmienić co** i **gdzie urywa się odpowiedzialność**.

| Oś | Co mierzy | Pytanie |
|-----|------------|---------|
| **11 slotów** | *Funkcje dostępu* | „Jaki minimalny zestaw uprawnień ma *rola*?” |
| **6 kont** | *Ludzie* w IdP / GitHub | „Jak spakować sloty bez 11 osób i bez łamania SoD?” |

**11** to kanoniczny zestaw obowiązków; **6** to praktyczny start — każdy pakiet ma [stronę persony](#6-strony-person-pełny-sdlc).

**Niezmienny:** IAM w prod na **Google Groups**; odejście pracownika = członkostwo w grupach, nie polowanie na `roles/*`.

---

## 2. Trzy warstwy

**A** — obowiązek (11 slotów). **B** — konto / persona (6 osób). **C** — artefakty: GitHub, GCP, Camunda.

U1–U6 z [hbg-rag-dominance](/pl/hbg-rag-dominance) to **inny przekrój** — mapuj go na 11 slotów w rejestrze ról, nie zastępuj.

---

## 3. SDLC jako złoty wątek

| Faza | Znaczenie | Sloty | Artefakty |
|------|-----------|-------|-----------|
| 0–1 | inicjacja, design | Platform, Sec | ADR |
| 2–3 | build, integracja dev | Dev, Data, ML, Platform | PR |
| 4–5 | weryfikacja dev, ref | Tst-dev, Tst-ref | CI, tagi [git-workflow](/pl/git-workflow) |
| 6 | gate prod | Release, Sec | Environment |
| 7 | UAT | UAT (bez konsoli GCP) | Tasklist |
| 8–9 | ops, audyt | Platform, Sec | runbooki, BQ |

---

## 4. SoD (skrót)

Release ≠ jedyny developer przy approve. Sec nie deployuje aplikacji „dla szybkości”. BG tylko zdarzeniowo. Data/ML bez `container.admin` w prod.

---

## 5. Cztery teamy GitHub

`platform`, `engineers`, `quality`, `compliance` — granularność review; **nie** zastępują grup GCP.

---

## 6. Strony person (pełny SDLC)

| Persona | Etykieta | Strona |
|---------|----------|--------|
| ok-admin | ADMIN | [team-persona-ok-admin](/pl/team-persona-ok-admin) |
| gw-devops | DEVOPS | [team-persona-gw-devops](/pl/team-persona-gw-devops) |
| ux-dev | DEV-UX | [team-persona-ux-dev](/pl/team-persona-ux-dev) |
| sh-dev | DEV-SH | [team-persona-sh-dev](/pl/team-persona-sh-dev) |
| pk-qa | QA-TEST | [team-persona-pk-qa](/pl/team-persona-pk-qa) |
| ok-audit | AUDIT | [team-persona-ok-audit](/pl/team-persona-ok-audit) |

---

## 7. Rollout

Grupy GCP → powiązania IAM → GitHub Environments → runbook BG → tabletop per persona.

**Dalej:** [gcp-saas-access-matrix-11x6](/pl/gcp-saas-access-matrix-11x6).
