"""
Sandbox: GKE + private Cloud SQL + GCS + Artifact Registry (отдельный Pulumi app).
Политика репо: europe-central2, без публичного IP у Cloud SQL, Workload Identity, пустые oauth_scopes на нодах.
"""

from __future__ import annotations

import pulumi
import pulumi_gcp as gcp
import pulumi_random as random

cfg = pulumi.Config("gcp")
project_id = cfg.require("project")
region = cfg.get("region") or "europe-central2"
# Региональный кластер (HA); private nodes + публичный endpoint мастера для kubectl с рабочей станции.
stack_label = "cs-sandbox"

compute_api = gcp.projects.Service(
    "compute_api",
    project=project_id,
    service="compute.googleapis.com",
    disable_on_destroy=False,
)
servicenetworking_api = gcp.projects.Service(
    "servicenetworking_api",
    project=project_id,
    service="servicenetworking.googleapis.com",
    disable_on_destroy=False,
)
container_api = gcp.projects.Service(
    "container_api",
    project=project_id,
    service="container.googleapis.com",
    disable_on_destroy=False,
)
sqladmin_api = gcp.projects.Service(
    "sqladmin_api",
    project=project_id,
    service="sqladmin.googleapis.com",
    disable_on_destroy=False,
)
storage_api = gcp.projects.Service(
    "storage_api",
    project=project_id,
    service="storage.googleapis.com",
    disable_on_destroy=False,
)
ar_api = gcp.projects.Service(
    "artifactregistry_api",
    project=project_id,
    service="artifactregistry.googleapis.com",
    disable_on_destroy=False,
)

network = gcp.compute.Network(
    "vpc",
    name=f"{stack_label}-vpc",
    auto_create_subnetworks=False,
    opts=pulumi.ResourceOptions(depends_on=[compute_api]),
)

subnet = gcp.compute.Subnetwork(
    "subnet",
    name=f"{stack_label}-subnet-{region}",
    ip_cidr_range="10.40.0.0/20",
    region=region,
    network=network.id,
    private_ip_google_access=True,
    secondary_ip_ranges=[
        gcp.compute.SubnetworkSecondaryIpRangeArgs(
            range_name="pods", ip_cidr_range="10.41.0.0/16"
        ),
        gcp.compute.SubnetworkSecondaryIpRangeArgs(
            range_name="services", ip_cidr_range="10.44.0.0/20"
        ),
    ],
    opts=pulumi.ResourceOptions(depends_on=[network]),
)

peering_range = gcp.compute.GlobalAddress(
    "psa_range",
    name=f"{stack_label}-psa",
    purpose="VPC_PEERING",
    address_type="INTERNAL",
    prefix_length=16,
    network=network.id,
    opts=pulumi.ResourceOptions(depends_on=[network]),
)

private_vpc_connection = gcp.servicenetworking.Connection(
    "private_vpc_connection",
    network=network.name,
    service="servicenetworking.googleapis.com",
    reserved_peering_ranges=[peering_range.name],
    opts=pulumi.ResourceOptions(depends_on=[peering_range, servicenetworking_api]),
)

suffix = random.RandomString(
    "suffix",
    length=4,
    lower=True,
    upper=False,
    numeric=True,
    special=False,
)

data_bucket = gcp.storage.Bucket(
    "data",
    name=pulumi.Output.concat(project_id, "-", stack_label, "-data-", suffix.result),
    location=region,
    uniform_bucket_level_access=True,
    versioning=gcp.storage.BucketVersioningArgs(enabled=True),
    opts=pulumi.ResourceOptions(depends_on=[storage_api]),
)

ar_repo = gcp.artifactregistry.Repository(
    "docker",
    repository_id=f"{stack_label}-docker",
    location=region,
    format="DOCKER",
    description="Sandbox images (credit-scoring)",
    opts=pulumi.ResourceOptions(depends_on=[ar_api]),
)

db = gcp.sql.DatabaseInstance(
    "postgres",
    name=pulumi.Output.concat(stack_label, "-pg-", suffix.result),
    database_version="POSTGRES_15",
    region=region,
    deletion_protection=False,
    settings=gcp.sql.DatabaseInstanceSettingsArgs(
        tier="db-f1-micro",
        ip_configuration=gcp.sql.DatabaseInstanceSettingsIpConfigurationArgs(
            ipv4_enabled=False,
            private_network=network.self_link,
        ),
    ),
    opts=pulumi.ResourceOptions(depends_on=[private_vpc_connection, sqladmin_api]),
)

cluster = gcp.container.Cluster(
    "gke",
    name=f"{stack_label}-cluster",
    location=region,
    remove_default_node_pool=True,
    initial_node_count=1,
    network=network.self_link,
    subnetwork=subnet.self_link,
    ip_allocation_policy=gcp.container.ClusterIpAllocationPolicyArgs(
        cluster_secondary_range_name="pods",
        services_secondary_range_name="services",
    ),
    private_cluster_config=gcp.container.ClusterPrivateClusterConfigArgs(
        enable_private_nodes=True,
        enable_private_endpoint=False,
        master_ipv4_cidr_block="172.20.0.0/28",
    ),
    workload_identity_config=gcp.container.ClusterWorkloadIdentityConfigArgs(
        workload_pool=f"{project_id}.svc.id.goog"
    ),
    opts=pulumi.ResourceOptions(depends_on=[container_api, subnet]),
)

gcp.container.NodePool(
    "primary",
    name="default",
    location=region,
    cluster=cluster.name,
    node_count=1,
    node_config=gcp.container.ClusterNodeConfigArgs(
        machine_type="e2-standard-4",
        oauth_scopes=[],
    ),
    opts=pulumi.ResourceOptions(depends_on=[cluster]),
)

pulumi.export("gcp_project", project_id)
pulumi.export("gcp_region", region)
pulumi.export(
    "connect_cmd",
    pulumi.Output.concat(
        "gcloud container clusters get-credentials ",
        cluster.name,
        " --region ",
        region,
        " --project ",
        project_id,
    ),
)
pulumi.export("bucket_url", data_bucket.url)
pulumi.export("artifact_registry_url", pulumi.Output.concat(region, "-docker.pkg.dev/", project_id, "/", ar_repo.repository_id))
pulumi.export("cloud_sql_private_ip", db.private_ip_address)
pulumi.export("cloud_sql_connection_name", db.connection_name)
