# ML, Data & RAG (Vertex AI, GCP)

Default data region: **`europe-central2`**. Code and env in `backend/`, data pipeline in `data/`, infra in `infra/pulumi/`.

---

## 1. Components

| Layer | Technology | Role |
|-------|--------------|------|
| **Sources** | PDF regulations, NBP, internal policies (as licensed) | Raw text for RAG |
| **Landing** | **GCS** bucket `raw-pdfs` (Pulumi: `raw_regulations_bucket`) | Immutable PDF store |
| **Processing** | `data/ingest.py` — PyMuPDF, chunks, overlap | Prep for embeddings |
| **Embeddings** | **`text-embedding-004`** (768 dim) | Vectors for Vector Search |
| **Vector index** | **Vertex AI Vector Search** (Matching Engine) | Semantic search + metadata filters |
| **Hybrid** | metadata `product_type`, `source`, `section` | Domain bounds (Hipoteka vs Pożyczka) |
| **LLM** | **Gemini 1.5 Pro** (Vertex) | Reasoning with RAG-bounded context |
| **Analytics / eval** | **BigQuery** dataset `hbg_analytics` | Request logs, offline quality, token cost |
| **App orchestration** | LangGraph in `backend/` | Mask PII → retrieve → rules → LLM → reflect |

---

## 2. Data flow (RAG)

```text
PDF → GCS (raw) → chunk → embed (text-embedding-004) → JSONL / batch →
→ Vertex Vector Search index deploy → backend retrieve → Gemini → odpowiedź PL
```

**Offline quality:** `data/eval_rag.py` — questions with expected `source`; hit@k over source in top-k.

---

## 3. Backend (env)

| Variable | Description |
|----------|-------------|
| `GOOGLE_CLOUD_PROJECT`, `GOOGLE_CLOUD_REGION` | Vertex / GCS |
| `USE_MOCK_VECTOR_DB` | `true` without Vector Search |
| `VECTOR_INDEX_ENDPOINT_ID` | Full endpoint resource name |
| `VECTOR_DEPLOYED_INDEX_ID` | Deployed index on endpoint |
| `EMBEDDING_MODEL` | Default `text-embedding-004` |

---

## 4. Roles (extension)

See [gcp-saas-access-matrix-11x6.md](gcp-saas-access-matrix-11x6.md) and [system-philosophy-governance.md](system-philosophy-governance.md): **ML Engineer**, **Data Engineer** — access to Vertex, BigQuery, buckets; no `container.admin` if GKE is not required.

---

## 5. Regulatory (EU/PL)

- Data and indices in the **EU** (`europe-central2`).
- No raw PII in BQ logs — only hashes / pseudonyms.
- Polish rationale for decisions — for audit (see [system-philosophy-governance.md](system-philosophy-governance.md)).

---

## 6. Code map

| Path | Contents |
|------|----------|
| `data/ingest.py` | Ingest PDF → JSONL embeddings |
| `data/eval_rag.py` | Offline hit@k eval (mock or source match) |
| `backend/app/services/retrieval.py` | Hybrid search |
| `backend/app/services/vertex_vector.py` | Query embedding + Vector Search (when configured) |
| `infra/pulumi/__main__.py` | GCS (raw + embeddings), BQ, APIs |
