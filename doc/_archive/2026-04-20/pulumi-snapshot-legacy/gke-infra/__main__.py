import pulumi
from pulumi_gcp import container, artifactregistry, storage, sql

# Конфигурация
config_name = "credit-scoring"
config_zone = "europe-central2-a"
config_region = "europe-central2"

# 1. ARTIFACT REGISTRY (Docker образы)
repo = artifactregistry.Repository("ai-repo",
    location=config_region,
    repository_id=f"{config_name}-repo",
    format="DOCKER")

# 2. CLOUD STORAGE (Данные для ML/Vertex)
data_bucket = storage.Bucket("data-bucket",
    name=f"{config_name}-app-data",
    location=config_region,
    force_destroy=True)

# 3. CLOUD SQL (PostgreSQL для метаданных)
# deletion_protection: newer GCP provider defaults to True — must be False for pulumi destroy.
db_instance = sql.DatabaseInstance("postgres-instance",
    database_version="POSTGRES_15",
    region=config_region,
    deletion_protection=False,
    settings=sql.DatabaseInstanceSettingsArgs(
        tier="db-f1-micro", # Для тестов; для серьезного RAG берите db-g1-small
        ip_configuration=sql.DatabaseInstanceSettingsIpConfigurationArgs(
            ipv4_enabled=True,
        ),
    ))

# 4. GKE CLUSTER (Мощные ноды для Camunda + AI)
cluster = container.Cluster("gke-cluster",
    name=f"{config_name}-cluster",
    location=config_zone,
    remove_default_node_pool=True,
    initial_node_count=1,
    deletion_protection=False)

nodes = container.NodePool("primary-nodes",
    cluster=cluster.name,
    location=config_zone,
    node_count=4,
    node_config=container.ClusterNodeConfigArgs(
        machine_type="e2-standard-4", # 16 vCPU / 64GB RAM итого
        disk_size_gb=25, # Экономим квоту SSD
        oauth_scopes=["https://www.googleapis.com/auth/cloud-platform"]))

# --- ЭКСПОРТЫ ---
pulumi.export("connect_cmd", f"gcloud container clusters get-credentials {config_name}-cluster --zone {config_zone}")
pulumi.export("db_ip", db_instance.first_ip_address)
pulumi.export("bucket_name", data_bucket.url)