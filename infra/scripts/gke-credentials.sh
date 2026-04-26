#!/usr/bin/env bash
# Fetch kubeconfig for the GKE cluster (Standard, regional cluster in europe-central2 by default).
# Usage:
#   GCP_PROJECT=my-project ./infra/scripts/gke-credentials.sh
#   ./infra/scripts/gke-credentials.sh my-project [cluster-name] [region]
set -euo pipefail
PROJECT="${GCP_PROJECT:-${1:-}}"
CLUSTER="${GKE_CLUSTER:-${2:-hbg-gke}}"
REGION="${GKE_REGION:-${3:-europe-central2}}"
if [[ -z "$PROJECT" ]]; then
  echo "Set GCP_PROJECT or pass project id: $0 <project> [cluster] [region]" >&2
  echo "Defaults: cluster=hbg-gke region=europe-central2" >&2
  exit 1
fi
exec gcloud container clusters get-credentials "$CLUSTER" --region "$REGION" --project "$PROJECT"
