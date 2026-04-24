# Architektura i cel repozytorium

Repozytorium **Credit-Scoring / HBG** (Handlowy Bank Galicyjski) to **demonstracyjny / szkoleniowy** stos: zautomatyzowany scenariusz kredytowy z orkiestracją (**Camunda 8**), RAG i modelami generatywnymi (**Vertex AI / Gemini**) oraz infrastrukturą **GCP** (domyślny region **europe-central2**). Zob. też [HBG: strategia RAG-DOMINANCE](/pl/hbg-rag-dominance) oraz [ml-data-rag](/pl/ml-data-rag).

**Układ (monorepo):**

| Obszar | Ścieżka | Rola |
|--------|---------|------|
| API i graf | `backend/` | FastAPI, LangGraph, integracja z Vertex |
| Workery Zeebe | `worker/` | PyZeebe (np. `ai-loan-analysis`) |
| UI analityków | `ui/` | Streamlit (logika nie tylko w UI) |
| IaC | `infra/pulumi/` + `infra/pulumi/gke-infra/` | Pulumi, split stacks, opcjonalna piaskownica |
| K8s | `k8s/hbg/`, `k8s/camunda/` | Manifesty i Helm |
| Dokumentacja (Źródło) | `docs-site/` (ta witryna) | VitePress; archiwum w `doc/_archive/` |

---

## Trzy warstwy (high level)

1. **Orkiestracja** — Camunda 8 (BPMN/DMN, Zeebe, w razie potrzeby Operate/Tasklist). Proces wymusza etapy; niska pewność modelu — human task lub incydent.
2. **Warstwa kognitywna** — Vertex AI: embeddingi, opcjonalnie Matching Engine / Vector Search, LLM (konfiguracja w `backend` — [ml-data-rag](/pl/ml-data-rag)).
3. **Dane** — GCS, BigQuery, Cloud SQL (PostgreSQL) po włączeniu w Pulpie; RAG w `backend` i w [ml-data-rag](/pl/ml-data-rag).

---

## Warstwa A: Camunda 8

- **BPMN** w `bpmn/`, **DMN** w `dmn/` — reguły deterministyczne, mniej wywołań LLM.
- **Worker** — `worker/`, powiązanie z API przez Zeebe.
- **Wdrożenie** — lokalnie Docker Compose; w chmurze GKE, zob. [infra-pulumi-iac](/pl/infra-pulumi-iac) oraz `k8s/camunda/README.md` w repozytorium.

## Warstwa B: Vertex AI

- Integracja w `backend/` (PII według polityki repozytorium).
- Włączanie API, IAM, region — [infra-pulumi-iac](/pl/infra-pulumi-iac), [cli-console](/pl/cli-console).

## Warstwa C: RAG

- Ingest: `data/` i [ml-data-rag](/pl/ml-data-rag).
- Retrieval: konfiguracja w backendzie, bez surowych PII w logach.

---

## Komponenty a role (HBG, orientacyjnie)

| Komponent | Technologia | Rola (zob. [hr-offers-hbg](/pl/hr-offers-hbg)) |
|-----------|-------------|-----------------------------------------------|
| Chmura | GCP | U1 — architektura |
| Klastry | GKE, Helm, Pulumi | U2 — operacje |
| ML / prompty | Vertex, LangChain | U3 |
| Dane | GCS, BQ, PostgreSQL / pgvector | U4 |
| Jakość | PyTest | U5 |
| Audyt | BQ, [macierz dostępów](/pl/gcp-saas-access-matrix-11x6) | U6 |

---

## Przepływ danych (uproszczony)

1. API HTTP — wniosek / analiza.  
2. Zeebe — proces, joby w `worker/`.  
3. Retrieval — RAG.  
4. LLM — wynik z safety.  
5. Camunda — stan, human task.  
6. Ewidencja — agregaty w BQ/logach, zgodnie z polityką PII.

---

**RAG-DOMINANCE** — szczegóły: [hbg-rag-dominance](/pl/hbg-rag-dominance).

**Dalej:** [INFRA-IMPLEMENTATION](/pl/INFRA-IMPLEMENTATION), [cli-console](/pl/cli-console), [spis treści](/pl/toc).

> Języki: [Русский](/architecture) · [English](/en/architecture)
