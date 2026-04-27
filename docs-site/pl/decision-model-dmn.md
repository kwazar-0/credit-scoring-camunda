---
title: "DMN: model decyzji"
description: "Rola DMN w deterministycznej logice decyzji kredytowej."
---

# DMN: model decyzji

Strona definiuje miejsce **DMN** w architekturze oraz to, które elementy decyzji kredytowej muszą pozostać deterministyczne.

## Co należy do DMN

- sformalizowane reguły biznesowe;
- deterministyczne tabele decyzyjne;
- wersjonowana logika policy z jawną historią zmian.

## Czego DMN nie obejmuje

- orkiestracji etapów (odpowiedzialność BPMN);
- zachowania infrastruktury (odpowiedzialność Pulumi/GCP);
- kodu integracyjnego i transportowego (odpowiedzialność services/workers).

## Cel projektowy

DMN ogranicza niejednoznaczność i zapobiega „rozlewaniu się” logiki policy do ścieżek runtime trudniejszych do audytu.

## Governance zmian

Zmiany DMN przechodzą ten sam kontrolowany cykl co kod:

1. właściciel w ramach roli i domeny;
2. review i approve;
3. kontrola zgodności z procesem;
4. obserwowalny i atrybuowalny efekt w runtime.

## Powiązane strony

- [Architektura](/pl/architecture)
- [Camunda: przepływ procesu](/pl/process-flow-camunda)
- [Filozofia i governance](/pl/system-philosophy-governance)
