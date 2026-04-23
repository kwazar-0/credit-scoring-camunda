# Nazwy: repozytorium, gałęzie, katalog

**`Credit-Scoring-V2`** nie jest «oficjalną» nazwą produktu — to przestarzały etykiet techniczny. Publiczna nazwa konturu: **Handlowy Bank Galicyjski (HBG)** (zob. `prompt.md`).

## Co uznajemy za kanon

| Byt | Zalecana nazwa |
|-----|----------------|
| **Produkt / dokumentacja** | **Handlowy Bank Galicyjski** (skrót **HBG**; wymyślony bank-przykład) |
| **Default branch na GitHub** | **`main`**; **`develop`** do integracji (nie używaj `Credit-Scoring-V2` jako nazwy default branch) |
| **Remote** | `git@github.com:OlehKondratow/credit-scoring-camunda.git` — **nazwę repozytorium** na GitHubie można zmienić w *Settings → General → Repository name*; GitHub przekierowuje URL, ustaw nowy `remote url`. |
| **Tagi release** | **`v1.0.0`**, `v1.1.0`, … (SemVer) |
| **Lokalny katalog klonu** | Dowolna ścieżka, np. `~/src/hbg-worktree` — nie wpływa na kod. |

## Cofnąć / nie tworzyć ponownie

- **Tag gita `Credit-Scoring-V2`** — nie SemVer, myli z wersją; lepiej usunąć lokalnie i na `origin`, jeśli był pomyłką:

  ```bash
  git tag -d Credit-Scoring-V2
  git push origin :refs/tags/Credit-Scoring-V2
  ```

- Nie używaj **default branch** o nazwie `Credit-Scoring-V2` — zob. **[branch-notes.md](branch-notes.md)**.

## GitHub: zmiana nazwy repozytorium

1. *Repository → Settings → General → Repository name* — nowa (np. `hbg`).
2. Zaktualizuj `git remote`:

   ```bash
   git remote set-url origin git@github.com:OlehKondratow/NOWA_NAZWA.git
   ```

3. Sprawdź **CI badges**, `repoURL` w Argo CD, linki w dokumentacji.
