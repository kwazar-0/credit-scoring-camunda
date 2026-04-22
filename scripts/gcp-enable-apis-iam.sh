#!/usr/bin/env bash
# Enable GCP Service Management APIs + IAM-related APIs for this repo's stack
# (Pulumi: GCS, BigQuery, Vertex, Artifact Registry, WIF, future GKE/SQL).
#
# Usage:
#   ./scripts/gcp-enable-apis-iam.sh <PROJECT_ID>
#   GCP_PROJECT_ID=my-project ./scripts/gcp-enable-apis-iam.sh
#
# After APIs are enabled, grant roles to *Google Groups* or *service accounts*
# (not personal accounts in production) — see print_iam_hint below.
#
# Region for workloads defaults to europe-central2 (see .cursorrules / doc/prompt.md).

set -euo pipefail

print_iam_hint() {
  cat <<'HINT'
---
IAM next steps (run manually; use Google Groups, not user emails, in production):

  # Example: group of platform engineers — viewer on project (adjust role)
  gcloud projects add-iam-policy-binding PROJECT_ID \
    --member="group:platform@your-domain.com" \
    --role="roles/viewer"

  # Service account for CI (after Pulumi or gcloud creates the SA) — object viewer on a bucket
  gcloud storage buckets add-iam-policy-binding gs://BUCKET \
    --member="serviceAccount:my-ci@PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/storage.objectViewer"

  # List project IAM
  gcloud projects get-iam-policy PROJECT_ID --format=json

  # Prefer: bind roles in Pulumi (gcp.projects.IAM*) or Config Connector / Terraform, SoT in git.
HINT
}

PROJECT_ID="${1:-${GCP_PROJECT_ID:-}}"
if [[ -z "${PROJECT_ID}" ]]; then
  echo "Usage: $0 <GCP_PROJECT_ID>" >&2
  exit 1
fi

echo "Setting active project: ${PROJECT_ID}"
gcloud config set project "${PROJECT_ID}"

# One batch — fewer round trips than separate enables.
# Aligned with infra/pulumi/__main__.py + workload_identity_github.py + prompt.md §9.2.1
APIS=(
  # IAM & admin (required for gcloud to manage IAM, folders, and WIF/STS)
  cloudresourcemanager.googleapis.com
  iam.googleapis.com
  iamcredentials.googleapis.com
  sts.googleapis.com
  serviceusage.googleapis.com
  servicemanagement.googleapis.com
  # Pulumi stack: storage, BQ, Vertex, GAR, WIF
  aiplatform.googleapis.com
  bigquery.googleapis.com
  storage.googleapis.com
  artifactregistry.googleapis.com
  # Cloud SQL, GKE, VPC peering (private services)
  sqladmin.googleapis.com
  container.googleapis.com
  compute.googleapis.com
  servicenetworking.googleapis.com
  # Secrets and observability
  secretmanager.googleapis.com
  logging.googleapis.com
  monitoring.googleapis.com
)

echo "Enabling ${#APIS[@]} APIs (this may take 1–2 minutes)…"
gcloud services enable "${APIS[@]}" --project="${PROJECT_ID}"

echo
echo "Done. Verify:"
echo "  gcloud services list --enabled --project=${PROJECT_ID} | head -30"
echo
print_iam_hint
