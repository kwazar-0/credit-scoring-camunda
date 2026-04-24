# Infra documentation archive (2026-04-20)

This folder contains material previously under **`infra/temp/`** and the historical **Pulumi rewrite plan**, **consolidated** so **`infra/`** holds only active IaC and short pointers.

| File / folder | Contents |
|---------------|----------|
| **`ROLES.md`** | 11 rôles, matrice GCP / Pulumi / K8s / Git, guide pas-à-pas accès. |
| **`ARCHITECTURE.md`** | Isolation, OIDC, state, Pulumi as IaC. |
| **`ROLES.gke-rbac.example.md`** | Exemple de RBAC Kubernetes. |
| **`prompt-system-architecture.md`** | Spécification accès (contrôle plane, policy, GKE, données). |
| **`doc-archive-manual-secure-v2.md`** | Manuel GitHub + GCP + GKE + Pulumi (Secure v2). |
| **`PLAN-PULUMI-REWRITE.md`** | Plan historique (avant intégration du code dans `infra/pulumi/`). |
| **`README-from-infra-temp.md`** | Ancien `doc/_archive/2026-04-20/README-from-infra-temp.md` (liens mis à jour vers ce dossier). |
| **`new-acces/`** | Brouillons (YAML, script) — usage expérimental. |
| **`pulumi-snapshot-legacy/`** | Copie de travail d’un ancien arbre Pulumi; **ne pas utiliser** pour `pulumi up` — consulter **`../../infra/pulumi/`**. |

**IaC actif:** `infra/pulumi/`, `infra/pulumi/gke-infra/`.

**Не входит** в набор страниц VitePress (`docs-site/`); для чтения — только прямой доступ к файлам в репозитории.

**Voir aussi:** `../2026-04-21/manual.md` (lien de navigation vers le manuel v2, désormais ce dossier).
