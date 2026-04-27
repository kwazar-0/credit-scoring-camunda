# Polished matrix: 11 roles vs GCP services and 6 accounts

Aligned with [system-philosophy-governance.md](system-philosophy-governance.md) and IAM layers for Vertex, BigQuery, GCS, Vector Search, Cloud SQL, and IaC. Default region: **`europe-central2`**.

**Team organisation (concept + six personas, full SDLC):** [team-11x6-organization](/en/team-11x6-organization).

## 1. Can you have “11 roles” with “6 people”?

Yes. **11** are *logical* roles. **6** are *people* (Google accounts / group membership). Each account **carries a bundle** of roles; roles **UAT** and **App** usually have **no** GCP console; **BG** (break-glass) is **event**-based, not a standing profile.

In **prod** (see [system-philosophy-governance.md](system-philosophy-governance.md) for hardening posture) prefer **Google Groups** for IAM/RBAC, not 11 `roles/*` on one person. This document is a **polished** “what a role can do in GCP”; implement via **groups** with the same meaning.

## 2. 11 roles × key GCP “layers” (SaaS cloud)

Columns are common **domains** (not an exhaustive API list; details = custom IAM + org policy).

| Slot | Role | Resource Manager / IAM | GKE | Storage (GCS) | BigQuery | Vertex / Vertex AI Search | SecOps / logging | Artifacts (GAR) | Note |
|------|------|------------------------|-----|---------------|----------|----------------------------|------------------|-----------------|------|
| **Platform** | devops / sre / cloud-eng | admin bind groups/SA, folders | admin / platform SA | bucket/label design | datasets, wiring | read/approve, not DS | org-level logs, sinks | read/push per env | Pulumi, state, CI OIDC |
| **Dev** | dev-developer | **no** project Owner/Editor in prod (often 0) | **dev** NS per policy | read/write **dev** prefixes | dev datasets | **dev** endpoints | **dev** logs | pull/push **dev** | App code, not platform |
| **Tst-dev** | dev-tester | usually 0 | view **dev** (or 0) | list/read test data | read jobs **dev** | 0 / read-only portals | 0 / read **dev** | read | Via UI/CI, not Pulumi |
| **Tst-ref** | ref-tester | 0 / staging viewer | view or edit **ref** NS | read **ref** | read **ref** | read **ref** inference | read **ref** | read **ref** | Regression, not prod |
| **UAT** | prod-tester (UAT) | 0 | **no** kubectl prod | 0 (data via app) | usually 0; aggregates if allowed | 0 (app UI) | 0 / audit UI only | 0 | **Camunda / Streamlit** in prod only |
| **App** | prod-user | 0 | 0 | 0 | 0 | 0 | 0 | 0 | **Tasklist / app (SSO) only** |
| **Sec** | security / compliance | security reviewer / org policy read | view **all** NS | metadata / policy | policy tags / audit | 0 / metadata | **audit logs**, sinks | read metadata | OPA/Gatekeeper — change in Git |
| **BG** | break-glass | **temporary** PAM / elevation | **temporary** elevated | per runbook | per runbook | per runbook | per runbook | per runbook | Ticket/window only, revoke after |
| **Release** | release-manager | read versions/artifacts | 0 (or view) | 0 | 0 | 0 | 0 / release reports | 0 / read tags | **Approve** GHE `production` — main gate |
| **Data** | data-engineer | 0 / narrow SA align | 0 | object admin **data** buckets | data editor + jobUser | 0 if not ML | 0 | 0 | Ingest, no GKE admin |
| **ML** | ML engineer | 0 / narrow | 0 / optional dev | read/write embeddings | as needed | **aiplatform** + vector/index **dev** → promoted by CI | 0 | read | No `container.admin` in prod (see `ROLES.md`) |

*“0”* = no direct console access; **not** “zero” for business (there is still Camunda, UI, etc.).

## 3. Same 11 roles mapped to 6 accounts (example)

One row = one person. **•** = primary **logical** role; **○** = shared; **on-call** under **BG** = role **8** on event. Real **prod IAM** binds to a **group**.

| Account (login · label) | Platform | Dev | Tst-dev | Tst-ref | UAT | App | Sec | BG | Release | Data | ML |
|-------------------------|:-:|:-:|:-:|:-:|:-:|:-:|:--:|:-:|:-:|:--:|:--:|
| **ok-admin** · **ADMIN** | • | | | | | | | | ○ | | |
| **gw-devops** · **DEVOPS** | • | | | | | | ○ | **on-call** | ○ | | |
| **ux-dev** · **DEV-UX** | | • | | | | | | | • | ○ | • |
| **sh-dev** · **DEV-SH** | | ○ | | | | | | | | • | • |
| **pk-qa** · **QA-TEST** | | | • | • | | | | | | | |
| **ok-audit** · **AUDIT** | | | | | | | • | | | | |

- **UAT** and **App** are empty: no GCP console path (access via product).
- Example logins and **U1–U6** in [`github-codeowners-matrix.md`](github-codeowners-matrix.md).

## 4. Four “GitHub Teams” (aligned with [git-workflow.md](git-workflow.md))

| Team (example) | Logical role slots |
|----------------|-------------------|
| `platform` | Platform, part Sec, BG, part Release, CI engineering |
| `engineers` | Dev, Data, ML |
| `quality` | Tst-dev, Tst-ref, Release |
| `compliance` | Sec, optional release audit (SoD) |

`Business` (prod) — **not** in Git repo; `Incident` (break-glass) — **process**, not a standing role.

## 5. Audit

- Do not merge **Release** and **Sec** on one person if SoD requires split.
- Hardening §9.6: prefer **custom roles** + **dev / ref / prod** split.

## 6. Related

- [`github-codeowners-matrix.md`](github-codeowners-matrix.md)
- K8s RBAC example in repo: `infra/ROLES.gke-rbac.local.md`
