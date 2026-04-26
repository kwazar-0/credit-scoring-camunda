# Persona: **gw-devops** (DEVOPS)

**11-slot bundle:** Platform •, Sec ○, **BG on-call**, Release ○.  
**Purpose:** **operational** platform: CI/CD, cluster, secrets, incidents; with Sec as “second pair of eyes” on policy.

**Team concept:** [team-11x6-organization](/en/team-11x6-organization) · **RU:** [/ru/team-persona-gw-devops](/ru/team-persona-gw-devops)

---

## Mandate

- **Owns:** GitHub Actions, OIDC→GCP, Helm for Camunda/GKE, deploy runbooks, **BG** on-call (elevation per runbook only).  
- **Does not own:** DMN business rules; primary authorship of scoring logic in `backend/` (platform review yes, ownership — Dev).

---

## SDLC — leading phases

| Phase | Actions | Outcome |
|-------|---------|---------|
| **0–1** | capacity, secrets, Zeebe↔worker↔backend wiring | service diagram |
| **2–3** | PRs `infra/pulumi/`, `k8s/`, workflows; dev NS, WI | green CI, `pulumi preview` in PR |
| **4** | enable dev testers (logs, port-forward), not replace QA | `infra/scripts/` |
| **5** | promote images to ref; tags per [git-workflow](/en/git-workflow) | GAR images |
| **6** | release gate as deploy executor or reviewer per matrix | Environment |
| **8** | incidents; **BG**: temporary elevate, log, revoke | postmortem |
| **9** | redacted config export for audit | manifests |

---

## GitHub

CODEOWNERS: `infra/`, `k8s/`, `.github/workflows/`, compose, `Makefile`. [github-setup](/en/github-setup).

---

## GCP

GKE admin **within** policy; avoid broad Editor on prod. Pulumi runs after **ok-admin** / state policy.

---

## Anti-patterns

- Long-lived CI **JSON keys** instead of OIDC/WIF.  
- `kubectl` hotfixes in prod without a GitOps trace.
