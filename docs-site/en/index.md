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

## Project philosophy

Three pillars (each reduces chaos and operational risk):

1. **GitHub** — branch and merge rules match real roles and ownership.  
2. **Roles & 11×6** — “who owns what” in the product is tied to **which** GCP services an account may use.  
3. **Cloud split** — network, data, and cluster change at **different speeds**, without a single monolithic stack.

### GitHub: role — branch — access

**Section note:** one line from repo policy to actual merge/deploy permissions.

Keep **repo policy** (branches, releases, protection, environments) aligned with **who** can change code and **what** merge/deploy access means in practice:

- [git-workflow](/en/git-workflow) — `main` / `develop`, `release/*`, tags. **In short:** when code lands on stable branches and how releases are shaped.  
- [github-setup](/en/github-setup) — branch protection, Environments. **In short:** who can merge where and which environments participate in delivery.  
- [github-codeowners-matrix](/en/github-codeowners-matrix) — roles ↔ CODEOWNERS / ownership. **In short:** automatic reviews and gates by repo area.  
- [naming](/en/naming) — repo, branch, and clone folder naming. **In short:** consistent names so projects, branches, and local clones stay unambiguous.

### “Departments”, functions, and the 11×6 matrix

**Section note:** link “team/bank function” ↔ “cloud access” without a vague “everyone is Owner”.

HBG docs describe **organizational-style roles** (U1–U6: cloud, ops, ML/prompts, data, quality, audit) and map them to a **GCP/SaaS access matrix** (11 roles × accounts):

- [hbg-rag-dominance](/en/hbg-rag-dominance) — platform strategy, contours, U1–U6. **In short:** why three layers (orchestration / AI+RAG / cloud) and how they connect.  
- [hr-offers-hbg](/en/hr-offers-hbg) — hiring, RACI, delivery stages. **In short:** who drives delivery by role and how RACI maps to it.  
- [gcp-saas-access-matrix-11x6](/en/gcp-saas-access-matrix-11x6) — **11×6 matrix**. **In short:** least privilege on services—no blanket Editor for everyone.

### Cloud: responsibility and lifecycle (Pulumi split)

**Section note:** infrastructure as three layers with different change cadence and owners.

GCP is split by `credit-scoring:stackRole` so **network**, **data**, and **app runtime** evolve **independently** with a smaller blast radius:

| Layer | `stackRole` | Meaning | In short |
|-------|-------------|---------|----------|
| Network foundation | `infra-core` | VPC, subnets, PSA for private data paths | Rarely changes; foundation for everything else |
| Data | `infra-data` | GCS, BigQuery, optional Cloud SQL | Long-lived data; not recreated on every cluster deploy |
| Runtime | `infra-runtime` | GKE, Artifact Registry, Workload Identity for pods | App plane; usual place for upgrades and scaling |

- [infra-pulumi-iac](/en/infra-pulumi-iac) — SoT for `stackRole`, split stacks, OIDC on this site. **In short:** what the Pulumi code models and how to read it.  
- [`infra/README.md`](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/infra/README.md) — step-by-step pet runbook in the repo. **In short:** billing, state bucket, `coreStackRef`, IAM, and common errors from practice.

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

> Other languages: [Polski (default)](/pl/) · [Русский](/ru/) · [ADR (summary)](/adr)