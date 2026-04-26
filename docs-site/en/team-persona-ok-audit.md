# Persona: **ok-audit** (AUDIT)

**11-slot bundle:** Sec •.  
**Purpose:** **security / compliance** slot: policy, log audit, SoD, exception governance; guardrail changes (OPA/Gatekeeper, org policy) via Git with Platform.

**Team concept:** [team-11x6-organization](/en/team-11x6-organization) · **RU:** [/ru/team-persona-ok-audit](/ru/team-persona-ok-audit)

---

## Mandate

- **Owns:** matrix interpretation for audits, **evidence** requests, risky PR review (PII, logging), alignment with U6 in [hr-offers-hbg](/en/hr-offers-hbg).  
- **Does not own:** primary feature authorship in `backend/`; not app on-call (DevOps), except compliance incidents.  
- **SoD:** under strict rules, **do not** combine with **Release** on one account.

---

## SDLC — leading phases

| Phase | Actions | Output |
|-------|---------|--------|
| **0–1** | security/privacy review | design notes |
| **2–3** | PR review `security`, PII/logging | approve / changes |
| **4–5** | spot ref config vs policy | report |
| **6** | mandatory reviewer on sensitive releases | Environment |
| **7** | sample audit trail completeness | sample set |
| **8** | leak/policy breach; BG coordination | regulator draft |
| **9** | BQ exports, immutability evidence | audit pack |

---

## GitHub

`SECURITY.md`, sensitive root policies; with Platform — `infra/` for trust-boundary changes.

---

## GCP

**Sec** slot: audit logs, policy metadata, optional read-only config sync.

---

## Anti-patterns

- **Standing** break-glass for auditors to “browse prod”.  
- Policy relaxations without a **written** trail.
