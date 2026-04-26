# Kapitał kadrowy: specyfikacje ról (HR) — HBG RAG-DOMINANCE

| Pole | Wartość |
|------|---------|
| **Status** | Wewnętrzny; rekrutacja i planowanie |
| **Powiązanie** | [hbg-rag-dominance](/pl/hbg-rag-dominance) — strategia i role U1–U6 |
| **Wersja macierzy** | 1.1 (załącznik B) |
| **Zespół 11×6** | [team-11x6-organization](/pl/team-11x6-organization) — koncepcja i sześć person z pełnym SDLC |

**Inne języki:** [Русский](/ru/hr-offers-hbg) · [English](/en/hr-offers-hbg)

---

## 1. Otwarte oferty a kody U1–U6

W dokumencie są **cztery** stanowiska; **sześć** slotów funkcyjnych (U1–U6) z [hbg-rag-dominance](/pl/hbg-rag-dominance) zamyka się tak:

| Kod | Sekcja 2 | Uwaga |
|-----|------------|--------|
| U1 | Oferta 1 — Platform Architect | — |
| U2 | *Nie w osobnej ofercie* | SRE/CI-CD: osobny etat, rozszerzenie U1 lub podwykonawca — wg planu |
| U3 | Oferta 2 — Senior RAG & Semantic Architect | — |
| U4 | Oferta 3 — Principal Data Engineer | — |
| U5 | Oferta 4 — AI Validation & Compliance (część U5) | „Inkwizycja” i złote ścieżki — U5; czysto prawne — przecięcie z U6 |
| U6 | *Częściowo* oferta 4 + opcjonalny Legal/audyt | Raporty regulatora, BQ — w JD 4 |

---

## 2. Opisy stanowisk

### 2.1 Oferta 1 — Platform Architect (U1)

| | |
|---|---|
| **Lokalizacja** | Zdalnie / hybryda |
| **Budżet** | Top-tier (rynek) |
| **Cel** | Suwerenność technologiczna: bezpieczna, skalowalna, audytowalna infrastruktura. |
| **Twarde umiejętności** | GCP (GKE, sieć, IAM), IaC (Pulumi/Python), Zero Trust, Workload Identity. |
| **Oferujemy** | Własność architektury „as code”; narzędzia bezpieczeństwa GCP wg polityki. |

### 2.2 Oferta 2 — Senior RAG & Semantic Architect (U3)

| | |
|---|---|
| **Lokalizacja** | Zdalnie |
| **Budżet** | Wysoki + premia od KPI jakości modelu |
| **Cel** | Przekład regulaminu banku na stabilne RAG/LLM; mniej dwuznaczności i halucynacji. |
| **Twarde umiejętności** | Vertex (Gemini), LangGraph/LangChain/LlamaIndex, pgvector (HNSW, IVFFlat), prompty. |
| **Oferujemy** | Dane (pseudonimizowane/zatwierdzone) w ramach compliance. |

### 2.3 Oferta 3 — Principal Data Engineer (U4)

| | |
|---|---|
| **Lokalizacja** | Zdalnie / biuro |
| **Budżet** | Konkurencyjny |
| **Cel** | Pipeline’y z dokumentów do struktury pod model; aktualna „pamięć” organizacji. |
| **Twarde umiejętności** | ETL/ELT niestrukturalnych (OCR, PDF), PostgreSQL, BigQuery, Python (worker’y). |

### 2.4 Oferta 4 — AI Validation & Compliance Officer (U5 / częściowo U6)

| | |
|---|---|
| **Lokalizacja** | Biuro / hybryda |
| **Budżet** | Stawka + premia od ryzyka/incydentów (KPI w ofercie) |
| **Cel** | Weryfikacja decyzji AI względem polityk; wymagania dla dev; wyjaśnialność. |
| **Twarde umiejętności** | FinTech AML/KYC/ryzyko kredytowe; SQL/BQ na logach; teksty prawne/compliance. |

---

## 3. RACI (skrót)

| Zadanie | R | A |
|---------|---|---|
| Uptime infry | Platform Architect (U1) | DevOps / SRE lead (U2) |
| Jakość odpowiedzi AI | RAG Architect (U3) | ML lead |
| Aktualność bazy wiedzy | Data Engineer (U4) | Data lead |
| Zgodność prawna | Compliance (of. 4) | Legal / U6 wg matrycy banku |

---

## 4. Sześciu agentów × bloki

| # | Kod | Rola | Blok | Wymagania (skrót) |
|---|-----|------|------|------------------|
| 1 | U1 | Grand Architect | Infra, security governance | GCP, Pulumi |
| 2 | U2 | SRE Executor | CI/CD, Camunda, deploy | K8s/Helm |
| 3 | U3 | Cognitive Designer | Logika AI, RAG | LLM, wektory |
| 4 | U4 | Knowledge Master | ETL, indeksy, dane | Dane niestrukturalne, BQ |
| 5 | U5 | Inquisitor (QA) | Walidacja, obciążenie | SDET, REF |
| 6 | U6 | Grand Auditor | Compliance, explainability, raporty | FinTech, BQ |

