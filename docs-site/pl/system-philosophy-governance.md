---
layout: page
title: Filozofia systemu i model governance
description: Credit Scoring Camunda - governance-first architecture model
outline: [2, 3]
---

# Credit Scoring Camunda

## Filozofia systemu i model governance

---

## 1. Po co istnieje ten system

Ta platforma ma jeden cel:

> **Uczynić decyzje biznesowe jawnymi, kontrolowanymi i audytowalnymi.**

W systemie credit scoring:

- decyzje wpływają na ryzyko i compliance
- zmiany muszą być śledzalne
- odpowiedzialność musi być jednoznacznie przypisana

System wymusza te ograniczenia na poziomie architektury.

---

## 2. Główna zasada

> **Systemem rządzą granice odpowiedzialności, a nie tylko struktura kodu.**

Zamiast modelu „każdy inżynier zmienia wszystko”, definiujemy:

- **kto może zmieniać decyzje**
- **kto może zmieniać procesy**
- **kto może zmieniać infrastrukturę**

Każde działanie jest intencjonalne i kontrolowane.

---

## 3. Architektura warstwowa

Platforma jest podzielona na niezależne warstwy:

| Warstwa | Odpowiedzialność | Częstotliwość zmian |
| --- | --- | --- |
| Decision (DMN) | Reguły biznesowe | Wysoka |
| Process (BPMN) | Orkiestracja | Średnia |
| Services | Logika wykonawcza | Kontrolowana |
| Infrastructure | Platforma chmurowa (GCP) | Niska |

### Kluczowa reguła

> Każda warstwa rozwija się niezależnie i ma innych właścicieli ról.

To zapobiega:

- ukrytej logice
- przypadkowym zmianom cross-layer
- niekontrolowanym wdrożeniom

---

## 4. Role-based governance (model 11 x 6)

System używa **dwuwymiarowego modelu governance**:

- **11 ról** -> definiuje odpowiedzialności
- **6 user domains** -> definiuje zakres działania

### Co to oznacza

Rola nie jest nazwą stanowiska.  
Rola to **kontrolowana capability** w systemie.

Przykład:

- Użytkownik może modyfikować reguły decyzji
- Ale nie może wdrażać infrastruktury
- I nie może promować kodu na production

### Po co to istnieje

Aby wymusić:

- segregation of duties
- audytowalność
- minimalne uprawnienia

---

## 5. Spójny model dostępu

Ten sam model ról jest stosowany konsekwentnie w:

- GitHub (kod źródłowy i workflow)
- GCP (infrastruktura i dane)
- Camunda (procesy i decyzje)

### Zasada

> Dostęp definiuje się raz i egzekwuje wszędzie.

To eliminuje:

- niespójne uprawnienia
- ukryte ścieżki dostępu
- luki bezpieczeństwa

---

## 6. Git workflow jako mechanizm kontroli

Git workflow to nie tylko proces developmentu.  
To **control pipeline zmian systemowych**.

| Stage | Purpose |
| --- | --- |
| feature | tworzenie zmiany |
| develop | integracja |
| release | walidacja |
| main | production state |

### Kluczowa reguła

> Przenoszenie kodu między branchami wymaga walidacji i approve.

To gwarantuje:

- brak zmian w production bez kontroli
- pełną śledzalność zmian

---

## 7. Infrastructure as Code (Pulumi)

Cała infrastruktura jest zarządzana przez Pulumi ze wspólnym backendem state:

```text
gs://credit-scoring-camunda-project-pulumi-state-euc2
```

Infrastruktura jest podzielona na niezależne stosy:

### infra-core

- VPC, subnety, Private Service Access
- warstwa bazowej sieci

### infra-data

- storage (GCS), analytics (BigQuery), opcjonalnie Cloud SQL
- lifecycle danych

### infra-runtime

- GKE (private nodes), Workload Identity
- środowisko wykonawcze dla usług i Camunda

### Zasada

> Infrastruktura jest wersjonowana, odtwarzalna i izolowana warstwowo.

---

## 8. Zachowanie systemu

Typowa zmiana przechodzi ścieżkę:

1. Decyzja lub kod jest modyfikowany w ramach określonej roli
2. Zmiana przechodzi przez kontrolowany Git workflow
3. Infrastruktura/proces są aktualizowane przez Pulumi / Camunda
4. Zmiana staje się widoczna i audytowalna

---

## 9. Co ten system optymalizuje

Platforma jest projektowana pod:

- **auditability**
- **controlled change management**
- **clear ownership boundaries**

Nie jest optymalizowana pod:

- rapid prototyping
- minimalny overhead procesowy

---

## 10. Podsumowanie

System narzuca trzy kluczowe ograniczenia:

1. **Rozdzielenie odpowiedzialności między warstwami**
2. **Jawna kontrola dostępu przez model ról (11 x 6)**
3. **Kontrolowany przepływ zmian przez Git i pipeline infrastruktury**

> Jeśli zmiany nie da się wyjaśnić, prześledzić i przypisać,  
> nie powinna istnieć w systemie.

---

**Languages:** [English](/en/system-philosophy-governance) · [Русский](/ru/system-philosophy-governance)
