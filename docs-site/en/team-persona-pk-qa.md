# Persona: **pk-qa** (QA-TEST)

**11-slot bundle:** Tst-dev •, Tst-ref •.  
**Purpose:** **independent verification** in dev and regression in **ref**; no Pulumi; typically no admin GCP roles.

**Team concept:** [team-11x6-organization](/en/team-11x6-organization) · **RU:** [/ru/team-persona-pk-qa](/ru/team-persona-pk-qa)

---

## Mandate

- **Owns:** test plans, CI tests (trigger/review), BPMN/DMN coverage view, **ref sign-off** before release gate.  
- **Does not own:** merging to `main` without checks; no “fix pipeline” IaC hacks.

**UAT/App:** no UAT/App GCP slots — prod acceptance is **via product** (business users); pk-qa focuses **dev/ref**.

---

## SDLC — leading phases

| Phase | Actions | Output |
|-------|---------|--------|
| **1–2** | testability review | RFC comments |
| **3–4** | CI + manual API/worker/negative PII | dev report |
| **5** | full **ref** regression vs golden | ref sign-off |
| **6** | **blocking** voice on quality | release ticket status |
| **7** | optional UAT support as **consultant** | notes |
| **8** | prod defect reproduction | repro steps |
| **9** | coverage evidence for audit | trace to commit |

---

## GCP

Read/view dev/ref per policy. **No** prod mutation rights.

---

## Anti-patterns

- Shipping without **ref** regression.  
- QA with **cluster admin** on prod “for speed”.
