# IEEE 829-2008 Standard Master Test Plan (MTP)

**Project Name:** CitizenCare — Smart Public Service Complaint & Resolution Platform  
**Document Identifier:** `IEEE-829-MTP-CITIZENCARE-2026-V2`  
**Security Classification:** Highly Confidential / Enterprise Portfolio  
**Author:** Principal QA Automation Architect & Staff SDET  

---

## 1. Introduction & Purpose
This document establishes the Master Test Plan for the CitizenCare municipal platform. It defines the quality gates, testing scope, tools, roles, environmental requirements, and risk management strategies across the software delivery lifecycle.

---

## 2. Test Items
1. **Frontend Client:** React 19 + TypeScript Glassmorphic UI (SPA)
2. **Backend API:** Node.js Express.js REST API Gateway with JWT and RBAC
3. **SLA Computation Engine:** Dynamic priority formulas and deadline tracking
4. **Relational Database:** SQLite (Dev) / PostgreSQL 16 (Prod) via Prisma ORM
5. **Storage Layer:** Multi-part evidence upload with MIME header validation
6. **Audit & Telemetry:** Immutable event logger and real-time KPI aggregator

---

## 3. Features to be Tested
- [x] **User Management & RBAC:** Registration, login, token expiry, 401/403 barriers
- [x] **Complaint Submission:** Form validation, geolocation coordinates, evidence upload
- [x] **SLA State Transitions:** Strict sequential transitions (`SUBMITTED` -> `CLOSED`)
- [x] **Staff Triage:** Queue filtering, work order assignment, progress remarks
- [x] **Citizen Feedback:** 1–5 star rating submission and automated ticket closure
- [x] **Admin Telemetry:** Real-time city KPI calculations and audit stream logging
- [x] **Security & Integrity:** SQL injection sanitization, JWT signature tampering prevention

---

## 4. Features Not to be Tested
- Third-party physical SMS carrier gateways (mocked via internal in-app alert notification layer).

---

## 5. Testing Approach & Methodologies
- **Unit / TDD:** Mocha + Chai verifying pure SLA math and deadline calculation logic.
- **REST API Automation:** SuperTest executing against Express routes in-process.
- **Direct SQL Testing:** Zero-mock database assertions via Prisma Client.
- **UI Automation:** Selenium WebDriver with Page Object Model and explicit waits.
- **CI/CD Quality Gates:** Multi-stage Jenkins pipeline failing if test pass rate < 95% or code coverage < 80%.

---

## 6. Pass / Fail Criteria
* **Unit & SLA Engine:** 100% Pass Rate.
* **REST API & Security:** 100% Pass Rate on critical security barriers.
* **Regression Suite:** >= 95% Pass Rate.
* **Code Coverage:** >= 80% Statement and Branch Coverage.
* **Defect Threshold:** 0 Critical (S1) or High (S2) defects open.

---

## 7. Suspension & Resumption Criteria
- **Suspension:** Inability to start API server, corrupted database schema, or auth token generation failure.
- **Resumption:** Clean database re-seed (`npm run prisma:seed`) and passing smoke suite.

---

## 8. Environmental Needs
- Node.js LTS (v20+)
- Chromium, Firefox, and Edge engines
- SQLite / PostgreSQL 16
- Mochawesome HTML reporter
