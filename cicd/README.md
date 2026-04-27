# CI/CD

Production delivery model for platform and application changes.

## Pipeline Layers

- `pipelines/` — CI and CD workflow definitions.
- `workflows/` — promotion, release, and rollback operating policies.
- `security/` — software supply chain controls.

## Expected Lifecycle

1. Build, test, scan, and package.
2. Deploy to `dev` automatically after merge.
3. Promote to `stage` with quality gates.
4. Promote to `prod` with approval + monitored rollout.
