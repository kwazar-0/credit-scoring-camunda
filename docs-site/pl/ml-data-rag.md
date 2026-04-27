# ML, Data & RAG (Vertex AI, GCP)

Domyślny region danych: **`europe-central2`**. Kod i zmienne w `backend/`, pipeline danych w `data/`, infrastruktura w `infra/pulumi/`.

---

## 1. Komponenty

| Warstwa | Technologia | Rola |
|---------|-------------|------|
| **Źródła** | PDF, NBP, polityki wewnętrzne (w zakresie licencji) | Surowy tekst do RAG |
| **Landing** | Zasobnik **GCS** `raw-pdfs` (Pulumi: `raw_regulations_bucket`) | Niezmienne przechowanie PDF |
| **Przetwarzanie** | `data/ingest.py` — PyMuPDF, chunki, overlap | Przygotowanie do embeddingów |
| **Embeddingi** | **`text-embedding-004`** (768 wym.) | Wektory pod Vector Search |
| **Indeks wektorowy** | **Vertex AI Vector Search** (Matching Engine) | Wyszukiwanie semantyczne + filtry metadanych |
| **Hybryda** | metadane `product_type`, `source`, `section` | Ograniczenie domeny (Hipoteka vs Pożyczka) |
| **LLM** | **Gemini 1.5 Pro** (Vertex) | Wnioskowanie z kontekstem RAG |
| **Analityka / eval** | **BigQuery** dataset `hbg_analytics` | Logi, offline jakość, koszt tokenów |
| **Orkiestracja** | LangGraph w `backend/` | Maskowanie PII → retrieve → reguły → LLM → reflect |

---

## 2. Przepływ danych (RAG)

```text
PDF → GCS (raw) → chunk → embed (text-embedding-004) → JSONL / batch →
→ Vertex Vector Search (deploy indeksu) → backend retrieve → Gemini → odpowiedź PL
```

**Jakość offline:** `data/eval_rag.py` — pytania z referencyjnym `source`; metryka hit@k w top-k.

---

## 3. Konfiguracja backendu (env)

| Zmienna | Opis |
|---------|------|
| `GOOGLE_CLOUD_PROJECT`, `GOOGLE_CLOUD_REGION` | Vertex / GCS |
| `USE_MOCK_VECTOR_DB` | `true` bez Vector Search |
| `VECTOR_INDEX_ENDPOINT_ID` | Pełna nazwa zasobu endpointu |
| `VECTOR_DEPLOYED_INDEX_ID` | ID wdrożonego indeksu |
| `EMBEDDING_MODEL` | Domyślnie `text-embedding-004` |

---

## 4. Role (rozszerzenie)

Zob. [gcp-saas-access-matrix-11x6.md](gcp-saas-access-matrix-11x6.md) i [system-philosophy-governance.md](system-philosophy-governance.md): **ML Engineer**, **Data Engineer** — dostęp do Vertex, BigQuery, bucketów; bez `container.admin`, jeśli GKE nie jest wymagany.

---

## 5. Zgodność (UE/PL)

- Dane i indeksy w **UE** (`europe-central2`).
- Bez surowych PII w logach BQ — tylko hashe / pseudonimy.
- Uzasadnienia decyzji po polsku — pod audyt (zob. [system-philosophy-governance.md](system-philosophy-governance.md)).

---

## 6. Mapa kodu

| Ścieżka | Zawartość |
|---------|-----------|
| `data/ingest.py` | Ingest PDF → JSONL z embeddingami |
| `data/eval_rag.py` | Offline hit@k (mock lub dopasowanie źródła) |
| `backend/app/services/retrieval.py` | Wyszukiwanie hybrydowe |
| `backend/app/services/vertex_vector.py` | Embedding zapytania + Vector Search (po konfiguracji) |
| `infra/pulumi/__main__.py` | GCS (raw + embeddingi), BQ, API |
