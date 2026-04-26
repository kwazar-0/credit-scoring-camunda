# Кадровый капитал: спецификации ролей (HR) — HBG RAG-DOMINANCE

| Поле | Значение |
|------|----------|
| **Статус** | Внутренний; для рекрутинга и планирования |
| **Связь** | [hbg-rag-dominance](/ru/hbg-rag-dominance) — стратегия и роли U1–U6 |
| **Версия матриц** | 1.1 (см. Annex B) |
| **Организация 11×6** | [team-11x6-organization](team-11x6-organization.md) — концепция команды и шесть персон с полным SDLC |

**Другие языки:** [English](/en/hr-offers-hbg) · [Polski](/pl/hr-offers-hbg)

---

## 1. Соответствие вакансий и кодов U1–U6

В документе описаны **четыре** открытые позиции; **шесть** функциональных слотов (U1–U6) из [hbg-rag-dominance](/ru/hbg-rag-dominance) закрываются так:

| Код(ы) | Позиция в разделе 2 | Примечание |
|--------|----------------------|------------|
| U1 | Вакансия 1 — Platform Architect | — |
| U2 | *Не вынесено в отдельную вакансию в этом файле* | SRE/CI-CD: отдельный найм, расширение мандата U1 или внешний подряд — решает план |
| U3 | Вакансия 2 — Senior RAG & Semantic Architect | — |
| U4 | Вакансия 3 — Principal Data Engineer | — |
| U5 | Вакансия 4 — AI Validation & Compliance (часть функций U5) | «Инквизиция» и эталоны — U5; чисто юридическая легитимация — пересечение с U6 |
| U6 | *Частично* в вакансии 4 + отдельный Legal/аудит при необходимости | Регуляторная отчётность и BQ-трейсы — явно в JD вакансии 4 |

---

## 2. Вакансии (Job Description)

### 2.1 Вакансия 1 — Platform Architect (U1)

| | |
|---|---|
| **Локация** | Удалённо / гибрид |
| **Бюджет** | Top-tier (рынок) |
| **Job Objective** | Технологический суверенитет: защищённая, масштабируемая, аудируемая инфраструктура. |
| **Hard skills** | GCP (GKE, сеть, IAM), IaC (Pulumi/Python), Zero Trust, Workload Identity. |
| **Предложение** | Владение архитектурой «как код»; инструменты безопасности GCP по согласованной политике. |

### 2.2 Вакансия 2 — Senior RAG & Semantic Architect (U3)

| | |
|---|---|
| **Локация** | Удалённо |
| **Бюджет** | Высокий + бонус за метрики качества модели (KPI в оффере) |
| **Job Objective** | Перевод регламентов банка в устойчивые RAG- и LLM-контуры; минимизация двусмысленности и галлюцинаций. |
| **Hard skills** | Vertex (Gemini), LangGraph/LangChain/LlamaIndex (по стеку репо), pgvector (HNSW, IVFFlat), prompt/chain design. |
| **Предложение** | Работа с реальными (псевдонимизированными/согласованными) банковскими данными в рамках compliance. |

### 2.3 Вакансия 3 — Principal Data Engineer (U4)

| | |
|---|---|
| **Локация** | Удалённо / офис |
| **Бюджет** | Конкурентный |
| **Job Objective** | Пайплайны от сырых документов до структуры, пригодной для ИИ; «память» организации в актуальном виде. |
| **Hard skills** | ETL/ELT неструктурированных данных (OCR, PDF), PostgreSQL, BigQuery, Python (воркеры). |

### 2.4 Вакансия 4 — AI Validation & Compliance Officer (U5 / пересечение U6)

| | |
|---|---|
| **Локация** | Офис / гибрид |
| **Бюджет** | Фикс + бонус за снижение рисков/инцидентов (KPI в оффере) |
| **Job Objective** | Проверка решений ИИ на соответствие политике и нормам; формулирование требований к разработке; контроль объяснимости. |
| **Hard skills** | FinTech: AML/KYC/кредитные риски; SQL/BigQuery по логам; работа с юр./комплаенс-текстами. |

---

## 3. RACI (сокращённо)

| Задача | R (исполнитель) | A (подотчётный / владелец результата) |
|--------|------------------|----------------------------------------|
| Uptime инфраструктуры | Platform Architect (U1) | DevOps / SRE lead (U2) |
| Точность ответов ИИ | RAG Architect (U3) | ML lead |
| Актуальность базы знаний | Data Engineer (U4) | Data lead |
| Юридическая / регуляторная чистота | Compliance (вак. 4) | Legal / U6 по матрице банка |

*R/A в колонке «A» приведены в терминах исходного документа; в конкретной организации «A» фиксируется в реестре ролей банка.*

---

## 4. Матрица 6 агентов × функциональные блоки

| № | Код | Роль | Функциональный блок | Краткие требования |
|---|-----|------|----------------------|---------------------|
| 1 | U1 | Grand Architect | Infrastructure & security governance | GCP, Pulumi, банковский периметр |
| 2 | U2 | SRE Executor | CI/CD, Camunda-воркеры, деплой | K8s/Helm, автоматизация |
| 3 | U3 | Cognitive Designer | AI logic, RAG, качество поиска | LLM, векторы, промпты |
| 4 | U4 | Knowledge Master | ETL, индексация, данные | Неструктурированные данные, BQ/SQL |
| 5 | U5 | Inquisitor (QA) | Валидация, нагрузочные сценарии | SDET, автотесты, REF |
| 6 | U6 | Grand Auditor | Compliance, explainability, отчёты | FinTech compliance, BQ-аудит |

---

## 5. Одиннадцать этапов заявки (workflow)

