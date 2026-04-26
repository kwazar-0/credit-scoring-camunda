# Team organisation: 11 logical roles × 6 accounts (concept)

**Status:** reference model for HBG / demo contour; align with your bank’s policy.  
**Related:** [gcp-saas-access-matrix-11x6](/en/gcp-saas-access-matrix-11x6) (access matrix), [github-codeowners-matrix](/en/github-codeowners-matrix), [hr-offers-hbg](/en/hr-offers-hbg) (U1–U6, RACI, 11 loan stages).

**Languages:** [Русский](/ru/team-11x6-organization) · [Polski](/pl/team-11x6-organization)

---

## 1. Why “11 × 6”

Auditors ask **who can change what** and **where accountability breaks**. Two axes answer different questions:

| Axis | What it measures | Question answered |
|------|------------------|-------------------|
| **11 slots** | *Access functions* to cloud, CI, data | “What is the smallest privilege set a *role* needs?” |
| **6 accounts** | *People* (or service principals) in IdP / GitHub | “How do we bundle slots without hiring 11 people or breaking SoD?” |

**11** is not “11 employees”; it is a **canonical duty set**. **6** is a practical starter bundle; each bundle has a dedicated [persona page](#6-persona-pages-full-sdlc).

**Invariant:** bind **IAM in prod to Google Groups**; offboarding = remove group membership, not hunt 40 `roles/*` on a project.

---

## 2. Three layers (do not confuse)

1. **Layer A — duty (11 slots):** Platform, Dev, Tst-dev, Tst-ref, UAT, App, Sec, BG, Release, Data, ML.  
2. **Layer B — account / persona (6 people):** who carries which bundle day to day.  
3. **Layer C — artefacts:** GitHub/CODEOWNERS, GCP IAM/groups, Camunda/product.

U1–U6 from [hbg-rag-dominance](/en/hbg-rag-dominance) / [hr-offers-hbg](/en/hr-offers-hbg) is another **slice** (product “owners”); map it to the 11 slots in your role registry — do not replace one with the other.

---

## 3. SDLC as the golden thread

The same SDLC runs for the whole team; **different personas lead different phases**. General pipeline; per-persona detail on their pages.

| Phase | Meaning | Typical slot owners | Artefacts |
|-------|---------|---------------------|-----------|
| **0. Initiation** | epic scope, risks, data | Platform + Sec | ADR, light threat model |
| **1. Design** | API contracts, schemas, BPMN | Dev, Data, ML | OpenAPI, DMN, index design |
| **2. Build** | code, dev IaC | Dev, Data, ML, Platform | PRs to `develop` |
| **3. Dev integration** | compose / dev cluster | Dev, Platform | CI green, dev namespace |
| **4. Dev verification** | functional + early RAG | Tst-dev | CI reports |
| **5. Ref / staging** | regression, compatibility | Tst-ref, Release (partial) | release branches, tags per [git-workflow](/en/git-workflow) |
| **6. Prod gate** | SoD on Environment approve | Release, Sec (policy) | GitHub `production` |
| **7. UAT** | business acceptance in product | UAT (no GCP console slot) | Tasklist, Streamlit |
| **8. Operate** | SLO, incidents | Platform, BG on event | runbooks, postmortems |
| **9. Audit** | trails, BQ, policy | Sec, App as subject | logs, regulator exports |

**UAT** and **App** deliberately have **no** GCP-console row — authority lives in **application IdP** and business process.

---

## 4. SoD — hard and soft rules

| Rule | Intent | Anti-pattern |
|------|--------|--------------|
| Release ≠ sole developer | prod approve belongs to **Release**; author does not self-approve Environment | one human = Dev + Release with no second party |
| Sec does not ship prod app “for speed” | policies via Git/OPA; Sec reviews | Sec with `container.admin` + direct deploy |
| BG is not standing access | ticket, TTL, revoke | permanent break-glass login |
| Data/ML do not admin GKE in prod | ingest/models use scoped SAs | `container.admin` “for convenience” |

In this training repo GitHub users may overlap; in a bank prod that is often **forbidden** — the matrix remains the target shape.

---

## 5. Four GitHub teams (from prompt)

| Team | Purpose | Typical personas |
|------|---------|------------------|
| `platform` | infra, CI, cluster | ok-admin, gw-devops |
| `engineers` | app, data, ML | ux-dev, sh-dev |
| `quality` | test, release control | pk-qa + Release persona |
| `compliance` | policy, audit | ok-audit + Sec overlap from gw-devops |

Teams are **review granularity**; they do not replace **GCP groups**.

---

## 6. Persona pages (full SDLC)

| Persona | Label | Page |
|---------|-------|------|
| **ok-admin** | ADMIN | [team-persona-ok-admin](/en/team-persona-ok-admin) |
| **gw-devops** | DEVOPS | [team-persona-gw-devops](/en/team-persona-gw-devops) |
| **ux-dev** | DEV-UX | [team-persona-ux-dev](/en/team-persona-ux-dev) |
| **sh-dev** | DEV-SH | [team-persona-sh-dev](/en/team-persona-sh-dev) |
| **pk-qa** | QA-TEST | [team-persona-pk-qa](/en/team-persona-pk-qa) |
| **ok-audit** | AUDIT | [team-persona-ok-audit](/en/team-persona-ok-audit) |

---

## 7. Link to 11 loan lifecycle stages

[hr-offers-hbg](/en/hr-offers-hbg) lists ingestion → audit trace. The **11×6 team** **enables** those stages; maintain a **traceability matrix**: loan stage → slot → IAM group → owning persona.

---

## 8. Rollout checklist

1. Name **GCP groups** aligned to slots (or a subset for MVP).  
2. Move bindings from humans to **groups**.  
3. Configure **GitHub Environments** + required reviewers for Release/Sec.  
4. Document **BG runbook** (approver, TTL, logging).  
5. Run a **tabletop**: each persona walks one mini-epic through their SDLC page.

**Next:** [gcp-saas-access-matrix-11x6](/en/gcp-saas-access-matrix-11x6) for “what each slot may do in GCP”.
