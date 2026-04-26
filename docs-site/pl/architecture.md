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

## Decyzje inżynierskie: kontekst, alternatywy, kompromisy

To **nie** duplikat [tabeli ADR na stronie głównej witryny](/adr), tylko uzasadnienie **dlaczego tak**, dla osób, które będą zmieniały stos.

### Orkiestracja: Camunda 8, a nie „tylko kod”

**Alternatywy:** cała orkiestracja w **LangGraph** (lub podobnym) bez BPMN; **Temporal** / ręczne sagi; workflow w stylu Step Functions.

**Kryteria:** jawne **etapy procesu** do przeglądu także poza samym zespołem dev; **human task** i rozgałęzienia polityki bez redeployu całego serwisu; audyt „co stało się w kroku N”. Graf w kodzie jest dobry dla gałęzi ML, gorzej jako **jedyne** źródło regulowanego konturu kredytowego.

**Kompromis:** koszt operacyjny i licencja Camunda; kompetencje BPMN/DMN. **Kiedy wrócić do tematu:** gdy regulator i biznes akceptują model „tylko kod + log zdarzeń” i human-in-the-loop nie jest potrzebny w tej formie.

### IaC: Pulumi i **podział staków**, a nie jeden `up` „na wszystko”

**Alternatywy:** jeden duży stos; **Terraform** / CDK z podziałem modułowym.

**Kryteria:** różny **blast radius** i częstotliwość zmian (sieć/PSA — wolniej; runtime — częściej). Osobne state zmniejszają ryzyko „zepsuliśmy klaster, poprawiając bucket” i ułatwiają granice approve w CI.

**Kompromis:** więcej stosów — więcej dyscypliny `coreStackRef` i kolejności `pulumi up`. **Kiedy wrócić:** bardzo mały pet może zostać przy roli `legacy` w jednym stosie ([infra-pulumi-iac](/pl/infra-pulumi-iac)).

### GKE **Standard**, nie Autopilot domyślnie

**Alternatywy:** GKE Autopilot; **Cloud Run** dla części usług; Camunda SaaS bez własnego klastra.

**Kryteria:** typowe Helm Camundy i założenia sieciowe (**PSA, prywatny SQL**) łatwiej utrzymać na Standard w tym konturze szkoleniowym.

**Kompromis:** więcej powierzchni operacyjnej (poole węzłów, patche). **Kiedy wrócić:** gdy zespół świadomie przyjmie ograniczenia Autopilot po sprawdzeniu kompatybilności.

### Warstwa kognitywna: Vertex w tym samym GCP

**Alternatywy:** zewnętrzne API LLM jako główna ścieżka; self-host embeddingów.

**Kryteria:** **jedna** narracja IAM i rezydencji danych dla scenariusza EU (domyślnie `europe-central2`), RAG na GCS / Vector Search bez dublowania artefaktów do innej chmury.

**Kompromis:** uzależnienie od roadmapy Google; hybryda możliwa, ale komplikuje compliance. **Kiedy wrócić:** gdy pojawi się twardy wymóg konkretnej frontierowej modeli tylko u zewnętrznego dostawcy — wtedy bramka i polityka PII (maskowanie przed wywołaniem zewnętrznym, jak w repozytorium).

### Monorepo

**Alternatywy:** osobne repozytoria dla `worker`, `backend`, `infra`.

**Kryteria:** kontrakt **job type ↔ API** i wersja **BPMN** w jednym PR; IaC i [docs-site](/adr) w tym samym review co kod.

**Kompromis:** koszt CI i rozmiar repozytorium; dojrzałe zespoły czasem dzielą. **Kiedy wrócić:** przy niezależnych pociągach release z twardym semver między serwisami.

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

> Języki: [Русский](/ru/architecture) · [English](/en/architecture)
