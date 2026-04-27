# Имена: репозиторий, ветки, папка

**`Credit-Scoring-V2`** не используем как «официальное» имя продукта — это устаревший технический ярлык. Публичное имя контура: **Handlowy Bank Galicyjski (HBG)** (см. [main.md](main.md)).

## Что считать каноном

| Сущность | Рекомендуемое имя |
|----------|-------------------|
| **Продукт / документация** | **Handlowy Bank Galicyjski** (скорочено **HBG**, вымышленный банк-пример) |
| **Default branch на GitHub** | **`main`**; **`develop`** — интеграция (не использовать имя `Credit-Scoring-V2` для default) |
| **Remote** | `git@github.com:kwazar-0/credit-scoring-camunda.git` — имя **репозитория** на GitHub можно сменить в *Settings → General → Repository name* (например на `hbg`); GitHub перенастроит URL, добавьте новый `remote url`. |
| **Релизные теги** | **`v1.0.0`**, `v1.1.0`, … (SemVer) |
| **Локальная папка клона** | Любое удобное, напр. `~/src/hbg-worktree` — на код не влияет. |

## Что убрать / не создавать повторно

- **Git-тег `Credit-Scoring-V2`** — не семантический и путает с версией; лучше удалить (локально и на `origin`), если создавали по ошибке:

  ```bash
  git tag -d Credit-Scoring-V2
  git push origin :refs/tags/Credit-Scoring-V2
  ```

- Не использовать **default branch** с именем `Credit-Scoring-V2` — см. **[branch-notes.md](branch-notes.md)**.

## GitHub: смена имени репозитория

1. *Repository → Settings → General → Repository name* — задать новое (например `hbg`).
2. Обновить `git remote`:

   ```bash
   git remote set-url origin git@github.com:kwazar-0/НОВОЕ_ИМЯ.git
   ```

3. Проверить **CI badges**, **Argo CD** `repoURL`, ссылки в доках — заменить старый URL.
