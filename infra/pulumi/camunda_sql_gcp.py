"""
Private Cloud SQL (PostgreSQL) for Camunda / apps: instance, dev/ref/prod DBs, user, Secret Manager.
Pulumi resource id for the instance remains app_postgres; GCP name: credit-scoring:cloudSqlInstanceName or hbg-pg-<random>.
"""

from __future__ import annotations

import pulumi
import pulumi_gcp as gcp
import pulumi_random as random


def provision_camunda_postgres(
    provider: gcp.Provider,
    project_id: str,
    region: str,
    network_self_link: pulumi.Input[str],
    sql_tier: str,
    fixed_instance_name: str | None,
    bucket_suffix: random.RandomString,
) -> gcp.sql.DatabaseInstance:
    sqladmin = gcp.projects.Service(
        "sqladmin_api",
        project=project_id,
        service="sqladmin.googleapis.com",
        disable_on_destroy=False,
        opts=pulumi.ResourceOptions(provider=provider),
    )
    sm_api = gcp.projects.Service(
        "secretmanager_api_data",
        project=project_id,
        service="secretmanager.googleapis.com",
        disable_on_destroy=False,
        opts=pulumi.ResourceOptions(provider=provider),
    )

    if fixed_instance_name and fixed_instance_name.strip():
        inst_name: str | pulumi.Output[str] = fixed_instance_name.strip()
    else:
        inst_name = pulumi.Output.concat("hbg-pg-", bucket_suffix.result)

    instance = gcp.sql.DatabaseInstance(
        "app_postgres",
        name=inst_name,
        database_version="POSTGRES_15",
        region=region,
        deletion_protection=False,
        settings=gcp.sql.DatabaseInstanceSettingsArgs(
            tier=sql_tier,
            ip_configuration=gcp.sql.DatabaseInstanceSettingsIpConfigurationArgs(
                ipv4_enabled=False,
                private_network=network_self_link,
            ),
        ),
        opts=pulumi.ResourceOptions(provider=provider, depends_on=[sqladmin]),
    )

    gcp.sql.Database("camunda_dev", name="camunda_dev", instance=instance.name, project=project_id, opts=pulumi.ResourceOptions(provider=provider, depends_on=[instance]))
    gcp.sql.Database("camunda_ref", name="camunda_ref", instance=instance.name, project=project_id, opts=pulumi.ResourceOptions(provider=provider, depends_on=[instance]))
    gcp.sql.Database("camunda_prod", name="camunda_prod", instance=instance.name, project=project_id, opts=pulumi.ResourceOptions(provider=provider, depends_on=[instance]))

    db_password = random.RandomPassword(
        "camunda_sql_password",
        length=32,
        special=False,
    )

    gcp.sql.User(
        "camunda_app_user",
        name="camunda",
        instance=instance.name,
        password=db_password.result,
        project=project_id,
        opts=pulumi.ResourceOptions(provider=provider, depends_on=[instance], delete_before_replace=True),
    )

    sm_secret = gcp.secretmanager.Secret(
        "camunda_pg_password",
        secret_id="hbg-camunda-postgres",
        project=project_id,
        replication=gcp.secretmanager.SecretReplicationArgs(
            auto=gcp.secretmanager.SecretReplicationAutoArgs(),
        ),
        opts=pulumi.ResourceOptions(provider=provider, depends_on=[sm_api]),
    )
    gcp.secretmanager.SecretVersion(
        "camunda_pg_password_v1",
        secret=sm_secret.id,
        secret_data=db_password.result,
        opts=pulumi.ResourceOptions(provider=provider, depends_on=[sm_secret, db_password]),
    )

    pulumi.export("cloud_sql", "private_ipv4_only")
    pulumi.export("cloud_sql_instance_name", instance.name)
    pulumi.export("cloud_sql_connection_name", instance.connection_name)
    pulumi.export("camunda_databases", "camunda_dev,camunda_ref,camunda_prod")
    pulumi.export("camunda_db_user", "camunda")
    pulumi.export("camunda_db_password_secret_id", "hbg-camunda-postgres")
    return instance
