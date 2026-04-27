---
title: "Credit Scoring Platform (Main)"
description: "Operational entry page with constraints, trade-offs, and failure behavior."
---

# Credit Scoring Platform (Main)

## 1. What the system is

HBG Credit Scoring is a Camunda-based credit decision platform for regulated environments. BPMN orchestrates process flow, DMN stores deterministic decision logic, API and workers execute tasks, and GCP infrastructure is managed with Pulumi. AI/RAG is a system element in the decision support path, but it is constrained by process rules and governance controls.

## 2. How it runs in production (DevOps flow)

The production lifecycle follows a controlled path from Git change to runtime verification:

```text
PR -> CI (build + test + scan) -> artifact publish -> deploy to dev
   -> promote to stage (approval + integration checks)
   -> promote to prod (approval + guarded rollout)
   -> runtime monitoring (logs + metrics + alerts)
   -> incident response / rollback to last stable release
```

### Deployment model (with operational constraints)

- Infra changes are applied by Pulumi stacks in order: core -> data -> runtime.
- Workloads are deployed to GKE from immutable images and versioned manifests/charts.
- Camunda updates include versioned BPMN/DMN assets to prevent process-rule drift.
- Promotion uses the same artifact digest across environments.
- Some production deployments are gated by manual approvals and release windows.
- On failed rollout health checks or SLO breach, rollback restores the last stable release.

### Operational reality (what is still manual)

- Some Camunda incident cases still require manual workflow replay.
- Some rollback decisions are manual when state consistency is unclear.
- Deep debugging of cross-service failures may require temporary platform-level access.
- Incident response is assisted by runbooks, not fully automated.

## 3. Key components

- Camunda and Zeebe for workflow orchestration and execution state.
- DMN decision tables for deterministic and reviewable credit logic.
- API, workers, and AI/RAG integration for execution of process tasks and decision support.
- GCP runtime (GKE, Cloud Storage, Artifact Registry, IAM) as production platform.
- Pulumi multi-stack IaC (core/data/runtime) for controlled infrastructure changes.

## Trade-offs by component

| Component | Why chosen | What was sacrificed | What is not optimal today |
|---|---|---|---|
| Camunda (BPMN/DMN) | Strong auditability and explicit process state | More operational overhead than a simple service flow | Incident handling and replay are not fully automated |
| GCP runtime (GKE, storage, registry) | Managed platform with strong IAM integration | Higher platform complexity and cost control effort | Capacity tuning still relies on manual review in peak periods |
| Pulumi (core/data/runtime stacks) | Code-level reuse and typed stack composition | Smaller ecosystem than Terraform in some tooling areas | Stack dependency management still needs experienced operators |
| CI/CD pipeline | Controlled promotion and release evidence | Slower releases due to approvals and quality gates | Not all checks are parallelized; lead time can spike |
| Governance (11x6 roles) | Segregation of duties and audit clarity | More coordination and slower operational decisions | Some changes still wait on role-specific approvers |

## Failure scenarios (what breaks first)

| Component | Failure mode | Detection | Recovery |
|---|---|---|---|
| Camunda/Zeebe | Workflow incidents and stuck jobs | Incident count rise, backlog growth, failed task metrics | Retry policy checks, manual replay for selected instances, rollback if release-related |
| Worker services | Retry storm or external dependency timeout | Error-rate alerts, queue lag, pod restart spikes | Scale workers, isolate bad dependency path, redeploy previous stable build |
| GKE runtime | Node pressure and pod evictions | Saturation alerts, scheduling failures | Scale node pool, tune requests/limits, shift traffic or reduce load |
| Pulumi deployment | Partial infra apply or drift | Pipeline apply failure, drift checks | Stop promotion, corrective apply, forward-fix with reviewed change |
| CI/CD | Broken build or invalid deployment artifact | Failing pipeline stage, smoke test failure | Block promotion, hotfix branch, redeploy last stable artifact digest |

## Non-goals (explicit)

- This platform does not provide fully automated incident response.
- This platform does not provide perfect observability coverage for every failure mode.
- This platform does not optimize autoscaling to minimum cost at all times.
- This platform does not provide one-click recovery for all stateful failures.
- This platform does not run unrestricted autonomous promotions to production.

## System evolution timeline

- **v0**: Initial API-centric flow with limited process visibility and manual operational steps.
- **v1**: Camunda introduced to make workflow state explicit and auditable.
- **v2**: Pulumi stack split into core/data/runtime to reduce blast radius of infra changes.
- **v3**: Governance model (11x6) formalized for role boundaries and auditability.
- **v4 (current)**: DevOps operations layer added (deployment, CI/CD, observability, incidents) with explicit failure and recovery model.

## Operations (DevOps)

- Deployment model: [operations deployment](/en/ops/deployment)
- CI/CD controls: [operations cicd](/en/ops/cicd)
- Observability model: [operations observability](/en/ops/observability)
- Failure and recovery flow: [operations incidents](/en/ops/incidents)

## Keep reading

- System deep dive: [Camunda process flow](/en/process-flow-camunda), [DMN decision model](/en/decision-model-dmn)
- Governance model: [gcp-saas-access-matrix-11x6](/en/gcp-saas-access-matrix-11x6)
- Infrastructure model: [infra-pulumi-iac](/en/infra-pulumi-iac), [infra-pulumi-gke-sandbox](/en/infra-pulumi-gke-sandbox)
