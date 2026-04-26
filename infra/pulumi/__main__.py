"""
Pulumi: GCP infrastructure — stackRole legacy | infra-core | infra-data | infra-runtime.

Canonical docs: docs-site (e.g. infra-pulumi-iac). Historical notes: doc/_archive/.

- legacy (default): GCS (raw, processed, embeddings) + BQ + Artifact Registry + optional GitHub WIF
- infra-core: VPC, Private Service Access, optional GitHub WIF
- infra-data: versioned GCS + BQ, optional private Cloud SQL (requires core + coreStackRef); with createCloudSql: instance (default name postgres-instance), DBs camunda_dev|ref|prod, user, Secret Manager
- infra-runtime: GKE + AR, Vertex API + GSA/Workload Identity (Gemini + Cloud SQL client for k8s SAs) (requires coreStackRef to infra-core)

Configure: pulumi config set gcp:project PROJECT
  pulumi config set credit-scoring:stackRole infra-data  # or omit for legacy
"""

from __future__ import annotations

import pulumi

import core_stack
import data_stack
import legacy_stack
import runtime_stack

cfg = pulumi.Config("credit-scoring")
role = (cfg.get("stackRole") or "legacy").strip().lower()

if role in ("", "legacy", "default", "all-in-one"):
    legacy_stack.provision()
elif role in ("infra-core", "core"):
    core_stack.provision()
elif role in ("infra-data", "data"):
    data_stack.provision()
elif role in ("infra-runtime", "runtime"):
    runtime_stack.provision()
else:
    raise ValueError(
        f"Unknown credit-scoring:stackRole={role!r}. "
        "Use legacy, infra-core, infra-data, or infra-runtime."
    )
