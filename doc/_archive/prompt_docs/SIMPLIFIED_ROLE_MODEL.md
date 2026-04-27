# Role Model (Simplified)

## Core idea

The system defines **responsibility-based access control**, not job-based access.

---

## Core roles (high-level view)

| Role     | Responsibility         |
| -------- | ---------------------- |
| Business | Defines scoring rules  |
| Engineer | Implements services    |
| Platform | Manages infrastructure |
| Operator | Monitors runtime       |

---

## Extended model (11×6)

The full model refines responsibilities into:

* 11 functional roles
* 6 operational domains

This allows precise control over:

* who can change business logic
* who can deploy infrastructure
* who can modify workflows
* who can access runtime systems

---

## Why this exists

Traditional RBAC fails in regulated systems because:

* responsibilities overlap
* access is too broad
* audit trails are unclear

This model enforces:

> explicit ownership of every system layer

---

## Principle

> A role is not a permission bundle.
> A role is a boundary of responsibility.
