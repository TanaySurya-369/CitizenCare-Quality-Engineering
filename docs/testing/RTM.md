# Comprehensive Requirements Traceability Matrix (RTM)

| Req ID | User Story / Requirement | Test Case ID | Test Level | Automated Test Script | Method / Tool | Verification Result |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **REQ-AUTH-01** | User registration with unique email and bcrypt hash | `TC-AUTH-01` | API | `automation/api/tests/auth.api.spec.ts` | SuperTest / Mocha | **PASSED** |
| **REQ-AUTH-02** | JWT Token authentication & expiration | `TC-AUTH-02` | API | `automation/api/tests/auth.api.spec.ts` | SuperTest / Chai | **PASSED** |
| **REQ-AUTH-03** | RBAC role barriers (Citizen denied Admin endpoints) | `TC-SEC-01` | Security | `automation/security/rbac_security.spec.ts` | SuperTest | **PASSED** |
| **REQ-CMP-01** | Create complaint with automatic SLA deadline | `TC-CMP-01` | API / TDD | `automation/api/tests/complaints.api.spec.ts` | SuperTest / SLA Math | **PASSED** |
| **REQ-CMP-02** | Multi-part photo/document evidence attachment | `TC-CMP-02` | Integration | `automation/api/tests/complaints.api.spec.ts` | SuperTest Multipart | **PASSED** |
| **REQ-CMP-03** | State machine transitions (`SUBMITTED` -> `RESOLVED`) | `TC-CMP-03` | API | `automation/api/tests/complaints.api.spec.ts` | SuperTest State | **PASSED** |
| **REQ-STF-01** | Department queue filtering & triage | `TC-STF-01` | UI / API | `automation/ui/tests/regression/regression.ui.spec.ts` | Selenium POM | **PASSED** |
| **REQ-STF-02** | Technician work order assignment | `TC-STF-02` | API / DB | `automation/api/tests/complaints.api.spec.ts` | SuperTest / Prisma | **PASSED** |
| **REQ-FDB-01** | Citizen 1–5 star rating submission & auto-close | `TC-FDB-01` | API / DB | `automation/api/tests/feedback.api.spec.ts` | SuperTest | **PASSED** |
| **REQ-AUD-01** | Immutable audit trail logging for all mutations | `TC-AUD-01` | DB / SQL | `automation/database/tests/audit_log_db.spec.ts` | Prisma SQL Direct | **PASSED** |
| **REQ-ADM-01** | Real-time municipal KPIs & SLA compliance % | `TC-ADM-01` | API | `automation/api/tests/admin.api.spec.ts` | SuperTest | **PASSED** |
| **REQ-SEC-01** | SQL injection query sanitization immunity | `TC-SEC-02` | Security | `automation/security/sql_injection_security.spec.ts` | SuperTest / Payloads | **PASSED** |
| **REQ-E2E-01** | Full golden lifecycle from report to 5-star closure | `TC-E2E-01` | E2E | `automation/tests/e2e/complete_complaint_lifecycle.e2e.spec.ts` | SuperTest / Selenium | **PASSED** |
| **REQ-UI-01** | Selenium POM Citizen Login & Form Fill | `TC-UI-01` | UI | `automation/ui/tests/smoke/smoke.ui.spec.ts` | Selenium POM | **PASSED** |
