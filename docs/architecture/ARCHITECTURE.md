# CitizenCare — System Architecture & Technical Specification

## 1. High-Level System Architecture

CitizenCare is built as a cloud-native, layered full-stack application backed by an enterprise Quality Engineering and test automation ecosystem.

```mermaid
graph TD
    subgraph Client Tier
        A[React 19 + TypeScript SPA] -->|Vite / Tailwind / Lucide| B[Responsive Glassmorphic UI]
        B --> C[Citizen Portal]
        B --> D[Municipal Staff Queue]
        B --> E[City Admin Command Center]
        B --> F[QE Automation Dashboard]
    end

    subgraph API & Gateway Tier
        G[Express.js REST API Gateway]
        G --> H[JWT Authentication & RBAC]
        G --> I[Rate Limiting & Helmet Security]
        G --> J[Multer File Upload Validator]
        G --> K[Zod Schema Validation Middleware]
    end

    subgraph Service Tier
        L[Auth Service]
        M[Complaint Lifecycle & SLA Engine]
        N[Staff Assignment Service]
        O[Notification Service]
        P[Feedback & Satisfaction Service]
        Q[Audit & Telemetry Service]
        R[Analytics Aggregator]
    end

    subgraph Data & Storage Tier
        S[(PostgreSQL / SQLite via Prisma ORM)]
        T[Evidence Storage / Local & AWS S3]
    end

    subgraph Quality Engineering & CI/CD Layer
        U[Selenium WebDriver POM Framework]
        V[SuperTest REST API Automation]
        W[Database SQL State Validator]
        X[Jenkins CI/CD Multi-Stage Pipeline]
        Y[GitHub Actions CI Quality Gates]
    end

    A -->|HTTPS / REST JSON| G
    G --> L & M & N & O & P & Q & R
    L & M & N & O & P & Q & R --> S
    M --> T
    U & V & W --> G
    X & Y --> U & V & W
```

---

## 2. Relational Database Schema (ERD)

```mermaid
erDiagram
    User ||--o{ Complaint : "submits (Citizen)"
    User ||--o{ Complaint : "assigned to (Staff)"
    User ||--o{ StaffAssignment : "assigned"
    User ||--o{ ComplaintStatusHistory : "modifies"
    User ||--o{ Notification : "receives"
    User ||--o{ Feedback : "submits"
    User ||--o{ AuditLog : "initiates"

    Department ||--o{ ComplaintCategory : "manages"
    Department ||--o{ Complaint : "routes"
    Department ||--o{ User : "employs"

    ComplaintCategory ||--o{ Complaint : "categorizes"

    Complaint ||--o{ Attachment : "contains"
    Complaint ||--o{ ComplaintStatusHistory : "tracks"
    Complaint ||--o{ StaffAssignment : "dispatches"
    Complaint ||--o| Feedback : "reviewed by"
    Complaint ||--o{ Notification : "triggers"
```

---

## 3. Complaint State Machine Lifecycle

```mermaid
stateDiagram-v2
    [*] --> SUBMITTED: Citizen registers complaint with evidence
    SUBMITTED --> ACKNOWLEDGED: Municipal officer acknowledges receipt
    SUBMITTED --> ASSIGNED: Supervisor assigns field technician
    SUBMITTED --> REJECTED: Out of municipal jurisdiction / Duplicate

    ACKNOWLEDGED --> ASSIGNED: Supervisor dispatches technician
    ACKNOWLEDGED --> IN_PROGRESS: Technician claims and arrives on-site
    ACKNOWLEDGED --> REJECTED: Deemed invalid upon triage

    ASSIGNED --> IN_PROGRESS: Work commences on site
    ASSIGNED --> REJECTED: Field inspection proves non-actionable

    IN_PROGRESS --> RESOLVED: Work completed & evidence logged
    IN_PROGRESS --> REJECTED: Unsolvable due to legal/external constraints

    RESOLVED --> CLOSED: Citizen submits 1-5★ rating & confirms resolution
    CLOSED --> [*]
    REJECTED --> [*]
```

---

## 4. SLA Computation & Deadline Engine

Each category is bound to a strict Service Level Agreement:

| Priority Level | SLA Target | Formula | Action on Expiry |
| :--- | :--- | :--- | :--- |
| **CRITICAL** | **24 Hours** | `CreatedAt + 24 Hours` | Overdue Alert + Supervisor Escalation |
| **HIGH** | **48 Hours** | `CreatedAt + 48 Hours` | Overdue Flag in Staff Queue |
| **MEDIUM** | **72 Hours** | `CreatedAt + 72 Hours` | Prioritized in Backlog |
| **LOW** | **7 Days (168h)** | `CreatedAt + 168 Hours`| Standard Route Work Order |

---

## 5. Security & Isolation Architecture

1. **Authentication:** Stateless JSON Web Tokens (JWT) signed with HMAC SHA-256 and expiration policies.
2. **Password Hashing:** Industry-standard `bcryptjs` with 10 salt rounds. Plaintext passwords never stored or logged.
3. **RBAC Isolation:** Middleware guards ensure Citizens can only access their own private complaints, while Staff and Admin have scoped department and city-wide capabilities.
4. **Input Sanitization & Injection Immunity:** Prisma ORM parameterized queries eliminate SQL injection vulnerabilities. Zod validates request payloads at the gate.
5. **File Evidence Security:** Restricts upload extensions to `.jpg`, `.png`, `.webp`, `.pdf`, limits size to 5MB, and sanitizes filenames using random UUIDs to prevent directory traversal attacks.
