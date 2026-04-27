---
layout: page
title: Technical documentation
description: Credit Scoring / HBG monorepo — VitePress
outline: [2, 3]
---

# Credit Scoring / HBG

## DevOps-first path (start here)

Read in order: **[DevOps operating model](/en/devops-operating-model)** → **[CI/CD pipeline](/en/cicd-pipeline)** → **[deployment lifecycle](/en/deployment-lifecycle)** → **[observability and incident response](/en/observability-and-incident)** → **[governance and controls](/en/governance-and-controls)**.

---

## Solution overview

**HBG Credit Scoring** is an automation platform for credit decision flow where decisions are implemented as an engineering process, not a single LLM call.  
Core stack: **Camunda 8 (BPMN/DMN)** + **FastAPI/LangGraph** + **Vertex AI RAG** + **GKE/Pulumi**.

Why this matters in practice:

- **Transparent decision flow** — BPMN/DMN makes each step explicit and reviewable.
- **Controlled AI layer** — LLM is embedded inside policy/process boundaries, not replacing them.
- **Audit readiness** — roles, access and actions are traceable.
- **Operational scale** — infrastructure is split by lifecycle (`infra-core` / `infra-data` / `infra-runtime`).

## Project philosophy

- **Git as source of truth** — technical decisions, IaC and docs are versioned and reviewed together.
- **Orchestration over ad-hoc flow** — the credit process is explicit and auditable (BPMN/DMN), with a controlled AI layer.
- **Least privilege + SoD** — GCP/GitHub access is role-mapped, not “everyone is admin”.
- **Split lifecycle** — network, data and runtime evolve independently with smaller blast radius.

## How to navigate the docs

### 1) Production operation narrative

- **[devops-operating-model](/en/devops-operating-model)** — production operating boundaries.
- **[cicd-pipeline](/en/cicd-pipeline)** — controls from commit to production.
- **[deployment-lifecycle](/en/deployment-lifecycle)** — infra and app rollout model.
- **[observability-and-incident](/en/observability-and-incident)** — logging, metrics, alerting, response.
- **[governance-and-controls](/en/governance-and-controls)** — segregation of duties and audit controls.

### 2) Implementation start

- **[INFRA-IMPLEMENTATION](/en/INFRA-IMPLEMENTATION)** — primary phase order and first reading path.
- **[architecture](/en/architecture)** — system layout, boundaries and data flow.
- **[infra-pulumi-iac](/en/infra-pulumi-iac)** — Pulumi, `stackRole`, split stacks, OIDC.

### 3) Operations and debugging

- **[cli-console](/en/cli-console)** — `gcloud`, Pulumi, `kubectl` commands.
- **[ml-data-rag](/en/ml-data-rag)** — RAG/Vertex and backend environment.
- **[toc](/en/toc)** — full site contents.

### 4) Governance (post-MVP)

- **[gcp-saas-access-matrix-11x6](/en/gcp-saas-access-matrix-11x6)** — role-based GCP access model.
- **[team-11x6-organization](/en/team-11x6-organization)** — team model, personas and SDLC.
- **[github-codeowners-matrix](/en/github-codeowners-matrix)** — review ownership in GitHub.

## Repository

- **GitHub:** [kwazar-0/credit-scoring-camunda](https://github.com/kwazar-0/credit-scoring-camunda)
- **Naming/remote:** [naming](/en/naming)

---

**Languages:** [Polski (default)](/pl/) · [Русский](/ru/) · [ADR](/adr)
