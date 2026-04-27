# Operations: Deployment

## End-to-end model wdrozenia

1. Pulumi stosuje stacki infra po kolei: `core` -> `data` -> `runtime`.
2. Workloady na GKE sa wdrazane z immutable image digest i versioned manifests/charts.
3. Camunda jest aktualizowana razem z wersja BPMN/DMN.
4. Po wdrozeniu uruchamiane sa health-check i workflow smoke tests.

## Promotion

- `dev`: automatycznie po CI.
- `stage`: approval gate + testy integracyjne.
- `prod`: approval + kontrolowany rollout + runtime checks.

## Rollback

- App rollback: powrot do poprzedniego stabilnego digest.
- Camunda rollback: powrot do ostatniej zatwierdzonej wersji BPMN/DMN.
- Infra rollback/fix: kontrolowana korekta przez Pulumi.

## Navigation

- Camunda na GKE + Ubuntu Modeler: [camunda-gke-deploy-modeler](/pl/camunda-gke-deploy-modeler)
- Entry page: [main](/pl/main)
- CI/CD controls: [ops/cicd](/pl/ops/cicd)
- Observability: [ops/observability](/pl/ops/observability)
- Incidents: [ops/incidents](/pl/ops/incidents)
