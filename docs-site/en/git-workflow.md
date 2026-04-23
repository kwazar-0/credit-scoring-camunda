# Git: branches, releases, and environments

Aligned with `prompt.md` (§2), `infra/ROLES.md`, **[github-setup.md](github-setup.md)**, and **[branch-notes.md](branch-notes.md)**. Default remote: `git@github.com:OlehKondratow/credit-scoring-camunda.git`. Repository name, tags, and clone path: **[naming.md](naming.md)**.

---

## 1. Branches (corporate)

| Branch / template | Purpose |
|-------------------|--------|
| **`main`** | **Production** — protected line; only agreed code to prod (see Environments in github-setup). |
| **`develop`** | **Integration** — main dev flow; features merge here. **Default** on GitHub is **`main`**; `develop` is a separate line (see branch-notes). |
| **`feature/<issue>-<slug>`** | Features and refactors; from `develop`, merge back via PR. |
| **`release/<major.minor.patch>`** | Stabilize before release; from `develop`; after release — merge to `main` and back to `develop`, tag **`v*`** (per team policy). |
| **`hotfix/<issue>-<slug>`** | Urgent fix from tag **`v*`** in prod; merge to `main` and `develop`. |

---

## 2. Tags and GitHub Releases

- Format: **`vMAJOR.MINOR.PATCH`** (SemVer), e.g. `v1.1.0`.
- Tag the commit that **ships to prod** (or the CI-referenced image).
- **GitHub Release** with changelog per team template; attach links to images in Artifact Registry and Pulumi stack, no secrets.

Current examples: **`v1.0.0`** / **`v1.1.0`**. Rewrite tags on remote only when intentional.

---

## 3. Flow (short)

1. From **`develop`**, create **`feature/…`**, work, **PR** → merge to **`develop`**.
2. Before release: **`release/1.2.0`** from current **`develop`**, fixes only; tests / staging.
3. After acceptance: merge **`release/…` → `main`**, **tag `v1.2.0`**, **GitHub Release**, deploy with approval (**Release Manager**, see `ROLES.md`).
4. Keep **`main` → `develop`** in sync after release (or cherry-pick) if policy needs equality.

---

## 4. Environment mapping (reference)

| Environment | Typical Git ref |
|-------------|-----------------|
| **dev** | latest **`develop`** |
| **staging / ref** | **`release/*`** or commit + image `:rc` |
| **prod** | **`main`** + tag **`v*`** + approval |

CI: **`.github/workflows/ci.yml`** — push on **`develop`**, **`main`**, **`release/**`, **`feature/**`, **`hotfix/**`, tags `v*`; PR to **`develop`**, **`main`**, **`release/**` OIDC/WIF — see `infra/ARCHITECTURE.md`.

---

## 5. GitHub settings

Step by step: **[github-setup.md](github-setup.md)**. Short: **branch protection** on **`main`** and **`develop`**, **Environments**, **CODEOWNERS**.

---

## 6. Useful commands

```bash
git fetch origin
git switch develop
git pull origin develop

git switch -c feature/123-short-desc
# … commits …
git push -u origin feature/123-short-desc
```

Release branch:

```bash
./scripts/create-release-branch.sh 1.2.0
# or: make release-branch VERSION=1.2.0
```

Manual:

```bash
git switch develop && git pull
git switch -c release/1.2.0
# fixes, then PR to main + develop per process
git tag -a v1.2.0 -m "HBG release 1.2.0"
git push origin v1.2.0
```