Каждая заявка проходит **11 этапов**; **ответственные роли** — в колонке «Владелец» (ведущий/совместно).

| # | Этап | Суть | Владелец |
|---|------|------|----------|
| 1 | Ingestion | Сырые данные (PDF, анкеты) → GCS | U4 |
| 2 | Normalization | Очистка, единый формат | U4 |
| 3 | Embedding | Векторизация (Vertex / согласованный путь) | U3 |
| 4 | Indexing | Векторы в pgvector (напр. HNSW) | U4 |
| 5 | Orchestration | Запуск BPMN (Camunda) | U2 |
| 6 | Retrieval | Контекст по правилам банка | U3 |
| 7 | Reasoning | Сопоставление анкеты и правил (LLM) | U3 |
| 8 | Risk scoring | Итоговый балл / класс | U1/U3 (политика: кто владеет скор — фиксировать в продукте) |
| 9 | Verification | Проверка против эталонов (REF) | U5 |
| 10 | Persistence | Неизменяемая запись вердикта / аудит-трейс в БД | U2, U4 |
| 11 | Audit trace | Отчёты, в т.ч. BigQuery, для регулятора/ЦБ | U6 |

*Примечание: в черновиках «Persistence» ошибочно указывали U2/U1; фиксируем **U2 (рантайм/оркестрация записи) + U4 (данные/хранилище)**.*

---

## 6. Взаимодействия между ролями

- **Бизнес — U6:** постановка политик; контроль легитимности.
- **U3 — U4:** качество векторов и схема индекса ↔ поставка данных.
- **U2 — U1:** реализация среды и пайплайнов в рамках политики безопасности.
- **U5 — все:** независимая приёмка перед PROD (по матрице сред).

---

## 7. Annex A — `personnel_clearance` (пример)

Использовать **корпоративные** идентификаторы; не публиковать личные почты в репозитории. Плейсхолдеры заменить при внедрении. См. также [gcp-saas-access-matrix-11x6](/ru/gcp-saas-access-matrix-11x6) и [infra-pulumi-iac](/ru/infra-pulumi-iac).

```yaml
# Пример схемы; синхронизировать с gcp-saas-access-matrix / infra
infrastructure:
  provider: "Google Cloud Platform"
  security_tier: "Sovereign Financial"

personnel_clearance:
  - id: u1_architect
    status: GrandMaster
    idp_subject: "REPLACE_U1"   # корп. учётка / WIF, не email в git
  - id: u2_sre
    status: Execution_Lead
    idp_subject: "REPLACE_U2"
  - id: u3_ai_logic
    status: Cognitive_Designer
    idp_subject: "REPLACE_U3"
  - id: u4_data_master
    status: Knowledge_Custodian
    idp_subject: "REPLACE_U4"
  - id: u5_inquisitor
    status: Truth_Verifier
    idp_subject: "REPLACE_U5"
  - id: u6_auditor
    status: Legal_Shield
    idp_subject: "REPLACE_U6"

privileges:
  - environment: PROD
    control: "U1, U2, U6 (ограниченно); детализация в IAM"
  - environment: REF
    control: "U5 и согласованные сессии U3/U4"
  - environment: DEV
    control: "инженерный доступ по политике"
```

---

## 8. Annex B — этапы и агенты (машиночитаемо)

`competencies_covered: 11` — инвариант: шесть агентов покрывают контрольные точки 11-этапного процесса (не обязательно 1:1 FTE).

```yaml
# HBG RAG-DOMINANCE — control matrix (логическая, не production IAM)
project_id: hbg-rag-dominance
region: europe-central2
competencies_covered: 11

stages:
  1: { name: Ingestion,        primary: U4 }
  2: { name: Normalization,    primary: U4 }
  3: { name: Embedding,        primary: U3 }
  4: { name: Indexing,         primary: U4 }
  5: { name: Orchestration,    primary: U2 }
  6: { name: Retrieval,        primary: U3 }
  7: { name: Reasoning,        primary: U3 }
  8: { name: Risk_scoring,     primary: [U1, U3] }
  9: { name: Verification,     primary: U5 }
  10: { name: Persistence,      primary: [U2, U4] }
  11: { name: Audit_trace,      primary: U6 }

agents:
  - id: u1_architect
    clearance: GrandMaster
    gcp_binding_note: "Минимально необходимые роли; не roles/owner в PROD без обоснования"
    k8s_access: cluster-admin   # или сужение по неймспейсам
  - id: u2_sre
    clearance: Execution_Lead
    gcp_binding_note: "container, артефакты, среда выполнения"
    k8s_access: edit
  - id: u3_ml_designer
    clearance: Cognitive_Designer
    gcp_binding_note: "aiplatform, storage read, согласовано с данными"
    k8s_access: edit
  - id: u4_data_custodian
    clearance: Resource_Master
    gcp_binding_note: "storage, bigquery data — по зонам ответственности"
    k8s_access: view
  - id: u5_inquisitor
    clearance: Truth_Verifier
    gcp_binding_note: "read-only + REF; без prod-данных без разрешения"
    k8s_access: edit
  - id: u6_auditor
    clearance: Legal_Shield
    gcp_binding_note: "metadata, логи, отчёты BQ"
    k8s_access: view
```

---

## 9. Риски при незакрытых ролях (сводка)

| Отсутствует | Типичный риск |
|-------------|----------------|
| U3 | Неконтролируемое качество LLM/RAG |
| U6 | Несоответствие регуляторным и внутренним требованиям к объяснимости |
| U1 | Неуправляемая поверхность атаки / доступы |
| U5 | Дефекты логики до PROD, регрессии |

---

*Конец документа.*
