# Apps Runtime

This directory contains deployable workloads for the platform runtime.

## Structure

- `camunda/` — Camunda deployment manifests/charts and workflow release assets.
- `workers/` — background workers (credit scoring, notifications, integrations).
- `api/` — API services deployed to GKE.

## DevOps Rules

- Build once, promote the same artifact across `dev` -> `stage` -> `prod`.
- Keep deployment manifests versioned with application releases.
- Do not keep environment secrets in this directory.
