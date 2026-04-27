# CI/CD Pipeline

## Etapy

1. Build i package.
2. Testy i quality checks.
3. Security scanning.
4. Publikacja niezmiennego artefaktu.
5. Wdrożenie zgodnie z promotion flow.

## Promotion

- `dev`: automatycznie po merge.
- `stage`: approval gate + testy integracyjne.
- `prod`: podwójna akceptacja + kontrolowany rollout.
