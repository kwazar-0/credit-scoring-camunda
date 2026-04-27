# Environment Stacks

Environment-level Pulumi configuration and overlays.

## Expected Layout

- `dev/` — development stack config and defaults.
- `stage/` — pre-production stack config.
- `prod/` — production stack config with stricter policies.

Keep environment-specific values here, not inside shared module code.
