# Gałęzie: przeznaczenie i uwagi

Zgodnie z **[git-workflow.md](git-workflow.md)** i **[github-setup.md](github-setup.md)**. Szablony `feature/*`, `hotfix/*`, `release/*` tworzysz w trakcie prac i nie muszą być zawsze na `origin`.

---

## Długo żyjące gałęzie

| Gałąź | Przeznaczenie | Uwagi |
|--------|---------------|--------|
| **`main`** | **Production** — kod na prod; merge tylko PR (github-setup). | **Default branch** na GitHub; bez bezpośredniego push; wdrożenie do `production`. |
| **`develop`** | **Integracja** — tu trafiają ficzery; zwykle dev. | Nie jest default; merge z `feature/*` / powroty z release zgodnie z git-workflow. |

---

## Krótkotrwałe (szablony nazw)

| Szablon | Odetnięta od | Cel |
|----------|-------------|-----|
| **`feature/<issue>-<slug>`** | `develop` | Nowa funkcja; krótki cykl. |
| **`release/<major.minor.patch>`** | `develop` | Stabilizacja przed releasem; tylko fiksy regresji / dokumentacji. |
| **`hotfix/<issue>-<slug>`** | tag **`v*`** w prod | Pilny fix; potem merge do `main` i `develop`, nowy tag. |

---

## Środowiska (skrót)

| Środowisko | Typowy ref gita |
|------------|-----------------|
| **development** | ostatni `develop` |
| **reference / staging** | `release/*` lub wybrany commit |
| **production** | `main` + tag **`v*`** + zatwierdzenie |
