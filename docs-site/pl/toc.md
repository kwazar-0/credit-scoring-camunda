# Dokumentacja — spis treści

**Zacznij od:** **[INFRA-IMPLEMENTATION.md](INFRA-IMPLEMENTATION.md)** — jedna mapa: Camunda + AI scoring, fazy, co czytać, co odłożyć.

---

## Tor A — infrastruktura i chmura (główny fokus)

| Dokument | Zastosowanie |
|----------|--------------|
| [INFRA-IMPLEMENTATION.md](INFRA-IMPLEMENTATION.md) | Fazy, kolejność, linki — **punkt wejścia** |
| [prompt.md](prompt.md) §1–8 | Handoff, produkt, plan, ścieżki w repo |
| [../infra/ARCHITECTURE.md](https://github.com/OlehKondratow/credit-scoring-camunda/blob/develop/infra/ARCHITECTURE.md) | Projekty, namespace, OIDC, state |
| [../infra/pulumi/README.md](https://github.com/OlehKondratow/credit-scoring-camunda/blob/develop/infra/pulumi/README.md) | Pulumi: uruchomienie, eksporty; opcjonalnie [gke-infra (dok. →)](infra-pulumi-gke-sandbox.md), [katalog w `infra/`](https://github.com/OlehKondratow/credit-scoring-camunda/tree/develop/infra/pulumi/gke-infra) |
| [cli-console.md](cli-console.md) | `gcloud`, Pulumi, Docker, `kubectl` |
| [ml-data-rag.md](ml-data-rag.md) | Vertex, embeddingi, env backendu |
| [../scripts/gcp-enable-apis-iam.sh](https://github.com/OlehKondratow/credit-scoring-camunda/blob/develop/scripts/gcp-enable-apis-iam.sh) | Włączanie API GCP (CLI) |

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
| [../infra/ROLES.md](https://github.com/OlehKondratow/credit-scoring-camunda/blob/develop/infra/ROLES.md) | 11 ról, GCP/Pulumi/K8s/Git, kroki |
| [gcp-saas-access-matrix-11x6.md](gcp-saas-access-matrix-11x6.md) | 11 ról × GCP, 6 kont |
| [github-codeowners-matrix.md](github-codeowners-matrix.md) | Role ↔ GitHub, CODEOWNERS |
| [accounts.md](accounts.md) | Kanoniczny remote; lokalne PII w `accounts.local.md` (gitignore) |
| [prompt.md](prompt.md) §9+ | Enterprise, hardening, SoD |

## Inne

| Dokument | Zastosowanie |
|----------|----------------|
| [prompt.md](prompt.md) | **Długi:** §1–8 = handoff; §9+ = rozszerzona spec. — nie czytaj liniowo przy starcie infrastruktury |

---

**Katalogowy [README.md](https://github.com/OlehKondratow/credit-scoring-camunda/blob/develop/README.md)** — skrót repozytorium i link tutaj.

> [Русский: оглавление](/toc) · [English: table of contents](/en/toc)
