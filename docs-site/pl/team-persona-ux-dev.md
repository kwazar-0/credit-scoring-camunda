# Persona: **ux-dev** (DEV-UX)

**Pakiet slotów (11):** Dev •, Release •, Data ○, ML •.  
**Przeznaczenie:** **end-to-end** inżynier aplikacji: API, LangGraph, integracja Vertex, gotowość wydania; drugorzędnie — dane (zgodnie z Data).

**Koncepcja zespołu:** [team-11x6-organization](/pl/team-11x6-organization) · **EN:** [/en/team-persona-ux-dev](/en/team-persona-ux-dev)

---

## Mandat i granice

- **Posiada:** `backend/`, `worker/`, kontrakty Zeebe, konfiguracja RAG w kodzie, PyTest w zakresie.  
- **Nie posiada:** admin org GCP; przy ścisłym SoD nie być jedynym approve w Environment, jeśli jest się jedynym głosem Release.

**Release •** oznacza gotowość artefaktu do tagu i changelog aplikacji, niekoniecznie jedyną osobę przy przycisku Environment.

---

## SDLC — pełny cykl (epik → prod)

| Faza | Działania | Wynik |
|------|-----------|--------|
| **1** | OpenAPI, kontrakt job `ai-loan-analysis`, projekt kroku grafu | RFC w PR, DMN w razie potrzeby |
| **2** | kod na `feature/*` od `develop` | PR, testy jednostkowe |
| **3** | compose lub klaster dev; mock/real vector wg [ml-data-rag](/pl/ml-data-rag) | zielony CI |
| **4** | wspólnie z **pk-qa**: scenariusze API i worker | checklista |
| **5** | merge do `release/*`; regresja | stabilny ref |
| **6** | po approve Environment — tylko obraz/manifest z CI | tag `v*` |
| **7** | wsparcie defektów UAT | gałąź patch |
| **8–9** | postmortem jako autor; **nie** edycja logów audytu | RCA |

---

## GitHub

`backend/`, `worker/`, `bpmn/` (z QA), `tests/`. [github-codeowners-matrix](/pl/github-codeowners-matrix).

---

## GCP

Slot **Dev**: namespace dev, zbiory dev, endpointy Vertex **dev**. Bez `container.admin` w prod — deploy przez CI/Platform.

---

## Antywzorce

- Reguły biznesowe **tylko** w Streamlit (`ui/`).  
- Sekrety na sztywno; obejście maskowania PII.
