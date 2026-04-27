"""
Single-stack (legacy) layout: GCS (raw, processed, embeddings) + BQ + Artifact Registry + optional GitHub WIF.
Use when credit-scoring:stackRole is unset or "legacy" — e.g. existing `dev` stack / CI.
"""

from __future__ import annotations

import pulumi
import pulumi_gcp as gcp
import pulumi_random as random

from policy import require_gcs_versioning_on_create
from provider_util import gcp_provider_args
from workload_identity_github import provision as provision_github_wif


def provision() -> None:
    gcp_cfg = pulumi.Config("gcp")
    project_id = gcp_cfg.require("project")
    cfg = pulumi.Config("credit-scoring")
    region = cfg.get("region") or "europe-central2"
    cluster_name = cfg.get("clusterName") or "hbg-gke"
    repo_id = cluster_name.replace("_", "-") + "-docker"

    provider = gcp.Provider("gcp", **gcp_provider_args(project_id, region))

    suffix = random.RandomString(
        "bucket_suffix",
        length=4,
        lower=True,
        upper=False,
        numeric=True,
        special=False,
    )

    artifactregistry_api = gcp.projects.Service(
        "artifactregistry_api",
        project=project_id,
        service="artifactregistry.googleapis.com",
        disable_on_destroy=False,
        opts=pulumi.ResourceOptions(provider=provider),
    )
    aiplatform_api = gcp.projects.Service(
        "aiplatform_api",
        project=project_id,
        service="aiplatform.googleapis.com",
        disable_on_destroy=False,
        opts=pulumi.ResourceOptions(provider=provider),
    )
    bigquery_api = gcp.projects.Service(
        "bigquery_api",
        project=project_id,
        service="bigquery.googleapis.com",
        disable_on_destroy=False,
        opts=pulumi.ResourceOptions(provider=provider),
    )
    storage_api = gcp.projects.Service(
        "storage_api",
        project=project_id,
        service="storage.googleapis.com",
        disable_on_destroy=False,
        opts=pulumi.ResourceOptions(provider=provider),
    )

    def _bucket(
        logical: str, *, name_suffix: str | None = None, pulumi_id: str | None = None
    ) -> gcp.storage.Bucket:
        rid = pulumi_id or logical
        ns = name_suffix or logical
        name = pulumi.Output.concat(project_id, "-pulumi-", ns, "-", suffix.result)
        args = require_gcs_versioning_on_create(
            {
                "name": name,
                "location": region,
                "uniform_bucket_level_access": True,
            }
        )
        return gcp.storage.Bucket(
            rid,
            opts=pulumi.ResourceOptions(provider=provider, depends_on=[storage_api]),
            **args,
        )

    # Historical export names: embeddings (vector) + raw PDFs; add processed.
    emb = _bucket("embeddings", name_suffix="emb", pulumi_id="vector_embeddings")
    raw = _bucket("raw", name_suffix="raw", pulumi_id="raw_regulations")
    _processed = _bucket("processed", name_suffix="processed")
    _ = _processed

    bq_dataset = gcp.bigquery.Dataset(
        "hbg_analytics",
        dataset_id="hbg_analytics",
        project=project_id,
        location=region,
        friendly_name="HBG loan / RAG analytics (sample)",
        description="Query logs, offline eval exports, token/cost aggregates (no raw PII).",
        delete_contents_on_destroy=True,
        opts=pulumi.ResourceOptions(provider=provider, depends_on=[bigquery_api]),
    )

    gcp.artifactregistry.Repository(
        "app",
        repository_id=repo_id,
        location=region,
        format="DOCKER",
        description="credit-backend, credit-worker, credit-ui (Pulumi sample)",
        opts=pulumi.ResourceOptions(provider=provider, depends_on=[artifactregistry_api]),
    )

    pulumi.export("gcp_project", project_id)
    pulumi.export("gcp_region", region)
    pulumi.export("cluster_name", cluster_name)
    pulumi.export("artifact_repository_id", repo_id)
    pulumi.export("vector_embeddings_bucket", emb.name)
    pulumi.export("raw_regulations_bucket", raw.name)
    pulumi.export("bigquery_dataset", bq_dataset.dataset_id)
    pulumi.export("artifact_registry_url", pulumi.Output.concat(region, "-docker.pkg.dev/", project_id, "/", repo_id))
    pulumi.export("stack_role", "legacy")

    provision_github_wif(provider=provider, project_id=project_id, region=region)
