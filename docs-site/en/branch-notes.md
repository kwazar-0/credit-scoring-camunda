# Branches: purpose and notes

Aligned with **[git-workflow.md](git-workflow.md)** and **[github-setup.md](github-setup.md)**. Templates `feature/*`, `hotfix/*`, `release/*` are created as work proceeds and are not required to exist on `origin` at all times.

---

## Long-lived branches

| Branch | Purpose | Notes |
|--------|---------|--------|
| **`main`** | **Production** — prod code; merge only via PR (see github-setup). | **Default branch** on GitHub; direct push disabled by policy; deploy to `production` environment. |
| **`develop`** | **Integration** — feature merges land here; dev envs often track this. | Not default; merge from `feature/*` / back from releases per git-workflow. |

---

## Short-lived (name templates)

| Template | Branched from | Purpose |
|----------|---------------|--------|
| **`feature/<issue>-<slug>`** | `develop` | New functionality; short lived. |
| **`release/<major.minor.patch>`** | `develop` | Stabilization before release; only regression / doc fixes. |
| **`hotfix/<issue>-<slug>`** | tag **`v*`** in prod | Urgent patch; then merge to `main` and `develop`, new tag. |

---

## Environments (short)

| Environment | Typical Git ref |
|-------------|-----------------|
| **development** | latest `develop` |
| **reference / staging** | `release/*` or chosen commit |
| **production** | `main` + tag **`v*`** + approval |
