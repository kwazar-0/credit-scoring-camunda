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

### End-to-end deployment chain (reality)

This is the path a change follows from commit to execution. It is not instantaneous; steps can fail independently.

```text
GitHub (PR / merge)
  -> CI/CD (build, test, scan, package)
  -> artifact registry (image/chart digest recorded)
  -> Pulumi (preview/apply per stack: core -> data -> runtime)
  -> GCP APIs (network, IAM, GKE, storage, etc.)
  -> GKE (rollout / health checks)
  -> Camunda runtime (BPMN/DMN + workers executing process tasks)
```

**Pulumi:** stacks are applied in dependency order. A failed `runtime` apply does not retroactively undo `core`; recovery is forward correction or a reviewed rollback plan, not a hidden “undo”.

**GKE:** workloads are updated via controlled rollout (same digest promoted from dev onward where policy allows). Node upgrades and quota pressure are platform events, not application bugs.

**Camunda:** process definitions and DMN are versioned with the release train. Operators expect occasional mismatch between “deployed gateway” and “in-flight instances” during rollout; mitigation is documented replay or version pinning, not silent auto-migration of all instances.

**Manual gates:** production promotion and some infra classes still require human approval or a scheduled window. That is intentional for SoD and audit, not a gap in automation maturity.

### CI/CD operations (pipeline behavior and gating)

| Stage | What runs | What blocks the next step |
|--------|------------|-----------------------------|
| Build | compile / image build | compile errors, missing deps |
| Test | unit / integration / smoke | failing tests, flaky suites above threshold |
| Package | tag digest, SBOM/signing if enabled | policy scan failure, unsigned artifact policy |
| Deploy (dev) | apply to dev cluster / dev Camunda | health check failure, smoke failure on critical path |
| Promote (stage/prod) | same digest, env-specific values | missing approval, change freeze, failed integration gate |
| Rollback | redeploy prior digest or workflow package | manual decision if data/process state is ambiguous |

**Environments:** `dev`, `stage`, and `prod` are separated by configuration and IAM boundaries. Configuration drift between them is a known operational risk; drift checks are part of normal platform work.

**Rollback:** default is “last known good artifact + last known good workflow package.” Infra rollback is rarer and usually a forward fix after review.

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

## Failure and incident model (what breaks, how we find it, how we fix it)

| Component | Failure mode | Detection | Impact | Troubleshooting path | Recovery |
|---|---|---|---|---|---|
| Camunda / Zeebe | Stuck jobs, incidents, broker pressure | Tasklist/Operate metrics, incident counters, job backlog | Decisions delayed; human tasks pile up | Identify process version and failed job type; check worker logs for same correlation id | Retry with backoff, manual replay for affected keys, rollback BPMN/DMN package if regression |
| GKE / workers | Pod crash loop, node pressure, eviction | Pod restart rate, `Pending` pods, node conditions | Throughput drop; scoring path may degrade | `kubectl` describe pod/node; check resource requests vs limits; trace to deployment revision | Scale pool or reduce load; redeploy stable image; tune resources if root cause is sizing |
| CI/CD | Broken pipeline, bad artifact, failed deploy | Red pipeline, failed gate, smoke alerts | No promotion; dev may be broken | Inspect job logs and test output; bisect recent merges; compare digest with last green | Fix forward on branch; revert merge; redeploy last green digest to affected env |
| Pulumi / GCP | Partial apply, API quota, IAM drift | `pulumi` preview/up errors, drift job diffs | Infra out of spec; new workloads may fail to schedule | Compare state file intent vs GCP console; narrow to one stack; read cloud audit logs | Forward-fix with reviewed `up`; avoid blind destroy; document change for audit |

## Troubleshooting loop (how engineers actually work)

Operators do not guess in isolation. The loop is deliberate and cross-layer:

```text
Detect  ->  Trace  ->  Correlate  ->  Fix  ->  Redeploy / verify
```

- **Detect:** alerts, user reports, failed pipelines, Camunda incidents, SRE dashboards.
- **Trace:** request or correlation id from edge (API) through logs; map to process instance id in Camunda; map to pod and revision in GKE.
- **Correlate:** align timestamps with **GitHub** pipeline run and merged commit; align with **Pulumi** stack update window; align with **GCP** audit and infra change records; align with **Camunda** history for the same instance.
- **Fix:** smallest change that restores service (scale, config, rollback digest, workflow replay). Prefer evidence-backed change over broad restarts.
- **Redeploy / verify:** confirm health checks, rerun smoke on critical path, watch error budget for the release window.

If correlation fails, the incident is escalated with partial evidence. That is normal; the system is not assumed to be self-explaining.

## The system in real life

- Not every path is fully automated. Approvals, replay, and some infra corrections are manual by design.
- Operability is prioritized over theoretical completeness: coverage gaps in metrics and logs are closed incrementally.
- Debugging is multi-layer by necessity: no single tool shows API, process engine, and cluster state in one pane for all failure modes.
- “Working as designed” can still mean friction for the operator. That friction is the cost of auditability and separation of duties in a regulated context.

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
