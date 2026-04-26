#!/usr/bin/env bash
# Run Docker Compose with debug-friendly env (LOG_LEVEL=DEBUG, unbuffered Python).
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
exec docker compose -f docker-compose.yml -f infra/docker-compose.debug.yml "$@"
