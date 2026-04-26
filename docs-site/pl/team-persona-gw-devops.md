# Persona: **gw-devops** (DEVOPS)

**Pakiet slotów (11):** Platform •, Sec ○, **BG on-call**, Release ○.  
**Przeznaczenie:** **operacyjne** wcielenie platformy: CI/CD, klaster, sekrety, incydenty; wspólnie z Sec — „druga para oczu” na politykach.

**Koncepcja zespołu:** [team-11x6-organization](/pl/team-11x6-organization) · **EN:** [/en/team-persona-gw-devops](/en/team-persona-gw-devops)

---

## Mandat i granice

- **Posiada:** GitHub Actions, OIDC→GCP, Helm Camunda/GKE, runbooki wdrożeń, **on-call** dla slotu BG (elewacja ściśle wg runbooka).  
- **Nie posiada:** reguł biznesowych DMN; logiki scoringu w `backend/` jako główny autor (review platformowe — tak).

---

## SDLC — wiodące fazy

| Faza | Działania | Wynik |
|------|-----------|--------|
| **0–1** | pojemność klastra, sekrety, połączenie Zeebe↔worker↔backend | diagram usług |
| **2–3** | PR `infra/pulumi/`, `k8s/`, workflows; dev namespace, Workload Identity | zielony CI, `pulumi preview` w PR |
| **4** | wsparcie testerów dev (logi, port-forward), **nie** zastępowanie QA | skrypty `infra/scripts/` |
| **5** | promocja obrazów do ref; tagi wg [git-workflow](/pl/git-workflow) | obrazy w GAR |
| **6** | gate release jako wykonawca deploy lub reviewer — wg macierzy | Environment |
| **7** | stabilność środowiska UAT, **nie** podpis biznesowy | healthchecki |
| **8** | incydenty 24/7; **BG**: czasowa elewacja, log, cofnięcie | postmortem |
| **9** | eksport konfiguracji do audytu (bez sekretów) | manifesty |

---

## GitHub

CODEOWNERS: `infra/`, `k8s/`, `.github/workflows/`, compose, `Makefile`. [github-setup](/pl/github-setup).

---

## GCP

Admin GKE **w ramach** polityki; bez szerokiego Editor na prod „dla wygody”. Pulumi po zasadach **ok-admin** / state.

---

## Interakcje

| Z kim | Temat |
|-------|--------|
| **ok-admin** | org/folder, kvoty, nowe projekty |
| **ux-dev / sh-dev** | kontrakty portów, env, limity podów |
| **pk-qa** | dane testowe dev/ref |
| **ok-audit** | incydenty, dostęp BG, dowody dla Sec |

---

## Antywzorce

- Trwałe klucze JSON dla CI zamiast OIDC/WIF.  
- Poprawki `kubectl` w prod bez śladu GitOps.
