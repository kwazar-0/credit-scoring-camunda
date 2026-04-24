---
layout: home

hero:
  name: Handlowy Bank Galicyjski (HBG)
  text: Camunda 8 + pipeline AI
  tagline: >-
    Monorepo: FastAPI + LangGraph, PyZeebe, Streamlit, Pulumi (GCP, europe-central2), RAG, Vertex AI.
    Poniżej skrót; pełna treść w Architekturze.
  image:
    src: /images/hbg-bf1.png
    alt: Handlowy Bank Galicyjski
  actions:
    - theme: brand
      text: Architektura
      link: /pl/architecture
    - theme: brand
      text: Mapa prac (infra)
      link: /pl/INFRA-IMPLEMENTATION
    - theme: alt
      text: Spis treści
      link: /pl/toc

features:
  - icon: 🏦
    title: Proces i orkiestracja
    details: Zeebe, BPMN/DMN, workery w worker/ — deterministyczne kroki, nie „jeden chat”.
  - icon: 🧠
    title: Vertex AI i RAG
    details: Embeddingi, wyszukiwanie, LLM w backend/; PII w kodzie. Zob. ml-data-rag, hbg-rag-dominance.
  - icon: 🏛
    title: Chmura i IaC
    details: Pulumi, GKE, OIDC, split — INFRA-IMPLEMENTATION i infra-pulumi-iac (Źródło).
  - icon: 🖥
    title: API i UI
    details: backend/, ui/ (Streamlit) — granice w .cursorrules.
  - icon: 📋
    title: Role i rekrutacja
    details: U1–U6, RACI — hr-offers-hbg; macierz GCP — gcp-saas-access-matrix-11x6.
  - icon: 🔗
    title: Repozytorium
    details: Źródła i CI na GitHub; witryna z docs-site/ (VitePress).
---

## O projekcie

**Szkoleniowy / demonstracyjny** przepływ kredytowy z **Camunda 8**, **Vertex AI** (RAG) i **GCP**. Domyślny region IaC: **europe-central2**. Warstwy, tabela, przepływ danych — **[Architektura](/pl/architecture)**.

| Gdzie iść | Dokument |
|-----------|----------|
| Start | [INFRA-IMPLEMENTATION](/pl/INFRA-IMPLEMENTATION) — fazy, Camunda+AI, linki |
| Pulumi, GKE, OIDC | [infra-pulumi-iac](/pl/infra-pulumi-iac) |
| ML, embeddingi, env | [ml-data-rag](/pl/ml-data-rag) |
| Strategia HBG, role U* | [hbg-rag-dominance](/pl/hbg-rag-dominance) |
| gcloud / kubectl | [cli-console](/pl/cli-console) |
| Wszystkie strony | [toc](/pl/toc) |

> Inne języki: [Русский](/) · [English](/en/)