# Persona: **sh-dev** (DEV-SH)

**Pakiet slotów (11):** Dev ○, Data •, ML •.  
**Przeznaczenie:** **nastawienie na dane i ML**: ingest, jakość korpusu, embeddingi, indeks; kod tam, gdzie dane stykają się z aplikacją (`data/`, części `backend/`).

**Koncepcja zespołu:** [team-11x6-organization](/pl/team-11x6-organization) · **EN:** [/en/team-persona-sh-dev](/en/team-persona-sh-dev)

---

## Mandat i granice

- **Posiada:** `data/ingest`, eksporty, kontrakty prefiksów GCS, wspólnie z ML — parametry indeksu / eval RAG.  
- **Nie posiada:** topologii VPC; samodzielny merge krytycznej infra bez Platform.

---

## SDLC — wiodące fazy

| Faza | Działania | Wynik |
|------|-----------|--------|
| **1** | schemat danych, SLA świeżości korpusu, granice PII | kontrakt danych |
| **2** | pipeline ingest, joby BQ, skrypty w `data/` | PR |
| **3–4** | napełnienie dev GCS; jakość retrieval | metryki eval |
| **5** | promocja zbioru do ref (wersjonowanie) | manifest wersji |
| **6** | uzgodnienie „co idzie do indeksu prod” z Release/Sec | wpis w changelog |
| **7** | analiza incydentów „halucynacja / przestarzały regulamin” | patch danych lub indeksu |
| **8–9** | niezmienność wersji korpusu; ślad dla audytu | lineage |

---

## GCP

Slot **Data**: object admin na bucketach **data**, BQ editor/jobUser na prefiksach. Slot **ML**: indeks Vertex **dev → promocja** przez CI.

---

## Interakcje

| Z kim | Temat |
|-------|--------|
| **ux-dev** | API i graf konsumują te same artefakty — synchronizacja wersji |
| **pk-qa** | złote zbiory pod testy ref |
| **ok-audit** | klasyfikacja danych, retencja |

---

## Antywzorce

- Bezpośrednia edycja **prod** GCS bez wersji i bez CI.  
- To samo konto: **Data** object admin + **Platform** admin klastra w prod (SoD).