---

## 5. Jedenastu etapów wniosku (workflow)

| # | Etap | Treść | Właściciel |
|---|------|-------|------------|
| 1 | Ingestion | Surowe dane → GCS | U4 |
| 2 | Normalization | Czyszczenie, jeden schemat | U4 |
| 3 | Embedding | Wektoryzacja (Vertex) | U3 |
| 4 | Indexing | pgvector (np. HNSW) | U4 |
| 5 | Orchestration | Camunda BPMN | U2 |
| 6 | Retrieval | Kontekst reguł | U3 |
| 7 | Reasoning | Anketa vs reguły (LLM) | U3 |
| 8 | Risk scoring | Wynik / klasa | U1/U3 (w produkcie ustalić właściciela) |
| 9 | Verification | Złote scenariusze (REF) | U5 |
| 10 | Persistence | Zapis werdyktu / śladu w BD | U2, U4 |
| 11 | Audit trace | Raporty BQ, regulator | U6 |

*Poprawka: etap 10 to **U2 + U4**, nie U2/U1.*

---

## 6. Interakcje

- **Biznes — U6:** intencja polityk; legitymizacja.
- **U3 — U4:** jakość wektorów ↔ dane.
- **U2 — U1:** dostarczanie w ramach bezpieczeństwa.
- **U5 — wszyscy:** niezależna akceptacja do PROD.

---

## 7. Załącznik A — przykładowe `personnel_clearance`

Korporacyjne tożsamości; brak prywatnych maili w repozytorium. Zob. [gcp-saas-access-matrix-11x6](/pl/gcp-saas-access-matrix-11x6) i [infra-pulumi-iac](/pl/infra-pulumi-iac).

```yaml
infrastructure:
  provider: "Google Cloud Platform"
  security_tier: "Sovereign Financial"

personnel_clearance:
  - id: u1_architect
    status: GrandMaster
    idp_subject: "REPLACE_U1"
  - id: u2_sre
    status: Execution_Lead
    idp_subject: "REPLACE_U2"
  - id: u3_ai_logic
    status: Cognitive_Designer
    idp_subject: "REPLACE_U3"
  - id: u4_data_master
    status: Knowledge_Custodian
    idp_subject: "REPLACE_U4"
  - id: u5_inquisitor
    status: Truth_Verifier
    idp_subject: "REPLACE_U5"
  - id: u6_auditor
    status: Legal_Shield
    idp_subject: "REPLACE_U6"

privileges:
  - environment: PROD
    control: "U1, U2, U6 (ograniczenie); IAM"
  - environment: REF
    control: "U5 i sesje U3/U4"
  - environment: DEV
    control: "dostęp inżynierski wg polityki"
```

---

## 8. Załącznik B — etapy i agenci (YAML)

```yaml
project_id: hbg-rag-dominance
region: europe-central2
competencies_covered: 11

stages:
  1: { name: Ingestion,        primary: U4 }
  2: { name: Normalization,    primary: U4 }
  3: { name: Embedding,        primary: U3 }
  4: { name: Indexing,         primary: U4 }
  5: { name: Orchestration,     primary: U2 }
  6: { name: Retrieval,         primary: U3 }
  7: { name: Reasoning,         primary: U3 }
  8: { name: Risk_scoring,     primary: [U1, U3] }
  9: { name: Verification,     primary: U5 }
  10: { name: Persistence,    primary: [U2, U4] }
  11: { name: Audit_trace,     primary: U6 }

agents:
  - id: u1_architect
    clearance: GrandMaster
    gcp_binding_note: "Minimalne role; unikać roles/owner w PROD bez uzasadnienia"
    k8s_access: cluster-admin
  - id: u2_sre
    clearance: Execution_Lead
    k8s_access: edit
  - id: u3_ml_designer
    clearance: Cognitive_Designer
    k8s_access: edit
  - id: u4_data_custodian
    clearance: Resource_Master
    k8s_access: view
  - id: u5_inquisitor
    clearance: Truth_Verifier
    k8s_access: edit
  - id: u6_auditor
    clearance: Legal_Shield
    k8s_access: view
```

---

## 9. Ryzyko bez roli (skrót)

| Brak | Typowe ryzyko |
|------|---------------|
| U3 | Niekontrolowana jakość LLM/RAG |
| U6 | Luka regulatorowa / explainability |
| U1 | Ataki / nadmierne dostępy |
| U5 | Błędy logiki w PROD, regresje |

---

*Koniec dokumentu.*
