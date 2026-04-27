# Operations: Incidents and Recovery

## Typowe scenariusze awarii

- Nieudany rollout po wdrozeniu.
- Wzrost backlog/retry storm workerow.
- Skok incydentow Camunda dla process tasks.
- Degradacja runtime GKE (node pressure, restarts).

## Przeplyw reakcji

1. Klasyfikacja severity.
2. Triage i containment wg runbooka.
3. Decyzja mitigation vs rollback.
4. Odtworzenie uslugi i walidacja sciezki krytycznej.
5. Zapis dzialan post-incident.

## Zasada recovery

Szybki powrot do last stable release z pelnym audit trail.

## Navigation

- Entry page: [main](/pl/main)
- Deployment: [ops/deployment](/pl/ops/deployment)
- CI/CD: [ops/cicd](/pl/ops/cicd)
- Observability: [ops/observability](/pl/ops/observability)
