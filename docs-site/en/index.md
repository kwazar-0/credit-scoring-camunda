---
layout: home

hero:
  name: Handlowy Bank Galicyjski (HBG)
  text: Camunda 8 + AI credit pipeline
  tagline: >-
    Monorepo: FastAPI + LangGraph, PyZeebe, Streamlit, Pulumi (GCP, europe-central2), RAG, Vertex AI.
    Below is a short overview; the full view is in Architecture.
  image:
    src: /images/hbg-bf1.png
    alt: Handlowy Bank Galicyjski
  actions:
    - theme: brand
      text: Architecture
      link: /en/architecture
    - theme: brand
      text: Roadmap (infra)
      link: /en/INFRA-IMPLEMENTATION
    - theme: alt
      text: Table of contents
      link: /en/toc

features:
  - icon: 🏦
    title: Process & orchestration
    details: Zeebe, BPMN/DMN, workers in worker/ — business steps are deterministic, not a single “chat” path.
  - icon: 🧠
    title: Vertex AI & RAG
    details: Embeddings, search, LLM (Gemini) in backend/; PII policy in code. See ml-data-rag, hbg-rag-dominance.
  - icon: 🏛
    title: Cloud & IaC
    details: Pulumi, GKE, OIDC, split stacks, CLI — INFRA-IMPLEMENTATION and infra-pulumi-iac (SoT).
  - icon: 🖥
    title: API & UI
    details: backend/ (HTTP, graph), ui/ (Streamlit) — boundaries in .cursorrules.
  - icon: 📋
    title: Roles & hiring
    details: U1–U6 matrix, jobs and RACI — hr-offers-hbg; GCP — gcp-saas-access-matrix-11x6.
  - icon: 🔗
    title: Repository
    details: Source and CI on GitHub; this site is built from docs-site/ (VitePress).
---

## About this project

A **demo / training** credit-decision stack with **Camunda 8** (orchestration), **Vertex AI** (RAG, generation) and **GCP**. Default IaC region: **europe-central2**. Layers, component table, and data flow — **[Architecture](/en/architecture)**.

| Go to | Page |
|-------|------|
| Where to start | [INFRA-IMPLEMENTATION](/en/INFRA-IMPLEMENTATION) — phases, Camunda+AI, links |
| Pulumi, GKE, OIDC | [infra-pulumi-iac](/en/infra-pulumi-iac) |
| ML, embeddings, env | [ml-data-rag](/en/ml-data-rag) |
| HBG strategy, U* roles | [hbg-rag-dominance](/en/hbg-rag-dominance) |
| gcloud / kubectl | [cli-console](/en/cli-console) |
| All pages | [toc](/en/toc) |

> Other languages: [Русский](/) · [Polski](/pl/)