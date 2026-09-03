# IEEE 829 Master Test Plan: CitizenCare Platform

## 1. Test Plan Identifier
`TP-CITIZENCARE-2026-V1`

## 2. References
- CitizenCare Business Requirements Document (BRD)
- OpenAPI Specification v3.0 (`docs/api/API_SPECIFICATION.md`)
- Master Test Strategy (`docs/test-strategy/TEST_STRATEGY.md`)

## 3. Test Items & Scope
### In Scope:
- **Module 1: Authentication & Authorization:** Registration, Login, JWT session management, RBAC enforcement (`CITIZEN`, `STAFF`, `ADMIN`).
- **Module 2: Complaint Management & SLA Engine:** Creation with evidence upload, priority deadline calculation, state transitions (`SUBMITTED` -> `CLOSED`).
- **Module 3: Staff & Triage Management:** Work order claiming, technician dispatch, status updates with remarks.
- **Module 4: Feedback & Review System:** 1–5 star rating submission, duplicate prevention, automated closure.
- **Module 5: Admin Analytics & Telemetry:** System KPI aggregation, department workload distribution, SLA compliance %, real-time audit logging.
- **Module 6: Cross-Browser & Security Verification:** Chrome, Edge, Headless, SQL injection prevention, input boundary tests.

### Out of Scope:
- Production third-party SMS telephony gateway (mocked via in-app alert notification layer).

---

## 4. Test Pass / Fail Criteria
- **Unit & SLA Math Tests:** 100% Pass Rate required.
- **REST API Regression Suite:** Minimum 95% Pass Rate required.
- **Critical Security Checks:** 100% Pass Rate required.
- **Zero Critical (S1) or High (S2) Defects open at release.**

---

## 5. Environmental Requirements
- Node.js LTS (v20+)
- Google Chrome & Microsoft Edge
- PostgreSQL / SQLite with Prisma ORM
- Local / AWS S3 File Storage
