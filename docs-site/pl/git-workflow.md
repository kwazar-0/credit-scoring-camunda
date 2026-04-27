# Git: gałęzie, release’y, środowiska

Zgodne z [main.md](main.md) (wejście), [gcp-saas-access-matrix-11x6.md](gcp-saas-access-matrix-11x6.md) (role), **[github-setup.md](github-setup.md)**, **[branch-notes.md](branch-notes.md)**. Domyślny remote: `git@github.com:kwazar-0/credit-scoring-camunda.git`. Nazwa repozytorium, tagi, katalog klonu: **[naming.md](naming.md)**.

---

## 1. Gałęzie (schemat firmowy)

| Gałąź / szablon | Przeznaczenie |
|------------------|--------------|
| **`main`** | **Production** — chroniona; do produ tylko uzgodniony kod (Environments w github-setup). |
| **`develop`** | **Integracja** — główny przepływ; tu merge ficzrów. **Default** na GitHub to **`main`**; `develop` to osobna linia (branch-notes). |
| **`feature/<issue>-<slug>`** | Ficzer i refaktor; z `develop`, z powrotem PR. |
| **`release/<major.minor.patch>`** | Stabilizacja przed releasem; z `develop`; po release — merge do `main` i z powrotem do `develop`, tag **`v*`** (wg polityki). |
| **`hotfix/<issue>-<slug>`** | Hotfix z tagu **`v*`** w prod; merge do `main` i `develop`. |

---

## 2. Tagi i GitHub Releases

- Format: **`vMAJOR.MINOR.PATCH`**, np. `v1.1.0`.
- Tag na commicie idącym **na produ** (lub referowanym w CI).
- **GitHub Release** z changelog wg szablonu zespołu; tylko linki do obrazów w AR i stosu Pulumi, bez sekretów.

Odniesienia: **`v1.0.0`**, **`v1.1.0`**. Nadpisuj tagi na `origin` tylko świadomie.

---

## 3. Przepływ (skrót)

1. Z **`develop`** — **`feature/…`**, praca, **PR** → merge do **`develop`**.
2. Przed releasem: **`release/1.2.0`** z bieżącego **`develop`**, tylko fiksy; testy / staging.
3. Po akceptacji: merge **`release/…` → `main`**, **tag `v1.2.0`**, **Release**, wdrożenie z aprobatą (**Release Manager**, `ROLES.md`).
4. Synchronizacja **`main` → `develop`** po release (lub cherry-pick), jeśli polityka tego wymaga.

---

## 4. Mapowanie środowisk

| Środowisko | Typowy ref gita |
|------------|-----------------|
| **dev** | ostatni **`develop`** |
| **staging / ref** | **`release/*`** lub commit + obraz `:rc` |
| **prod** | **`main`** + tag **`v*`** + aprobata |

CI: **`.github/workflows/ci.yml`** — push na **`develop`**, **`main`**, **`release/**`, itd. — zob. [infra-pulumi-iac.md](infra-pulumi-iac.md).

---

## 5. Ustawienia GitHub

Krok po kroku: **[github-setup.md](github-setup.md)**. W skrócie: **branch protection** na **`main`**, **`develop`**, **Environments**, **CODEOWNERS**.

---

## 6. Polecenia

```bash
git fetch origin
git switch develop
git pull origin develop
git switch -c feature/123-short-desc
git push -u origin feature/123-short-desc
```

```bash
./scripts/create-release-branch.sh 1.2.0
```

```bash
git switch develop && git pull
git switch -c release/1.2.0
git tag -a v1.2.0 -m "HBG release 1.2.0"
git push origin v1.2.0
```
