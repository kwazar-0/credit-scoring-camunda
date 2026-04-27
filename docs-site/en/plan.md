---
title: "Plan & roadmap"
description: "Evolution strategy, delivery phases, and lifecycle of major components; links to the infra track."
---

# Plan & roadmap

**LEVEL 3** — how the system **evolves**. Detailed operator steps and “where to look” live in [INFRA-IMPLEMENTATION](/en/INFRA-IMPLEMENTATION) (single implementation track on this site). This page ties **phases** to **architecture layers** and **governance** without duplicating every command.

---

## Evolution strategy

1. **Foundation first** — GCP project, APIs, Pulumi state, split stacks, baseline artifacts (GCS, BQ, registry). *Without this, GKE and RAG are not reproducible.*
2. **Trust path for automation** — CI to GCP (OIDC / WIF), no long-lived JSON keys in pipelines.
3. **Runtime** — GKE (Standard), workloads, Workload Identity, namespaces aligned with `k8s/hbg/` and `k8s/camunda/`.
4. **Data & cognition** — RAG path (GCS → ingest → embeddings / vector search) so backend behaviour matches real latency and limits, not only mocks.
5. **Process in cloud** — BPMN/DMN, Zeebe, workers, secrets; end-to-end process tests.
6. **Maturity** — observability, access matrix, CODEOWNERS, hardening (see [system-philosophy-governance](/en/system-philosophy-governance) and [appendix](/en/appendix)).

**Rejected shortcut:** “Camunda and workers first, RAG last” — high **refactor risk** when the retrieval path changes contracts and SLOs. The repo’s order prefers a **credible data path** before treating the process as “done”.

---

## Phases (summary)

| # | Phase | “Done” means (short) | Detail |
|---|--------|----------------------|--------|
| 1 | Cloud + IaC (dev) | Pulumi up on **dev**, baseline resources, state | [INFRA-IMPLEMENTATION](/en/INFRA-IMPLEMENTATION), [infra-pulumi-iac](/en/infra-pulumi-iac) |
| 2 | CI → GCP | Pipelines use OIDC, not committed keys | Workflows in repo, `workload_identity_github.py` |
| 3 | GKE + images | Standard cluster, AR images, WI for pods | [infra-pulumi-iac](/en/infra-pulumi-iac), `k8s/hbg/` |
| 4 | RAG data | PDF → GCS → embeddings → vector path without mock DB | [ml-data-rag](/en/ml-data-rag), `data/` |
| 5 | Camunda in stack | BPMN/DMN, workers stable vs backend | `bpmn/`, `dmn/`, `worker/` |
| 6 | Observability / policy | Logs, BQ, roles matrix, least privilege | [gcp-saas-access-matrix-11x6](/en/gcp-saas-access-matrix-11x6) |

**MVP product contour (from product handoff):** focus on **1 → 4** first, then **5** and E2E tests; **6** is post-MVP for many teams.

---

## Lifecycle of major components

- **BPMN/DMN** — versioned in repo; deploy with the same **review discipline** as code; process changes are **first-class** changes.
- **Backend / workers** — ship in the **monorepo** to keep job types and APIs aligned; split repos only if release trains require it (revisit in [architecture](/en/architecture)).
- **Pulumi stacks** — **infra-core** (slow: VPC, PSA), **infra-data** (durable stores), **infra-runtime** (GKE, frequent); avoid one giant `up` for everything.
- **Models** — Vertex in-region by default; external frontier models need a **gateway** and PII policy (see backend `pii` usage).

**Scaling model:** scale **workers and cluster** for throughput; scale **RAG and BQ** for evidence volume; scale **governance** (roles, SDLC) with the **11×6** model, not ad-hoc admin access.

---

## Consistent terminology (for this plan)

- **Environments** — e.g. **dev** / **stage** / **prod** (exact names in your Pulumi config — see [naming](/en/naming) and [accounts](/en/accounts)).
- **Stacks** — Pulumi `stackRole` and stack names; do not conflate with Camunda *process* or Kubernetes *namespace* without context.
- **Workflows** — **Camunda** process instances vs **GitHub Actions** CI workflows — disambiguate in speech and runbooks.

**Next:** [appendix](/en/appendix) for deep links · [main](/en/main) to restart the tour.

> [Русский (полный)](/ru/plan) · [Polski (pełny)](/pl/plan)
