# Dokumentacja — spis treści

**Warstwowa narracja (zalecane):** [main](/pl/main) → [simplified](/pl/simplified) → [architecture](architecture.md) → [plan](/pl/plan) → [dodatek](/pl/appendix) · [podsumowanie](/pl/system-summary)

**Ścieżka operacyjna:** **[INFRA-IMPLEMENTATION.md](INFRA-IMPLEMENTATION.md)** — jedna mapa: Camunda + AI scoring, fazy, co czytać, co odłożyć.

---

## Tor A — infrastruktura i chmura (główny fokus)

| Dokument | Zastosowanie |
|----------|--------------|
| [system-philosophy-governance.md](system-philosophy-governance.md) | Filozofia systemu i governance (pełny/przeniesiony tekst z root README) |
| [architecture.md](architecture.md) | **Architektura repozytorium:** warstwy, stos, przepływ, układ monorepo |
| [INFRA-IMPLEMENTATION.md](INFRA-IMPLEMENTATION.md) | Fazy, kolejność, linki — **punkt wejścia** |
| [prompt.md](prompt.md) §1–8 | Handoff, produkt, plan, ścieżki w repo |
| [infra-pulumi-iac.md](infra-pulumi-iac.md) | Pulumi, `stackRole`, OIDC, stosy — **kanon IaC** w tej witrynie |
| [`infra/README.md` (w repo)](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/infra/README.md) | **Bootstrap pet-project:** billing, IAM, GCS state, `infra-core` / split stosy, typowe błędy |
| [piaskownica gke →](infra-pulumi-gke-sandbox.md) | Osobny Pulumi (ten sam region domyślnie; nie łącz VPC/state z głównym stosem) |
| [cli-console.md](cli-console.md) | `gcloud`, Pulumi, Docker, `kubectl` |
| [ml-data-rag.md](ml-data-rag.md) | Vertex, embeddingi, env backendu |
| [hbg-rag-dominance.md](hbg-rag-dominance.md) | HBG: strategia platformy, role U1–U6 |
| [hr-offers-hbg.md](hr-offers-hbg.md) | HBG: oferty, RACI, 11 etapów, macierz 6×11 |
| [../scripts/gcp-enable-apis-iam.sh](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/scripts/gcp-enable-apis-iam.sh) | Włączanie API GCP (CLI) |

## Tor B — Git, GitHub, konwencje

| Dokument | Zastosowanie |
|----------|----------------|
| [git-workflow.md](git-workflow.md) | Gałęzie `develop` / `main`, `release/*`, tagi |
| [github-setup.md](github-setup.md) | Ochrona gałęzi, Environments |
| [branch-notes.md](branch-notes.md) | Gałęzie legacy, uwagi |
| [naming.md](naming.md) | Nazwy repozytorium, tagów |

## Tor C — governance, role, dostęp (po MVP lub na audyt)

| Dokument | Zastosowanie |
|----------|----------------|
| [team-11x6-organization.md](team-11x6-organization.md) | **Zespół 11×6:** koncepcja (warstwy, SoD, SDLC) + linki do **sześciu person** z pełnym cyklem rozwoju |
| [team-persona-ok-admin.md](team-persona-ok-admin.md) · [gw-devops](team-persona-gw-devops.md) · [ux-dev](team-persona-ux-dev.md) · [sh-dev](team-persona-sh-dev.md) · [pk-qa](team-persona-pk-qa.md) · [ok-audit](team-persona-ok-audit.md) | Jedna strona na konto: mandat, fazy SDLC, GitHub/GCP, interakcje, antywzorce |
| [gcp-saas-access-matrix-11x6.md](gcp-saas-access-matrix-11x6.md) | 11 ról × GCP, 6 kont; szczegóły — [prompt](prompt.md) §9 |
| [github-codeowners-matrix.md](github-codeowners-matrix.md) | Role ↔ GitHub, CODEOWNERS |
| [accounts.md](accounts.md) | Kanoniczny remote; lokalne PII w `accounts.local.md` (gitignore) |
| [prompt.md](prompt.md) §9+ | Enterprise, hardening, SoD |

## Inne

| Dokument | Zastosowanie |
|----------|----------------|
| [prompt.md](prompt.md) | **Długi:** §1–8 = handoff; §9+ = rozszerzona spec. — nie czytaj liniowo przy starcie infrastruktury |

---

**Katalogowy [README.md](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/README.md)** — skrót repozytorium i link tutaj.

> [Русский: оглавление](/ru/toc) · [English: table of contents](/en/toc)
