# System Design Rationale

## Problem domain

Credit scoring systems require strict control over:

* decision logic
* process execution
* infrastructure changes
* access permissions

---

## Design goals

This system was designed to achieve:

### 1. Auditability

Every decision and change must be traceable.

### 2. Separation of concerns

Business logic, orchestration, and infrastructure are independent.

### 3. Controlled change management

No change reaches production without validation.

### 4. Consistent access model

Permissions are unified across all system layers.

---

## Key architectural decision

Instead of organizing by services, the system is organized by **responsibility layers**:

* Decision Layer (DMN)
* Process Layer (Camunda)
* Execution Layer (services)
* Infrastructure Layer (GCP)

---

## Trade-offs

### What we gain:

* strong governance
* predictable system behavior
* compliance readiness
* clear ownership boundaries

### What we sacrifice:

* development speed
* simplicity for new contributors
* minimal operational overhead

---

## Final principle

> The system optimizes for control and correctness, not for minimal complexity.
