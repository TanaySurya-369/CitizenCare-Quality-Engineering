# Test Cases Catalog & Requirements Traceability Matrix (RTM)

## 1. Requirements Traceability Matrix (RTM)

| Requirement ID | Description | Test Case ID | Test Type | Automation Script | CI/CD Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **REQ-AUTH-001** | User registration with email uniqueness & password hash | `TC-AUTH-001` | API | `automation/tests/api/auth.api.spec.ts` | **PASS** |
| **REQ-AUTH-002** | JWT Token authentication & expiration handling | `TC-AUTH-002` | API | `automation/tests/api/auth.api.spec.ts` | **PASS** |
| **REQ-AUTH-003** | RBAC 403 Forbidden barrier enforcement | `TC-AUTH-003` | Security | `automation/tests/api/security.api.spec.ts` | **PASS** |
| **REQ-CMP-001** | Complaint creation with category SLA calculation | `TC-CMP-001` | API / TDD | `backend/tests/unit/sla.spec.ts` | **PASS** |
| **REQ-CMP-002** | File evidence upload & MIME header validation | `TC-CMP-002` | Integration | `automation/tests/api/complaints.api.spec.ts` | **PASS** |
| **REQ-CMP-003** | Complaint lifecycle state machine validation | `TC-CMP-003` | API | `automation/tests/api/complaints.api.spec.ts` | **PASS** |
| **REQ-STF-001** | Staff triage & department dispatch | `TC-STF-001` | API / DB | `automation/tests/api/assignments.api.spec.ts` | **PASS** |
| **REQ-FDB-001** | Citizen 1–5 star rating submission & auto-close | `TC-FDB-001` | API | `automation/tests/api/feedback.api.spec.ts` | **PASS** |
| **REQ-AUD-001** | Real-time immutable audit trail logging | `TC-AUD-001` | DB / SQL | `automation/tests/database/database.spec.ts` | **PASS** |
| **REQ-UI-001** | Selenium POM Citizen Login & Form Fill | `TC-UI-001` | UI | `automation/tests/ui/login.ui.spec.ts` | **PASS** |
| **REQ-E2E-001** | Full Golden User Lifecycle Journey | `TC-E2E-001` | E2E | `automation/tests/e2e/complete_complaint_lifecycle.e2e.spec.ts` | **PASS** |

---

## 2. Key Automated Test Case Scenarios

### TC-AUTH-001: Register New Citizen
- **Precondition:** User email does not exist in DB.
- **Steps:** Send POST `/api/auth/register` with valid name, email, password.
- **Expected:** HTTP 201 Created, JWT token returned, password hash not exposed in body.

### TC-CMP-001: Create Complaint & Verify SLA Calculation
- **Precondition:** Authenticated Citizen JWT token.
- **Steps:** Send POST `/api/complaints` with HIGH priority.
- **Expected:** HTTP 201 Created, `expectedResolutionDate` equals `CreatedAt + 48 hours`.

### TC-E2E-001: Golden Lifecycle Journey
- **Precondition:** Seeded database with Citizen, Staff, Admin.
- **Steps:**
  1. Citizen creates complaint.
  2. Database validates `status = 'SUBMITTED'`.
  3. Admin assigns Staff technician (`status = 'ASSIGNED'`).
  4. Staff starts work (`status = 'IN_PROGRESS'`).
  5. Staff marks resolved (`status = 'RESOLVED'`).
  6. Citizen rates 5 stars (`status = 'CLOSED'`).
  7. Admin analytics reflects updated satisfaction and resolution metrics.
- **Expected:** 100% test pass with zero data corruption.
