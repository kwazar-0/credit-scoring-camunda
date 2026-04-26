# HBG RAG-DOMINANCE — strategia i granice systemu

| Pole | Wartość |
|------|---------|
| **Status** | Wewnętrzny; bez zgody nie do publikacji zewnętrznej |
| **Powiązane** | [hr-offers-hbg](/pl/hr-offers-hbg) — oferty, RACI, 11 etapów, macierz 6×11 |
| **Region domyślny (IaC)** | `europe-central2` (repozytorium `.cursorrules`, `access_matrix` w [hr-offers-hbg](/pl/hr-offers-hbg)) |

**Inne języki:** [Русский](/ru/hbg-rag-dominance) · [English](/en/hbg-rag-dominance)

---

## 1. Cel

Strona opisuje **strategiczną ramę** platformy scoringu kredytowego opartej o RAG, orchestrację (Camunda) i chmurę: po inwestujemy w zespół i technologie, jakie **funkcje** muszą być pokryte, jak biznes współpracuje z systemem. Szczegóły ról, rekrutacji i workflow technicznego — w [hr-offers-hbg](/pl/hr-offers-hbg).

---

## 2. Uzasadnienie inwestycji (skrót)

- **Niższe ryzyko operacyjne:** automatyzacja powtarzalnych decyzji przy kontroli banku nad regulaminami i danymi.
- **Odpowiedzialność i weryfikowalność:** krytyczne obszary (dane, model, infra, compliance) rozdzielone rolami; zmiany testowane i audytowane.
- **Zwrot:** ocena przez redukcję strat i błędów, nie jako obietnica „zwrotu w pierwszym roku” bez osobnego modelu finansowego.

---

## 3. Role U1–U6 (gwarancje funkcjonalne)

Każde etatowe miejsce to **punkt kontrolny**. **Job Objectives** poniżej są spójne z [hr-offers-hbg](/pl/hr-offers-hbg).

| Kod | Rola (krótko) | Cel zadaniowy |
|-----|---------------|---------------|
| **U1** | Architekt platformy / security | Suwerenność nad kodem, danymi i perymetrem; polityka dostępu; zgodność infra z bankiem i regulatorami. |
| **U2** | SRE / dostarczanie | Stabilny CI/CD, środowisko wykonania (m.in. K8s, workerzy); obserwowalność i ciągłość. |
| **U3** | ML / RAG / semantyka | Zachowanie AI zgodne z **regulaminami** banku; retrieval, prompty, łańcuchy rozumowania. |
| **U4** | Data / wiedza | Zbiór, normalizacja, odświeżanie wiedzy dla modelu; pipeline’y, magazyny, jakość danych. |
| **U5** | QA / walidacja | Niezależna weryfikacja (w tym **REF**); testy awarii i regresji względem „złota” przed PROD. |
| **U6** | Compliance / wyjaśnialność / audyt | Ślady i raporty dla kontroli wewnętrznej i regulatorów. |

**Uwaga:** w [hr-offers-hbg](/pl/hr-offers-hbg) są **cztery** otwarte role, a model operacyjny zakłada **sześć** slotów U1–U6 — część funkcji można łączyć lub outsourcingować.

---

## 4. Przepływ żądanie–wynik (interfejs biznesu)

- **Regulacje:** zmiana zasad (np. aktualizacja dokumentu) — wejście dla U3/U4/U6; celem jest **śledzialna** zmiana zachowania systemu.
- **Wyjaśnienie odmowy/akceptacji:** wyjście — protokół/ślad wystarczający dla kontroli wewnętrznej i regulatora (U3/U6; infrastruktura logów U1/U2).

---

## 5. Środowiska i dostęp (skrót)

| Środowisko | Cel | Kto (typowo) |
|------------|-----|--------------|
| **DEV** | Rozwój, eksperymenty | Dostęp inżynierski wg polityki banku |
| **REF** | Walidacja, scenariusze „złote”, stress przed PROD | U5; pozostali wg matrycy |
| **PROD** | Produkcja | Wąski krąg (np. U1, U2, U6) — szczegóły w [hr-offers-hbg](/pl/hr-offers-hbg) |

---

## 6. Macierz dostępu

Fragmenty `access_matrix` (personel, środowiska, 11 etapów, agenci) są w załącznikach w [hr-offers-hbg](/pl/hr-offers-hbg). Produkcyjne IAM i tożsamości synchronizować z korporacyjnym IdP, bez prywatnych maili w kodzie.

---

*Ustalenie formalne; w razie rozbieżności z repozytorium pierwszeństwo ma kod i aktualna macierz w `infra` / `docs-site`.*
