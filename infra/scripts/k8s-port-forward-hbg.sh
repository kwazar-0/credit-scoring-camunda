#!/usr/bin/env bash
# Port-forward HBG app services from k8s/hbg (after workloads are deployed).
#   ./infra/scripts/gke-credentials.sh "$GCP_PROJECT"   # once per kubeconfig refresh
#   ./infra/scripts/k8s-port-forward-hbg.sh
# Backend: http://127.0.0.1:8000/docs  UI: http://127.0.0.1:8501
set -euo pipefail
NS="${K8S_NAMESPACE:-hbg}"
kubectl -n "$NS" port-forward svc/credit-backend 8000:8000 &
kubectl -n "$NS" port-forward svc/credit-ui 8501:8501 &
echo "Port-forward: credit-backend -> :8000, credit-ui -> :8501 (namespace=$NS). Ctrl+C stops both."
wait
