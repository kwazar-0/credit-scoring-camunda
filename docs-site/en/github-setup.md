# GitHub setup & governance: Handlowy Bank Galicyjski (HBG) enterprise

This document describes the technical pattern for 11 **logical roles** and access workflows in the **Handlowy Bank Galicyjski (HBG)** repository (branches and legacy: **[branch-notes.md](branch-notes.md)**).

**Placeholders:** replace every `@org/...` with a real **GitHub Organization** name (e.g. `@HBG-Org/platform-admin`).

**Branches:** **`main`** — production (and **default branch** on GitHub); **`develop`** — integration. Git flow: **[git-workflow.md](git-workflow.md)**.

## 1. Team structure

Instead of per-user rights, we use **teams**; a person can belong to several.

| GitHub Team | Roles (from `ROLES.md`) | Repo access |
| :---------- | :---------------------- | :---------- |
| **`@org/platform-admin`** | DevOps, SRE, cloud-eng, security | **Admin** |
| **`@org/engineers`** | Dev-developer, ML engineer, data engineer | **Write** |
| **`@org/quality-gate`** | Dev-tester, ref-tester, prod-tester, release manager | **Read** (write under `/tests` if you adopt that policy) |
| **`@org/compliance`** | Security / compliance (auditors) | **Read** |

---

## 2. Branch protection & rulesets

### Branch: `main` (production)
* **Require a pull request before merging:** on.
* **Required approvals:** at least 2 (one from `@org/platform-admin`, one from `@org/quality-gate`).
* **Code owners:** required path owners (see §3).
* **Restrict pushes:** automation only (CI/CD bot), except as policy allows.

### Branch: `develop` (integration)
* **Require a pull request before merging:** on.
* **Required approvals:** 1 (any `@org/engineers` or `@org/platform-admin`).
* **Status checks:** CI and linters must pass.

---

## 3. CODEOWNERS

`.github/CODEOWNERS` pins ownership zones and discourages “silent” edits.

```text
# Infra and security (IaC)
/infra/                @org/platform-admin

# Data and ML
/data/                 @org/engineers
/backend/              @org/engineers @org/quality-gate
```

Map paths to your real tree (`bpmn/`, `backend/`, `docs-site/`, etc.) and extend when new top-level folders appear.

---

## 4. Environments

Configure in *Settings → Environments*. Each environment has its secrets (GCP) and approval rules.

### **Environment: `development`**
* **Deployment branch:** `develop`.
* **Reviewers:** none (auto-deploy after merge, if you use that).
* **Roles:** `dev-developer`, `dev-tester` as per policy.

### **Environment: `reference` (staging)**
* **Deployment branch:** `release/*`, `develop`.
* **Reviewers:** `@org/quality-gate` (role: ref-tester).
* **Purpose:** regression before production.

### **Environment: `production`**
* **Deployment branch:** `main`.
* **Required reviewers:** one from `@org/quality-gate` (release manager) and one from `@org/platform-admin` (SRE), per your SoD.
* **Wait timer:** optional 15 minutes (safety window).

---

## 5. Incidents (break-glass)
When a critical incident makes the normal PR path too slow:
1. **SRE** uses a time-bound token (e.g. GCP PAM).
2. GitHub may use a controlled **emergency override** (admin-only) to merge.
3. **Security / compliance** run post-incident log review on the ticket.

---

## 6. CI/CD (GitHub Actions)
* Secrets such as `secrets.GCP_SA_DEV` are only exposed to the `development` environment.
* `secrets.GCP_SA_PROD` is limited to `production` and required reviewers.

---

**Summary:** 11 logical roles map to four teams and three **environments** as gates. You always know who wrote the code (`engineers`), who reviewed it (`quality`), and who allowed production rollout (`platform`).
