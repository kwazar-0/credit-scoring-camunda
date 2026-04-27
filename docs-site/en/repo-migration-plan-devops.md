# Repository Migration Plan (DevOps-First)

## 1. Move

- Consolidate deployment artifacts under `apps/`.
- Organize IaC layers under `infra/core`, `infra/data`, `infra/runtime`.
- Keep environment stack values under `infra/environments/{dev,stage,prod}`.
- Group operating procedures under `ops/`.

## 2. Rename

- Prefer operation-focused names (`deployment-lifecycle`, `observability-and-incident`, `governance-and-controls`).
- Keep architecture pages as supporting material, not as entry points.

## 3. Remove or Archive

- Archive redundant pages that duplicate old architectural narrative.
- Remove stale setup notes that conflict with current CI/CD and runtime flow.

## 4. Simplify

- Keep a single promotion path: `dev` -> `stage` -> `prod`.
- Keep one rollback policy and one runbook entry point per service domain.
- Keep one source of truth for each domain (`cicd`, `infra`, `ops`, `apps`).
