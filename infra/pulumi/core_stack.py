"""
infra-core stack: IAM (GitHub WIF) + VPC, subnet, Private Service Access (Cloud SQL).
Region default: europe-central2 (per project .cursorrules).
"""

from __future__ import annotations

import pulumi
import pulumi_gcp as gcp

from provider_util import gcp_provider_args
from workload_identity_github import provision as provision_github_wif


def provision() -> None:
    gcp_cfg = pulumi.Config("gcp")
    project_id = gcp_cfg.require("project")
    cfg = pulumi.Config("credit-scoring")
    region = cfg.get("region") or "europe-central2"
    vpc_name = cfg.get("networkName") or "hbg-core-vpc"
    subnet_cidr = cfg.get("coreSubnetCidr") or "10.10.0.0/20"
    pods_cidr = cfg.get("gkePodsCidr") or "10.20.0.0/16"
    services_cidr = cfg.get("gkeServicesCidr") or "10.32.0.0/20"
    psa_prefix_len = int(cfg.get("privateServiceConnectPrefixLength") or "16")

    provider = gcp.Provider("gcp", **gcp_provider_args(project_id, region))

    compute_api = gcp.projects.Service(
        "compute_api",
        project=project_id,
        service="compute.googleapis.com",
        disable_on_destroy=False,
        opts=pulumi.ResourceOptions(provider=provider),
    )
    sn_api = gcp.projects.Service(
        "servicenetworking_api",
        project=project_id,
        service="servicenetworking.googleapis.com",
        disable_on_destroy=False,
        opts=pulumi.ResourceOptions(provider=provider),
    )

    network = gcp.compute.Network(
        "core_vpc",
        name=vpc_name,
        auto_create_subnetworks=False,
        opts=pulumi.ResourceOptions(provider=provider, depends_on=[compute_api]),
    )

    subnetwork = gcp.compute.Subnetwork(
        "core_subnet",
        name=f"{vpc_name}-subnet-{region}",
        ip_cidr_range=subnet_cidr,
        region=region,
        network=network.id,
        secondary_ip_ranges=[
            gcp.compute.SubnetworkSecondaryIpRangeArgs(
                range_name="gke-pods",
                ip_cidr_range=pods_cidr,
            ),
            gcp.compute.SubnetworkSecondaryIpRangeArgs(
                range_name="gke-services",
                ip_cidr_range=services_cidr,
            ),
        ],
        private_ip_google_access=True,
        opts=pulumi.ResourceOptions(provider=provider, depends_on=[network]),
    )

    peering_range = gcp.compute.GlobalAddress(
        "psa_range",
        name=f"{vpc_name}-psa",
        purpose="VPC_PEERING",
        address_type="INTERNAL",
        prefix_length=psa_prefix_len,
        network=network.id,
        opts=pulumi.ResourceOptions(provider=provider, depends_on=[network]),
    )

    gcp.servicenetworking.Connection(
        "private_vpc_connection",
        network=network.name,
        service="servicenetworking.googleapis.com",
        reserved_peering_ranges=[peering_range.name],
        opts=pulumi.ResourceOptions(provider=provider, depends_on=[peering_range, sn_api]),
    )

    pulumi.export("gcp_project", project_id)
    pulumi.export("gcp_region", region)
    pulumi.export("network_name", network.name)
    pulumi.export("network_self_link", network.self_link)
    pulumi.export("subnetwork_name", subnetwork.name)
    pulumi.export("subnetwork_self_link", subnetwork.self_link)
    pulumi.export("gke_pods_range_name", "gke-pods")
    pulumi.export("gke_services_range_name", "gke-services")
    pulumi.export("stack_role", "infra-core")

    provision_github_wif(provider=provider, project_id=project_id, region=region)
