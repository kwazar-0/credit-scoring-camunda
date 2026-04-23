# Names: repository, branches, folder

**`Credit-Scoring-V2`** is not the “official” product name — it is a legacy technical label. Public name: **Handlowy Bank Galicyjski (HBG)** (see `prompt.md`).

## What counts as canonical

| Item | Recommended name |
|------|------------------|
| **Product / documentation** | **Handlowy Bank Galicyjski** (short **HBG**; fictitious sample bank) |
| **Default branch on GitHub** | **`main`**; **`develop`** for integration (do not use `Credit-Scoring-V2` as the default *name* for the branch) |
| **Remote** | `git@github.com:OlehKondratow/credit-scoring-camunda.git` — the **GitHub repository name** can be changed in *Settings → General → Repository name* (e.g. `hbg`); GitHub rewrites URL; set new `remote url`. |
| **Release tags** | **`v1.0.0`**, `v1.1.0`, … (SemVer) |
| **Local clone folder** | Any convenient path, e.g. `~/src/hbg-worktree` — does not affect code. |

## Remove / do not recreate

- **Git tag `Credit-Scoring-V2`** — not SemVer; remove locally and on `origin` if created by mistake:

  ```bash
  git tag -d Credit-Scoring-V2
  git push origin :refs/tags/Credit-Scoring-V2
  ```

- Do not use a **default branch** named `Credit-Scoring-V2` — see **[branch-notes.md](branch-notes.md)**.

## GitHub: rename the repository

1. *Repository → Settings → General → Repository name* — set a new one (e.g. `hbg`).
2. Update `git remote`:

   ```bash
   git remote set-url origin git@github.com:OlehKondratow/NEW_NAME.git
   ```

3. Check **CI badges**, Argo CD `repoURL`, doc links — update old URLs.
