# Persona: **pk-qa** (QA-TEST)

**Pakiet slotów (11):** Tst-dev •, Tst-ref •.  
**Przeznaczenie:** **niezależna weryfikacja** w dev i regresja w **ref**; bez Pulumi; zwykle bez ról admin GCP.

**Koncepcja zespołu:** [team-11x6-organization](/pl/team-11x6-organization) · **EN:** [/en/team-persona-pk-qa](/en/team-persona-pk-qa)

---

## Mandat i granice

- **Posiada:** plany testów, autotesty w CI (review/trigger), pokrycie scenariuszy BPMN/DMN, **sign-off ref** przed gate release.  
- **Nie posiada:** merge do `main` bez zielonych sprawdzeń; zmiany IaC „żeby naprawić pipeline`.

**UAT/App:** brak slotów UAT/App w GCP — akceptacja prod przez **produkt** (biznes); pk-qa skupia się na **dev/ref**.

---

## SDLC — wiodące fazy

| Faza | Działania | Wynik |
|------|-----------|--------|
| **1–2** | review testowalności (given/when/then procesu) | komentarze do RFC |
| **3–4** | CI, scenariusze ręczne API, worker↔backend, negatywne PII | raport dev |
| **5** | **pełna regresja** na ref vs złoto; smoke obciążeniowy | sign-off ref |
| **6** | **głos blokujący** przy naruszeniu jakości | status w tickecie release |
| **7** | opcjonalnie wsparcie UAT jako **konsultant** | notatki |
| **8** | reprodukcja defektów prod | kroki repro |
| **9** | dowody pokrycia dla audytu (ślad do commitu) | trace |

---

## GitHub

CODEOWNERS: `bpmn/`, `dmn/`, testy; ewentualnie review workflows (bez sekretów).

---

## GCP

Podgląd / read dev/ref wg polityki. **Brak** praw do zmiany prod.

---

## Antywzorce

- Release bez pełnego **ref**.  
- QA z prawami **administratora klastra** w prod „dla szybkości”.
