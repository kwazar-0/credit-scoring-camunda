"""
Vertex AI API + GSA (Gemini) + GSA (Cloud SQL client) and Workload Identity bindings from config.
Binds: credit-scoring:vertexWorkloadIdentities, credit-scoring:cloudSqlWorkloadIdentities
Format per entry: "namespace:ksa" (comma-separated), e.g. hbg:backend-ksa,camunda-dev:operate
"""

from __future__ import annotations

import pulumi
import pulumi_gcp as gcp


def _parse_bindings(raw: str | None) -> list[tuple[str, str]]:
    if not raw or not str(raw).strip():
        return []
    out: list[tuple[str, str]] = []
    for part in str(raw).split(","):
        s = part.strip()
        if not s:
            continue
        if ":" not in s:
            raise ValueError(
                f"Invalid workload identity binding {s!r}. Use a single `:` to separate k8s namespace:serviceaccount"
            )
        ns, ksa = s.split(":", 1)
        ns, ksa = ns.strip(), ksa.strip()
        if not ns or not ksa:
            raise ValueError(f"Empty namespace or KSA in {s!r}")
        out.append((ns, ksa))
    return out


def _wi_member(project_id: str, ns: str, ksa: str) -> str:
    return f"serviceAccount:{project_id}.svc.id.goog[{ns}/{ksa}]"


def provision(
    provider: gcp.Provider,
    project_id: str,
) -> None:
    cfg = pulumi.Config("credit-scoring")
    aiplatform_api = gcp.projects.Service(
        "aiplatform_api_runtime",
        project=project_id,
        service="aiplatform.googleapis.com",
        disable_on_destroy=False,
        opts=pulumi.ResourceOptions(provider=provider),
    )

    vertex_sa = gcp.serviceaccount.Account(
        "hbg_vertex_llm",
        account_id="hbg-vertex-llm",
        display_name="HBG (Vertex AI / Gemini via Workload Identity)",
        project=project_id,
        opts=pulumi.ResourceOptions(provider=provider, depends_on=[aiplatform_api]),
    )
    csql_sa = gcp.serviceaccount.Account(
        "hbg_camunda_csql",
        account_id="hbg-camunda-csql",
        display_name="HBG (Cloud SQL private IP client for Camunda / proxy sidecar)",
        project=project_id,
    )

    gcp.project.IAMMember(
        "vertex_sa_aiplatform_user",
        project=project_id,
        role="roles/aiplatform.user",
        member=pulumi.Output.concat("serviceAccount:", vertex_sa.email),
        opts=pulumi.ResourceOptions(provider=provider, depends_on=[vertex_sa]),
    )
    gcp.project.IAMMember(
        "csql_sa_client",
        project=project_id,
        role="roles/cloudsql.client",
        member=pulumi.Output.concat("serviceAccount:", csql_sa.email),
        opts=pulumi.ResourceOptions(provider=provider, depends_on=[csql_sa]),
    )

    for i, (ns, ksa) in enumerate(_parse_bindings(cfg.get("vertexWorkloadIdentities"))):
        m = _wi_member(project_id, ns, ksa)
        gcp.serviceaccount.IAMMember(
            f"vertex_wi_{i}",
            service_account_id=vertex_sa.name,
            role="roles/iam.workloadIdentityUser",
            member=m,
            opts=pulumi.ResourceOptions(provider=provider, depends_on=[vertex_sa]),
        )

    for i, (ns, ksa) in enumerate(_parse_bindings(cfg.get("cloudSqlWorkloadIdentities"))):
        m = _wi_member(project_id, ns, ksa)
        gcp.serviceaccount.IAMMember(
            f"csql_wi_{i}",
            service_account_id=csql_sa.name,
            role="roles/iam.workloadIdentityUser",
            member=m,
            opts=pulumi.ResourceOptions(provider=provider, depends_on=[csql_sa]),
        )

    pulumi.export("vertex_gcp_service_account", vertex_sa.email)
    pulumi.export("cloudsql_gcp_service_account", csql_sa.email)
