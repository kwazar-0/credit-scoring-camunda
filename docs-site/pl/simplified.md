---
title: "Model uproszczony (role)"
description: "Rdzenie ról i granice odpowiedzialności; odesłanie do 11×6."
---

# Model uproszczony (role)

To **poziom 1** — model **dla człowieka**. Stosy, GKE i Pulumi: [architecture](/pl/architecture). Pełne persony GCP i sześć kont: [appendix](/pl/appendix) i [zespół 11×6](/pl/team-11x6-organization).

---

## Idea

Dostęp wynika z **odpowiedzialności**, a nie tylko z etykietki stanowiska. **Rola** to tu **granica własności** (kto może zmieniać którą warstwę), a nie pęk uprawnień.

---

## Cztery rdzeniowe role (skrót)

| Rola | Odpowiedzialność |
|------|--------|
| **Business** | Intencja skoringu i polityki; wspólnie z inżynierią — **DMN** i reguły produktowe. |
| **Engineer** | `backend/`, `worker/`, testy; API i workery; **bez** cichego obchodzenia procesu i audytu. |
| **Platform** | **Pulumi / GKE / sieć / IAM**; stosy, release, bezpieczeństwo runtime. |
| **Operator** | Eksploatacja: monitorowanie, Camunda, klaster; incydenty; bez nieautoryzowanych zmian w **prod**. |

Mapowanie na detal **11 ról × 6 domen operacyjnych** — [macierz GCP 11×6](/pl/gcp-saas-access-matrix-11x6), [zespół 11×6](/pl/team-11x6-organization). **U1–U6** w architekturze to **orientacyjne** przypisanie do komponentów (chmura, ops, ML, dane, jakość, audyt).

---

## Co „posiada” warstwa

- **DMN** — tabele reguł i kontrola zmian.
- **Camunda (BPMN)** — które kroki, w jakiej kolejności, gdzie interweniuje człowiek.
- **Serwisy i workery** — **jak** zaimplementowane integracje i scoring (nie „gdzie z natury stoi polityka”).
- **Infrastruktura** — **jak** środowisko **jest opisane** i **odtwarzane** (Pulumi, nie klikając w **prod**).

---

## Zasada

> Rola to nie tylko pakiet uprawnień. To **kontrakt**, którą część systemu i pod jakim przeglądem i auditem możesz zmieniać.

**Dalej:** [architecture](/pl/architecture) → [plan](/pl/plan) → [wejście (main)](/pl/main).

> [English](/en/simplified) · [Русский](/ru/simplified)
