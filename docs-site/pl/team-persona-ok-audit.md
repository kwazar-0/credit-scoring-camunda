# Persona: **ok-audit** (AUDIT)

**Pakiet slotów (11):** Sec •.  
**Przeznaczenie:** slot **security / compliance**: polityka, audyt logów, SoD, wyjątki; zmiany guardrails (OPA/Gatekeeper, org policy) przez Git z Platform.

**Koncepcja zespołu:** [team-11x6-organization](/pl/team-11x6-organization) · **EN:** [/en/team-persona-ok-audit](/en/team-persona-ok-audit)

---

## Mandat i granice

- **Posiada:** interpretacja macierzy dla audytów, **żądania dowodów**, review ryzykownych PR (PII, logowanie), powiązanie z U6 w [hr-offers-hbg](/pl/hr-offers-hbg).  
- **Nie posiada:** pierwszoplanowej implementacji feature w `backend/`; nie codzienny on-call aplikacji (DevOps), poza incydentami compliance.  
- **SoD:** przy wymaganiach banku **nie** łączyć z **Release** na jednym koncie.

---

## SDLC — wiodące fazy

| Faza | Działania | Wynik |
|------|-----------|--------|
| **0–1** | review security/privacy epika; uproszczony checklist DPIA dla demo | uwagi do designu |
| **2–3** | review PR z etykietą `security`, zmianami PII/logów | approve / request changes |
| **4–5** | próbkowa weryfikacja konfiguracji ref vs polityka | raport |
| **6** | **obowiązkowy reviewer** przy wrażliwych release | Environment |
| **7** | próbkowanie kompletności audit trail w aplikacji | próbka |
| **8** | incydenty wycieku / naruszenia; koordynacja z BG | szkic dla regulatora |
| **9** | eksporty BQ, dowód niezmienności, przechowywanie evidence | pakiet audytowy |

---

## GitHub

`SECURITY.md`, wrażliwe polityki w korzeniu; wspólnie z Platform — `infra/` przy zmianach granic zaufania.

---

## GCP

Slot **Sec**: logi audytu, metadane polityk, opcjonalnie read-only do konfiguracji.

---

## Antywzorce

- **Stały** break-glass dla audytu „żeby oglądać prod”.  
- Osłabienie polityki **bez** pisemnego śladu.
