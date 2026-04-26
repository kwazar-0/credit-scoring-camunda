# Persona: **ok-admin** (ADMIN)

**11-slot bundle:** Platform •, Release ○.  
**Purpose:** **organisational** and **project** GCP perimeter, policy baselines, dangerous-change governance; **not** day-to-day application coding.

**Team concept:** [team-11x6-organization](/en/team-11x6-organization) · **RU:** [/ru/team-persona-ok-admin](/ru/team-persona-ok-admin)

---

## Mandate

- **Owns:** folder/project layout, quotas, org-level approvals, billing linkage, environment naming SoT.  
- **Does not own:** RAG prompt details, DMN schema (except architectural veto), sole application releases if SoD requires a separate Release approver.

---

## SDLC — leading phases

| Phase | Actions | Artefacts |
|-------|---------|-----------|
| **0–1** | new GCP surface, region, residency; project creation | ADR, API enablement list |
| **2–3** | review `infra/`, `k8s/` PRs for blast radius | CODEOWNERS approval |
| **4–5** | ref quotas / network boundaries; sandbox vs prod state | env checklist |
| **6** | second voice or Environment owner per bank policy | GitHub Environment |
| **8** | IAM escalations, org policy | tickets, IAM audit export |
| **9** | evidence packs for external audit | group ↔ role diagrams |

---

## GitHub

Paths: `infra/`, root policies, `SECURITY.md` as needed. [github-codeowners-matrix](/en/github-codeowners-matrix).

---

## GCP

Resource Manager–level bindings to **groups**; avoid personal **Owner** on prod for the whole team. Pulumi **state bucket** is a controlled zone.

---

## Interactions

| With | Topic |
|------|-------|
| **gw-devops** | delegate `pulumi up` within approved modules |
| **ok-audit** | policy exceptions — written + time-bound |
| **ux-dev / sh-dev** | Vertex API / quota requests via formal intake |

---

## Anti-patterns

- Granting self **Owner** on prod “for debugging”.  
- One huge PR changing network **and** data without split / Sec where sensitive.
