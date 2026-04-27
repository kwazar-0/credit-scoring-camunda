---
title: "Camunda: przepływ procesu"
description: "Jak proces kredytowy jest orkiestrwany w Camunda BPMN."
---

# Camunda: przepływ procesu

Ta strona opisuje, **jak działa orkiestracja procesu**: przejścia stanu, punkty kontroli policy, uruchamianie workerów i human-in-the-loop.

## Uproszczona sekwencja

1. API przyjmuje wniosek kredytowy.
2. Camunda uruchamia lub wznawia instancję BPMN.
3. DMN i zadania serwisowe oceniają reguły i warunki.
4. Workery wykonują integracje i kroki scoringowe.
5. Przy niskiej pewności lub warunku policy tworzony jest human task.
6. Proces kończy się decyzją z pełnym śladem audytu.

## Dlaczego BPMN

- jawne etapy procesu;
- kontrolowane punkty rozgałęzień;
- przejrzysty handoff między automatyką i człowiekiem;
- śledzalność wykonania dla audytu i incydentów.

## Granice

- BPMN odpowiada za **kolejność i stan procesu**;
- DMN odpowiada za **deterministyczną logikę decyzji**;
- serwisy/workery odpowiadają za **wykonanie i integracje**.

Nie przenosić logiki polityki do infrastruktury ani ad-hoc kodu workerów.

## Powiązane strony

- [Architektura](/pl/architecture)
- [DMN: model decyzji](/pl/decision-model-dmn)
- [INFRA-IMPLEMENTATION](/pl/INFRA-IMPLEMENTATION)
