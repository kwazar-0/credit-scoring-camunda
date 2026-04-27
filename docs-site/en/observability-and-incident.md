# Observability and Incident Response

## Logging

- Structured logs in Cloud Logging.
- Correlation IDs propagated across API, Camunda, and worker services.
- Log-based metrics for workflow failures and retries.

## Metrics and Alerting

- Golden signals: latency, traffic, error rate, saturation.
- Camunda metrics: incidents, active jobs, retry backlog, throughput.
- Alert thresholds are tied to service objectives and severity levels.

## Incident Flow

1. Alert triggers and routes on-call ownership.
2. Runbook-driven triage and containment.
3. Rollback or mitigation decision based on impact and SLO.
4. Post-incident review and corrective actions.
