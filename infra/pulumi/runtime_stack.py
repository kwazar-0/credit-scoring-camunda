"""
infra-runtime stack: GKE (Workload Identity, narrow node OAuth) + Artifact Registry.
Expects a Pulumi stack reference to infra-core for VPC-native networking.
"""

from __future__ import annotations

import pulumi
import pulumi_gcp as gcp

from policy import reject_cloud_platform_oauth_scopes
from provider_util import gcp_provider_args
from vertex_gcp import provision as provision_vertex


def provision() -> None:
    gcp_cfg = pulumi.Config("gcp")
    project_id = gcp_cfg.require("project")
    cfg = pulumi.Config("credit-scoring")
    region = cfg.get("region") or "europe-central2"
    cluster_name = cfg.get("clusterName") or "hbg-gke"
    core_ref_name = cfg.require("coreStackRef")
    node_count = int(cfg.get("gkeNodeCount") or "1")
    machine_type = cfg.get("gkeMachineType") or "e2-standard-4"
    master_cidr = cfg.get("gkeMasterIpv4Cidr") or "172.16.0.0/28"
    min_nodes = int(cfg.get("gkeMinNodes") or "1")
    max_nodes = int(cfg.get("gkeMaxNodes") or "3")
    node_disk_gb = int(cfg.get("gkeNodeDiskGb") or "25")
    node_disk_type = cfg.get("gkeNodeDiskType") or "pd-standard"
    use_autoscaling = cfg.get_bool("gkeAutoscaling")
    if use_autoscaling is None:
        use_autoscaling = True

    ref = pulumi.StackReference("core_stack", core_ref_name)
    network = ref.require_output("network_self_link")
    subnetwork = ref.require_output("subnetwork_self_link")
    pods = ref.require_output("gke_pods_range_name")
    svcs = ref.require_output("gke_services_range_name")

    provider = gcp.Provider("gcp", **gcp_provider_args(project_id, region))

    container_api = gcp.projects.Service(
        "container_api",
        project=project_id,
        service="container.googleapis.com",
        disable_on_destroy=False,
        opts=pulumi.ResourceOptions(provider=provider),
    )
    ar_api = gcp.projects.Service(
        "artifactregistry_api",
        project=project_id,
        service="artifactregistry.googleapis.com",
        disable_on_destroy=False,
        opts=pulumi.ResourceOptions(provider=provider),
    )

    repo_id = cluster_name.replace("_", "-") + "-docker"
    repo = gcp.artifactregistry.Repository(
        "app",
        repository_id=repo_id,
        location=region,
        format="DOCKER",
        description="backend, worker, ui",
        opts=pulumi.ResourceOptions(provider=provider, depends_on=[ar_api]),
    )

    scopes: list[str] = []
    reject_cloud_platform_oauth_scopes(scopes)

    def _node_config() -> gcp.container.ClusterNodeConfigArgs:
        return gcp.container.ClusterNodeConfigArgs(
            machine_type=machine_type,
            disk_size_gb=node_disk_gb,
            disk_type=node_disk_type,
            oauth_scopes=scopes,
        )

    cluster = gcp.container.Cluster(
        "primary",
        name=cluster_name,
        location=region,
        deletion_protection=False,
        remove_default_node_pool=True,
        initial_node_count=1,
        network=network,
        subnetwork=subnetwork,
        # Default pool exists briefly before removal; same disks as real pool (GKE defaults hit SSD quota).
        node_config=_node_config(),
        private_cluster_config=gcp.container.ClusterPrivateClusterConfigArgs(
            enable_private_nodes=True,
            enable_private_endpoint=False,
            master_ipv4_cidr_block=master_cidr,
        ),
        ip_allocation_policy=gcp.container.ClusterIpAllocationPolicyArgs(
            cluster_secondary_range_name=pods,
            services_secondary_range_name=svcs,
        ),
        workload_identity_config=gcp.container.ClusterWorkloadIdentityConfigArgs(
            workload_pool=f"{project_id}.svc.id.goog"
        ),
        opts=pulumi.ResourceOptions(provider=provider, depends_on=[container_api]),
    )

    if use_autoscaling:
        gcp.container.NodePool(
            "default_pool",
            name="default",
            location=region,
            cluster=cluster.name,
            autoscaling=gcp.container.NodePoolAutoscalingArgs(
                min_node_count=min_nodes,
                max_node_count=max_nodes,
            ),
            node_config=_node_config(),
            opts=pulumi.ResourceOptions(provider=provider, depends_on=[cluster]),
        )
    else:
        gcp.container.NodePool(
            "default_pool",
            name="default",
            location=region,
            cluster=cluster.name,
            node_count=node_count,
            node_config=_node_config(),
            opts=pulumi.ResourceOptions(provider=provider, depends_on=[cluster]),
        )

    pulumi.export("gcp_project", project_id)
    pulumi.export("gcp_region", region)
    pulumi.export("cluster_name", cluster_name)
    pulumi.export("gke_node_disk_gb", node_disk_gb)
    pulumi.export("gke_node_disk_type", node_disk_type)
    pulumi.export("cluster_endpoint", cluster.endpoint)
    pulumi.export("artifact_repository_id", repo_id)
    pulumi.export("artifact_registry_url", pulumi.Output.concat(region, "-docker.pkg.dev/", project_id, "/", repo_id))
    pulumi.export("stack_role", "infra-runtime")
    pulumi.export(
        "gcloud_get_credentials",
        pulumi.Output.concat(
            "gcloud container clusters get-credentials ",
            cluster.name,
            " --region ",
            region,
            " --project ",
            project_id,
        ),
    )
    pulumi.export(
        "kubectl_port_forward_hint",
        "kubectl -n hbg port-forward svc/credit-backend 8000:8000 & "
        "kubectl -n hbg port-forward svc/credit-ui 8501:8501",
    )

    provision_vertex(provider, project_id)
