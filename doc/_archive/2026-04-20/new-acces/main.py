import pulumi
import pulumi_gcp as gcp
import pulumi_kubernetes as k8s
import yaml

# Load the Digital Code of Conduct
with open("access_matrix.yaml", "r") as f:
    matrix = yaml.safe_load(f)

project = matrix['project_id']
region = matrix['region']

# 1. Create Storage Buckets for the 11-Stage Workflow
for env in ["dev", "ref", "prod"]:
    bucket = gcp.storage.Bucket(f"hbg-data-{env}",
        location=region,
        uniform_bucket_level_access=True)

# 2. Distribute Sovereign Rights (GCP IAM)
for agent in matrix['agents']:
    for role in agent['gcp_roles']:
        gcp.projects.IAMMember(f"iam-{agent['id']}-{role.replace('.', '-')}",
            project=project,
            role=role,
            member=f"user:{agent['email']}")

# 3. K8s RBAC: Enforcing the 6-Agent Hierarchy
for agent in matrix['agents']:
    for env in ["dev", "stage", "prod"]:
        ns = f"camunda-{env}"
        k8s.rbac.v1.RoleBinding(f"rb-{agent['id']}-{env}",
            metadata={"namespace": ns},
            role_ref=k8s.rbac.v1.RoleBindingRoleRefArgs(
                api_group="rbac.authorization.k8s.io",
                kind="ClusterRole",
                name=agent['k8s_access']
            ),
            subjects=[k8s.rbac.v1.RoleBindingSubjectArgs(
                kind="User",
                name=agent['email']
            )])

pulumi.export("system_status", "DOMINANCE_ESTABLISHED")
