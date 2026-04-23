# Helm values z klastra (Camunda Platform)

**Szablon startowy (commitowany):** [`values-camunda-platform.user.yaml`](values-camunda-platform.user.yaml) — baza pod `helm install/upgrade -f` (8.6.x, lżejszy profil; dostosuj do wersji chartu).

Aktualny zrzut z klastra zapisuje skrypt — **nadpisuje** pliki w **tym katalogu** (`k8s/camunda/`).

Pliki generowane: **`camunda-platform-user-values.yaml`** i **`camunda-platform-all-values.yaml`** z bieżącego kontekstu kube:

```bash
chmod +x scripts/fetch-helm-values.sh
kubectl config current-context   # upewnij się, że to Twój GKE
./scripts/fetch-helm-values.sh camunda camunda-platform
```

| Plik | Zawartość |
|------|-----------|
| `values-camunda-platform.user.yaml` | Ręczny szablon w repo (nie nadpisywany przez skrypt) |
| `camunda-platform-user-values.yaml` | Zrzut: tylko nadpisania użytkownika (`helm get values` bez `--all`) |
| `camunda-platform-all-values.yaml` | Zrzut: pełne wartości po merge (`--all`); duży — domyślnie w `.gitignore` |

Opcjonalnie pełny manifest release (może być bardzo duży):

```bash
FETCH_MANIFEST=1 ./scripts/fetch-helm-values.sh camunda camunda-platform
```

Jeśli inna nazwa release lub namespace — podaj je jako pierwszy i drugi argument.
