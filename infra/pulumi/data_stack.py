"""
infra-data stack: GCS (raw / processed / embeddings), BigQuery, optional private Cloud SQL.
Requires Pulumi stack reference to infra-core when createCloudSql is true.
"""

from __future__ import annotations

import pulumi
import pulumi_gcp as gcp
import pulumi_random as random

from camunda_sql_gcp import provision_camunda_postgres
from policy import require_gcs_versioning_on_create
from provider_util import gcp_provider_args


def provision() -> None:
    gcp_cfg = pulumi.Config("gcp")
    project_id = gcp_cfg.require("project")
    cfg = pulumi.Config("credit-scoring")
    region = cfg.get("region") or "europe-central2"
    cluster_name = cfg.get("clusterName") or "hbg-gke"
    create_sql = cfg.get_bool("createCloudSql") or False
    sql_tier = cfg.get("cloudSqlTier") or "db-f1-micro"
    bq_dataset_id = cfg.get("bigqueryDatasetId") or "hbg_analytics"

    provider = gcp.Provider("gcp", **gcp_provider_args(project_id, region))

    suffix = random.RandomString(
        "bucket_suffix",
        length=4,
        lower=True,
        upper=False,
        numeric=True,
        special=False,
    )

    storage_api = gcp.projects.Service(
        "storage_api",
        project=project_id,
        service="storage.googleapis.com",
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

    def _make_bucket(logical: str) -> gcp.storage.Bucket:
        bname = pulumi.Output.concat(project_id, "-hbg-", logical, "-", suffix.result)
        args = require_gcs_versioning_on_create(
            {
                "name": bname,
                "location": region,
                "uniform_bucket_level_access": True,
            }
        )
        b = gcp.storage.Bucket(
            f"gcs_{logical}",
            opts=pulumi.ResourceOptions(provider=provider, depends_on=[storage_api]),
            **args,
        )
        pulumi.export(f"bucket_{logical}", b.name)
        return b

    _make_bucket("raw")
    _make_bucket("processed")
    _make_bucket("embeddings")

    bq_dataset = gcp.bigquery.Dataset(
        "hbg_analytics",
        dataset_id=bq_dataset_id,
        project=project_id,
        location=region,
        friendly_name="HBG loan / RAG analytics",
        description="Query logs, offline eval (no raw PII in this dataset).",
        opts=pulumi.ResourceOptions(provider=provider, depends_on=[bigquery_api]),
    )

    if create_sql:
        core_ref = cfg.require("coreStackRef")
        ref = pulumi.StackReference("core_stack", core_ref)
        network_link = ref.require_output("network_self_link")
        provision_camunda_postgres(
            provider=provider,
            project_id=project_id,
            region=region,
            network_self_link=network_link,
            sql_tier=sql_tier,
            fixed_instance_name=cloud_sql_name_opt,
            bucket_suffix=suffix,
        )

    pulumi.export("gcp_project", project_id)
    pulumi.export("gcp_region", region)
    pulumi.export("bigquery_dataset", bq_dataset.dataset_id)
    pulumi.export("cluster_name", cluster_name)
    pulumi.export("stack_role", "infra-data")
