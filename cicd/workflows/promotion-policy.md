# Promotion Policy (dev -> stage -> prod)

## Rules

- Only immutable artifacts can be promoted.
- Promotion must use the same image digest and release metadata.
- No direct deployment from feature branches to `stage` or `prod`.

## Gates

- `dev`: automatic after merge and successful CI.
- `stage`: manual approval + integration and regression checks.
- `prod`: dual approval, change window, and rollout guardrails.

## Rollback Trigger

If canary SLOs fail or critical smoke tests fail, rollback to last stable version.
