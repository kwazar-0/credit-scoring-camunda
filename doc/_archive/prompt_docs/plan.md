# 🧠 Что делать дальше (конкретный план)

## 1. Слой №1 — “2-minute understanding”

Сейчас его нет. Это главный баг.

Добавь на главную:

```text
## What is this project?

A demonstration of a credit scoring platform built with:

- Camunda (workflow orchestration)
- GCP (cloud infrastructure)
- Pulumi (infrastructure as code)
- Strict governance model (roles + access matrix)

Goal: show how regulated systems can be structured safely and predictably.
```

👉 Это убивает 80% непонимания сразу.

---

## 2. Слой №2 — “one mental model diagram”

У тебя сейчас много текста, мало модели.

Добавь один блок:

```text
User → API → Camunda Process → Workers → Decision (DMN) → Result
                 ↓
           GCP Infrastructure (Pulumi-managed)
```

👉 Человек должен понять систему за 5 секунд глазами.

---

## 3. Слой №3 — “simplified role model”

Твоя 11×6 модель правильная, но перегружает вход.

Сделай так:

### Core roles (must understand)

* Business (rules)
* Engineer (implementation)
* Platform (infrastructure)
* Operator (runtime)

### Extended model

→ ссылка на 11×6

👉 Важно: не убрать сложность, а **спрятать её за уровнем детализации**

---

## 4. Слой №4 — “how to run it”

Сейчас у тебя архитектура сильнее, чем UX запуска.

Добавь:

```bash
make up
make deploy
make test
```

И ожидаемый результат.

👉 Это превращает проект из “теории” в “живую систему”.

---

## 5. Слой №5 — “why this exists”

Один блок, без воды:

```text
Why this architecture exists:

- Credit scoring systems require auditability
- Infrastructure changes must be controlled
- Business logic must be separated from execution
- Access must be explicitly governed

This system enforces these constraints by design, not by process.
```

---

## 6. Слой №6 — “don’t scare the reader”

Удалить из первой страницы:

* 11×6 детали
* GCP stack breakdown
* deep IAM matrix

👉 это всё должно быть ниже

---

# 🧨 Самое важное изменение мышления

Сейчас у тебя:

> “я показываю систему”

Нужно:

> **“я направляю читателя в систему”**

---

# ⚖️ Архитектура документации (как должно быть)

## Level 0 — Landing page

* что это
* зачем
* как выглядит система

## Level 1 — Mental model

* 1 схема
* 4 компонента

## Level 2 — How it works

* Camunda flow
* infra overview
* git workflow

## Level 3 — Governance (11×6)

* детали доступа
* роли
* IAM

## Level 4 — Deep infra

* Pulumi stacks
* GCP details
* runtime internals

