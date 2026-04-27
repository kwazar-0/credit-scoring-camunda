# CI/CD Pipeline

## Pipeline Stages

1. Build: compile and package deployable units.
2. Test: unit, integration, and smoke tests.
3. Security: dependency, secret, and static analysis scans.
4. Publish: push signed artifacts to registry.
5. Deploy: environment-specific rollout with gates.

## Promotion Model

- `dev`: automatic deployment after successful merge to main branch.
- `stage`: approval gate + integration/regression verification.
- `prod`: dual approval + controlled rollout strategy.

## Artifact Versioning

- Use immutable image tags with commit SHA and semver release tags.
- Promote by digest, not by mutable tag.
- Keep release manifest for auditability.

## Rollback Strategy

- Automatic rollback on failed health checks during rollout.
- Manual rollback action to the last stable artifact digest.
