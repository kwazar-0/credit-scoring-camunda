# CODEOWNERS: 11 roles and 6 GitHub accounts

This doc maps **logical roles** (see [gcp-saas-access-matrix-11x6.md](gcp-saas-access-matrix-11x6.md) and [prompt.md](prompt.md) §9) to **six GitHub users** in [`.github/CODEOWNERS`](https://github.com/OlehKondratow/credit-scoring-camunda/blob/develop/.github/CODEOWNERS) reviews.

Example fork: [kwazar-0/credit-scoring-camunda](https://github.com/kwazar-0/credit-scoring-camunda). Logins must match real `@username` values; if you rename, update this file and `CODEOWNERS`.

### How 11 roles fit into 6 accounts

A **role** in `ROLES.md` is a *function and access boundary* (for audit and policy). An **account** is a person in IdP/GitHub/GCP. You do **not** need 11 logins: one person can **combine** several roles if that does not break *separation of duties* in your bank.

| Roles that **do not** need a dedicated git account | Why |
|-----------------------------------|-----|
| **5 — prod-tester** | Work via UI (Tasklist, Streamlit), test data; not code review. |
| **6 — prod-user** | Product only; no repo access. |
| **8 — break-glass** | Not a standing login: time-bound elevation (often same as **1 — devops/sre** on call). |

The other **8 roles** (1–4, 7, 9–11) are spread across **six people** — reverse matrix: *one account → which roles it covers* (example; replace with your names/duties).

| Account | Which of the 11 roles (example) |
|---------|----------------------------------|
| **U1** `@kwazar-0` | **1** devops/sre, part of **7** (with U4), **8** on-call, part of **9** (release with U2) |
| **U2** `@OlehKondratow` | **2** dev-developer, **11** ML, part of **9** release, part of **10** data (with U5) |
| **U3** `@tempb59-commits` | **3** dev-tester, **4** ref-tester |
| **U4** `@geraltwilkbialy-cloud` | **7** security / compliance (policies) |
| **U5** `@olehkondracki-prog` | **10** data engineer, help on **2** and **11** in data area |
| **U6** `@tempb418-ux` | **1** co-platform (second voice on CI/infra with U1) |

If **release** and **security** must be *strictly* different (SOX, etc.), move **9** or **7** to someone else or add a seventh account — bank policy, not a Git limit.

## Six accounts (GitHub)

| # | GitHub | Typical focus in the role matrix |
|---|--------|-----------------------------------|
| U1 | `@kwazar-0` | Platform, fork owner, IaC incidents |
| U2 | `@OlehKondratow` | App dev, ML/RAG, release-related code |
| U3 | `@tempb59-commits` | QA (dev/ref), BPMN/DMN from testing |
| U4 | `@geraltwilkbialy-cloud` | Security / compliance |
| U5 | `@olehkondracki-prog` | Data / pipelines, dev support |
| U6 | `@tempb418-ux` | Co-platform: CI/CD, second voice on `infra` / `k8s` |

## 11 roles → which of the six own review

| # | Role (as in ROLES.md) | Primary review owners (GitHub) | Note |
|---|------------------------|----------------------------------|------|
| 1 | devops / sre / cloud-eng | U1, U6 | `infra/`, `k8s/`, root `Makefile`, `docker-compose` |
| 2 | dev-developer | U2, U5 | `backend/`, `worker/`, `ui/` |
| 3 | dev-tester | U3 | `bpmn/`, `dmn/`; CI with U3, U1, U6 |
| 4 | ref-tester | U3 | Same process areas; release branches [git-workflow.md](git-workflow.md) |
| 5 | prod-tester | — | No git paths: UAT in app |
| 6 | prod-user | — | No repo access |
| 7 | security / compliance | U4, U1 | `SECURITY.md`, root `*.md` (shared) |
| 8 | break-glass (incident) | U1 | Not routine CODEOWNER; runbook outside this file |
| 9 | release-manager | U2, U1 | tags `v*`, CI/Environment |
| 10 | data-engineer | U5, U2 | `data/` |
| 11 | ML engineer | U2, U5 | models/RAG next to `backend` and `data/` |

**Takeaway:** Git does not create 11 teams — six people cover review by path; roles 5–6 and 8 are not extra `CODEOWNERS` lines in the usual case.

## GitHub Teams (organization)

When you move to a **GitHub Organization**, switch `CODEOWNERS` to `@org/team-name` per [github-setup.md](github-setup.md); the role → team mapping remains in `ROLES.md`.
