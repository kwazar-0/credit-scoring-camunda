---
layout: home

hero:
  name: Handlowy Bank Galicyjski (HBG)
  text: Camunda 8 + pipeline AI
  tagline: >-
    Monorepo: FastAPI + LangGraph, PyZeebe, Streamlit, Pulumi (GCP, europe-central2), RAG, Vertex AI.
    Poniżej skrót; pełna treść w Architekturze.
  image:
    src: /images/hbg-bf1.png
    alt: Handlowy Bank Galicyjski
  actions:
    - theme: brand
      text: Architektura
      link: /pl/architecture
    - theme: brand
      text: Mapa prac (infra)
      link: /pl/INFRA-IMPLEMENTATION
    - theme: alt
      text: Spis treści
      link: /pl/toc

features:
  - icon: 🏦
    title: Proces i orkiestracja
    details: Zeebe, BPMN/DMN, workery w worker/ — deterministyczne kroki, nie „jeden chat”.
  - icon: 🧠
    title: Vertex AI i RAG
    details: Embeddingi, wyszukiwanie, LLM w backend/; PII w kodzie. Zob. ml-data-rag, hbg-rag-dominance.
  - icon: 🏛
    title: Chmura i IaC
    details: Pulumi, GKE, OIDC, split — INFRA-IMPLEMENTATION i infra-pulumi-iac (Źródło).
  - icon: 🖥
    title: API i UI
    details: backend/, ui/ (Streamlit) — granice w .cursorrules.
  - icon: 📋
    title: Role i rekrutacja
    details: U1–U6, RACI — hr-offers-hbg; macierz GCP — gcp-saas-access-matrix-11x6.
  - icon: 🔗
    title: Repozytorium
    details: Źródła i CI na GitHub; witryna z docs-site/ (VitePress).
---

## Filozofia projektu

Trzy filary (każdy zmniejsza chaos i ryzyko operacyjne):

1. **GitHub** — zasady gałęzi i merge odpowiadają realnym rolom i właścicielstwu.  
2. **Role i 11×6** — „kto za co” w produkcie wiąże się z tym, **jakie** usługi GCP może dotykać dane konto.  
3. **Split chmury** — sieć, dane i klaster zmieniają się **innym tempem**, bez jednego monolitycznego stosu.

### GitHub: rola — gałąź — dostęp

**Notatka do sekcji:** jedna linia od polityki repo do faktycznych uprawnień merge/deploy.

**Polityka repozytorium** (gałęzie, release, ochrona gałęzi, środowiska) ma być zgodna z tym, **kto** zmienia kod i **jakim** poziomem jest merge/deploy:

- [git-workflow](/pl/git-workflow) — `main` / `develop`, `release/*`, tagi. **Krótko:** kiedy kod trafia na stabilne gałęzie i jak wyglądają release’y.  
- [github-setup](/pl/github-setup) — branch protection, Environments. **Krótko:** kto może mergować dokąd i jakie środowiska biorą udział w dostawie.  
- [github-codeowners-matrix](/pl/github-codeowners-matrix) — role ↔ CODEOWNERS. **Krótko:** automatyczne review i bramki wg obszarów repo.  
- [naming](/pl/naming) — nazwy repo, gałęzi i katalogu klonu. **Krótko:** spójne nazwy, żeby nie mylić projektów, gałęzi i lokalnych klonów.

### „Działy”, funkcje i macierz 11×6

**Notatka do sekcji:** powiązanie „funkcja w zespole / banku” ↔ „dostęp do chmury”, bez mglistego „wszyscy Owner”.

Dokumentacja HBG opisuje **role organizacyjne** (U1–U6) oraz powiązanie z **macierzą dostępu do GCP/SaaS** (11 ról × konta):

- [hbg-rag-dominance](/pl/hbg-rag-dominance) — strategia, kontury, U1–U6. **Krótko:** po co trzy kontury (orkiestracja / AI+RAG / chmura) i jak się łączą.  
- [hr-offers-hbg](/pl/hr-offers-hbg) — rekrutacja, RACI, etapy. **Krótko:** kto prowadzi wdrożenie wg ról i jak to mapuje się na RACI.  
- [gcp-saas-access-matrix-11x6](/pl/gcp-saas-access-matrix-11x6) — **macierz 11×6**. **Krótko:** minimalne uprawnienia do usług — bez „wszystkim Editor”.

### Chmura: odpowiedzialność i cykl życia (split Pulumi)

**Notatka do sekcji:** infrastruktura jako trzy warstwy o innym tempie zmian i innych właścicielach.

Warstwy GCP są rozdzielone przez `credit-scoring:stackRole`, aby **sieć**, **dane** i **runtime aplikacji** ewoluowały **osobno** i z mniejszym ryzykiem kaskady:

| Warstwa | `stackRole` | Znaczenie | Krótko |
|---------|-------------|-----------|--------|
| Fundament sieci | `infra-core` | VPC, podsieci, PSA | Rzadko się zmienia; baza pod resztę |
| Dane | `infra-data` | GCS, BigQuery, opcj. Cloud SQL | Długowieczne dane; nie odtwarzać przy każdym deployu klastra |
| Runtime | `infra-runtime` | GKE, Artifact Registry, Workload Identity | Warstwa aplikacji; zwykle tu aktualizacje i skalowanie |

- [infra-pulumi-iac](/pl/infra-pulumi-iac) — kanon `stackRole`, split, OIDC na witrynie. **Krótko:** co modeluje kod Pulumi i jak go czytać.  
- [`infra/README.md`](https://github.com/kwazar-0/credit-scoring-camunda/blob/develop/infra/README.md) — runbook krok po kroku w repo. **Krótko:** billing, bucket state, `coreStackRef`, IAM i typowe błędy z praktyki.

---

## O projekcie

**Szkoleniowy / demonstracyjny** przepływ kredytowy z **Camunda 8**, **Vertex AI** (RAG) i **GCP**. Domyślny region IaC: **europe-central2**. Warstwy, tabela, przepływ danych — **[Architektura](/pl/architecture)**.

| Gdzie iść | Dokument |
|-----------|----------|
| Start | [INFRA-IMPLEMENTATION](/pl/INFRA-IMPLEMENTATION) — fazy, Camunda+AI, linki |
| Pulumi, GKE, OIDC | [infra-pulumi-iac](/pl/infra-pulumi-iac) |
| ML, embeddingi, env | [ml-data-rag](/pl/ml-data-rag) |
| Strategia HBG, role U* | [hbg-rag-dominance](/pl/hbg-rag-dominance) |
| gcloud / kubectl | [cli-console](/pl/cli-console) |
| Wszystkie strony | [toc](/pl/toc) |

> Inne języki: [Русский](/ru/) · [English](/en/) · [ADR (site)](/adr)