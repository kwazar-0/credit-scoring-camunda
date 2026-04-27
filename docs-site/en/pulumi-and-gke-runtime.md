# Pulumi and GKE Runtime

## Pulumi Stack Model

- Core stack: shared networking, identity, and baseline controls.
- Data stack: storage/data services and related access policies.
- Runtime stack: GKE runtime, ingress, and platform add-ons.

## Environment Separation

- `dev`, `stage`, and `prod` stacks are configured separately.
- Production changes require stricter approval and audit trail.

## Runtime Operations

- Node pools and autoscaling are tuned per environment workload profile.
- Runtime add-ons provide observability, ingress, and security controls.
- Drift detection is performed regularly using preview and runtime checks.
