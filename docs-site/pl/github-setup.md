# GitHub: konfiguracja i governance — Handlowy Bank Galicyjski (HBG) enterprise

Techniczny wzorzec dla **11 ról** logicznych i procesów dostępu w repozytorium **Handlowy Bank Galicyjski (HBG)** (gałęzie i legacy: **[branch-notes.md](branch-notes.md)**).

**Zastąp puste miejsca:** wszędzie `@org/...` → prawdziwa **organizacja GitHub** (np. `@HBG-Org/platform-admin`).

**Gałęzie:** **`main`** — produkcja (i **default branch**); **`develop`** — integracja. Przepływ: **[git-workflow.md](git-workflow.md)**.

## 1. Struktura zespołów (Teams)

Używamy **zespołów** zamiast uprawnień per użytkownik; jedna osoba może być w wielu.

| Zespół GitHub | Role (z `ROLES.md`) | Dostęp do repo |
| :------------ | :------------------ | :------------- |
| **`@org/platform-admin`** | DevOps, SRE, cloud, security | **Admin** |
| **`@org/engineers`** | Dev, ML, data | **Write** |
| **`@org/quality-gate`** | Tst dev/ref, UAT, release | **Read** (ew. write w `/tests`) |
| **`@org/compliance`** | Security / compliance | **Read** |

---

## 2. Ochrona gałęzi

### Gałąź: `main` (produkcja)
* **Require PR before merge:** wł.
* **Wymagane aprobata:** min. 2 (jedna od `@org/platform-admin`, jedna od `@org/quality-gate`).
* **Code owners:** obowiązkowa zgoda właścicieli ścieżek.
* **Ograniczenie push:** tylko automatyzacja (CI/CD), zgodnie z polityką.

### Gałąź: `develop`
* **Require PR:** wł.
* **Aprobaty:** 1 (dowolny z `@org/engineers` lub `@org/platform-admin`).
* **Status checks:** testy i lintery.

---

## 3. CODEOWNERS

Plik `.github/CODEOWNERS` przypisuje strefy odpowiedzialności.

```text
/infra/                @org/platform-admin
/data/                 @org/engineers
/backend/              @org/engineers @org/quality-gate
```

Dopasuj ścieżki do realnego drzewa (`bpmn/`, `docs-site/`, itd.).

---

## 4. Środowiska (Environments)

*Settings → Environments* — sekrety GCP i zasady aprobat.

### **`development`**
* **Branch wdrożenia:** `develop`.
* **Reviewers:** brak (auto po merge, jeśli tak ustalicie).

### **`reference` (staging)**
* **Branch:** `release/*`, `develop`.
* **Reviewers:** `@org/quality-gate` (ref-tester).
* **Cel:** regres przed prodem.

### **`production`**
* **Branch:** `main`.
* **Reviewers:** zgodnie z SoD (np. quality + platform).

### **Incydenty (break-glass)**
Czasowy token SRE, ewent. **emergency override** w GitHub, post-incident review u security.

---

## 5. CI/CD (Actions)
* `secrets.GCP_SA_DEV` tylko w `development`.
* `secrets.GCP_SA_PROD` tylko w `production` z aprobatami.

---

**Podsumowanie:** 11 ról mapuje się na 4 zespoły i 3 środowiska jako bramki; widać, kto kodował, kto sprawdzał, kto dopuszcza produkcję.
