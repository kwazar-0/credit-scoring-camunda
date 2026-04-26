# Konta i tożsamość repozytorium

Ten dokument tłumaczy, **które repozytorium na GitHubie jest źródłem prawdy** i jak uniknąć przypadkowego ujawnienia **prywatnych adresów e-mail** w historii gita lub w drzewie plików.

## Kanoniczny upstream

| Element | Wartość |
|---------|---------|
| **Główne repozytorium** | [kwazar-0/credit-scoring-camunda](https://github.com/kwazar-0/credit-scoring-camunda) |
| **Domyślna gałąź integracji** | `develop` (zob. [git-workflow.md](git-workflow.md)) |

Inne remotes (forki, mirrory) mogą istnieć lokalnie; traktuj je jako **prywatne / przejściowe**, nie jako Źródło prawdy dla releasów czy CI.

## Analiza (historyczne tożsamości)

Lokalne notatki wymieniały **kilka par** `user.name` / `user.email` (tymczasowe lub alternatywne) oraz **drugi remote** wskazujący na fork.

**Wnioski:**

1. **Atrybucja commitów** — stara historia może pokazywać różnych autorów; dla **nowych** prac używaj spójnej tożsamości zgodnie z polityką org.
2. **Prywatność** — listy e-mail i mapowanie kont należy trzymać w **dokach lokalnych / wewnętrznych**, nie w publicznym repozytorium.
3. **Remote** — przed `git push` sprawdź `git remote -v` (upstream vs fork).

## Rekomendacje

- Ustaw tożsamość lokalnie: `git config user.name` / `user.email`.
- Ewent. `.mailmap` — [git-mailmap](https://git-scm.com/docs/gitmailmap).
- Prywatną listę w `doc/accounts.local.md` (ignorowane) wg szablonu [accounts-local-example.md](accounts-local-example.md).

## Zobacz też

- [GOVERNANCE.md](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/GOVERNANCE.md)
- [CONTRIBUTING.md](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/CONTRIBUTING.md)
- [SECURITY.md](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/SECURITY.md)
