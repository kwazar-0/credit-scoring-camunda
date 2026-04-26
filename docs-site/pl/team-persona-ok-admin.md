# Persona: **ok-admin** (ADMIN)

**Pakiet slotów (11):** Platform •, Release ○.  
**Przeznaczenie:** własność **organizacyjnego** i **projektowego** perymetru GCP, polityk bazowych, zatwierdzanie ryzykownych zmian; **nie** codzienny kod aplikacji.

**Koncepcja zespołu:** [team-11x6-organization](/pl/team-11x6-organization) · **EN:** [/en/team-persona-ok-admin](/en/team-persona-ok-admin)

---

## Mandat i granice

- **Posiada:** struktura folderów/projektu, kvoty, zatwierdzenia org, powiązanie z billingiem, „źródło prawdy” nazw środowisk.  
- **Nie posiada:** szczegółów promptów RAG, schematu DMN (poza wetem architektonicznym), samodzielnych wydań aplikacji bez drugiej osoby (Release), jeśli SoD tego wymaga.

---

## SDLC — wiodące fazy

| Faza | Działania | Artefakty |
|------|-----------|-----------|
| **0–1** | nowa powierzchnia GCP, region, rezydencja danych; projekty dev/ref/prod | ADR, lista API |
| **2–3** | review PR w `infra/`, `k8s/` (blast radius) | approve CODEOWNERS |
| **4–5** | kvoty i granice sieci ref; brak mieszania state piaskownicy z prod | checklista środowiska |
| **6** | drugi głos / właściciel Environment — wg polityki banku | GitHub Environment |
| **7** | zwykle **brak** udziału (brak slotu UAT/App) | — |
| **8–9** | eskalacje IAM, org policy; dowody dla audytu zewnętrznego | eksport IAM, diagramy grup |

---

## GitHub

Ścieżki: `infra/`, polityki w korzeniu, `SECURITY.md`. Zob. [github-codeowners-matrix](/pl/github-codeowners-matrix).

---

## GCP

Role Resource Manager, powiązania na **grupy**; unikać osobistego **Owner** na prod dla całego zespołu. Bucket **state Pulumi** — strefa kontrolowana.

---

## Interakcje

| Z kim | Temat |
|-------|--------|
| **gw-devops** | delegacja `pulumi up` w ramach zatwierdzonych modułów |
| **ok-audit** | wyjątki z polityki — na piśmie i czasowo |
| **ux-dev / sh-dev** | nowe API Vertex / kvoty — formalny intake |

---

## Antywzorce

- Nadanie sobie **Owner** na prod „na debug”.  
- Jeden duży PR zmieniający sieć **i** dane bez podziału i bez Sec przy wrażliwych zmianach.
