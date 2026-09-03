# CitizenCare – Smart Public Service Complaint & Resolution Platform

> "I didn't just build an application.
> I engineered the quality system around the application."

🚀 Enterprise Civic-Tech Platform | React + TypeScript | Node.js | Selenium WebDriver | SuperTest | CI/CD | Docker | AWS | Quality Engineering & Test Automation Showcase

CitizenCare is a production-inspired civic technology platform that enables citizens to report public infrastructure issues, track SLA-driven resolutions, and interact with municipal departments through a modern enterprise architecture.

This project demonstrates full-stack engineering, quality engineering, automated testing, security validation, CI/CD, cloud deployment, and enterprise-grade software delivery practices.

[![CI/CD Pipeline](https://img.shields.io/badge/CI%2FCD-Passing-emerald?style=for-the-badge&logo=jenkins)](./deployment/jenkins/Jenkinsfile)
[![Quality Gate](https://img.shields.io/badge/Quality_Gate-100%25_Pass-blueviolet?style=for-the-badge&logo=shieldcheck)](./docs/test-strategy/TEST_STRATEGY.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React_19-Vite_6-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Prisma_ORM-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.prisma.io/)
[![Selenium WebDriver](https://img.shields.io/badge/Selenium_POM-TypeScript-43B02A?style=for-the-badge&logo=selenium&logoColor=white)](https://www.selenium.dev/)
[![SuperTest](https://img.shields.io/badge/SuperTest-REST_Automation-FF6C37?style=for-the-badge&logo=postman&logoColor=white)](https://github.com/ladjs/supertest)

> **"I didn't just build an application. I engineered the quality system around the application."**  
> — A portfolio-grade civic technology platform combining full-stack architecture and principal-level quality engineering.

---

## 🏛️ Project Vision & Purpose

Traditional public service complaint systems suffer from poor tracking, slow resolution times, lack of transparency, and inadequate automated quality gates. 

**CitizenCare** bridges this gap by connecting citizens with municipal departments (Roads, Water, Sanitation, Power, Parks) through a real-time SLA-monitored complaint lifecycle, backed by an enterprise-grade automated testing ecosystem.

---

## 🚀 Quickstart Guide

### 1. Automated Setup & Database Seeding
```bash
# Using Bash (Linux/macOS)
./scripts/install.sh

# Or using PowerShell (Windows)
.\scripts\install.ps1
```

### 2. Start Development Servers
```bash
# Terminal 1: Backend API (http://localhost:5000)
cd backend && npm run dev

# Terminal 2: Frontend Client (http://localhost:5173)
cd frontend && npm run dev
```

### 3. Run Automated Quality Engineering Test Suites
```bash
# Run All Automated Test Suites (Unit, REST API, Database SQL, E2E)
cd automation && npm test

# Run Specific Test Suites
npm run test:api     # SuperTest REST API Suite
npm run test:db      # Direct SQL Database State Validation
npm run test:e2e     # Complete E2E Golden Lifecycle Journey
npm run test:ui      # Selenium WebDriver POM UI Suite
```

---

## 🔑 Interactive Persona Credentials (Pre-Seeded)

The web application includes **1-Click Quick Fill** buttons on the login screen for rapid evaluator testing:

| Role | Email | Password | Responsibilities |
| :--- | :--- | :--- | :--- |
| 👤 **Citizen** | `citizen@citizencare.gov` | `Citizen@123` | Report problems, upload photo evidence, track live SLA countdown, submit 5★ reviews |
| 👷 **Staff (Roads)** | `staff.roads@citizencare.gov` | `Staff@123` | Triage road work orders, update progress, attach resolution evidence |
| ⚡ **Staff (Power)** | `staff.power@citizencare.gov` | `Staff@123` | Streetlight & electrical grid repair work order management |
| 👑 **City Admin** | `admin@citizencare.gov` | `Admin@123` | System-wide KPIs, department workload distribution, SLA compliance charts, live audit log stream |

---

## 📐 High-Level Architecture

```
                               ┌─────────────────────────┐
                               │   Citizens & Officials  │
                               └────────────┬────────────┘
                                            │
                                            ▼
                               ┌─────────────────────────┐
                               │ React 19 + TypeScript   │
                               │ Glassmorphism Frontend  │
                               └────────────┬────────────┘
                                            │ REST / JSON
                                            ▼
                               ┌─────────────────────────┐
                               │ Node.js + Express.js    │
                               │ Layered REST API        │
                               └────────────┬────────────┘
                                            │
             ┌──────────────────────────────┼──────────────────────────────┐
             ▼                              ▼                              ▼
    ┌─────────────────┐            ┌─────────────────┐            ┌─────────────────┐
    │  PostgreSQL /   │            │ Notification    │            │ File Storage /  │
    │  Prisma ORM     │            │ Alert Engine    │            │ Local & AWS S3  │
    └─────────────────┘            └─────────────────┘            └─────────────────┘
                                            ▲
                                            │
     QUALITY ENGINEERING & CONTINUOUS INTEGRATION / CONTINUOUS DELIVERY (CI/CD)
    ┌───────────────────────────────────────────────────────────────────────────────┐
    │ • Selenium WebDriver POM (TypeScript) • SuperTest REST API Automation         │
    │ • Direct SQL State Validation         • Mochawesome HTML Execution Reports    │
    │ • Multi-Stage Jenkinsfile Pipeline    • GitHub Actions Quality Gates          │
    └───────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔬 Quality Engineering & Automation Capabilities

* **Page Object Model (POM):** Fully type-safe page objects (`LoginPage`, `CitizenDashboardPage`, `NewComplaintPage`, `ComplaintDetailPage`, `StaffDashboardPage`, `AdminDashboardPage`) strictly decoupled from test assertions.
* **Explicit Wait Strategies:** Zero arbitrary `sleep()` statements. Explicit condition polling with configurable timeout thresholds.
* **Failure Evidence Capture:** Automated high-resolution screenshot generation on exceptions.
* **Mochawesome HTML Reporting:** Generates detailed execution reports with pass/fail metrics, timestamps, and failure logs in `automation/reports/`.
* **Zero-Mock Database Validation:** Direct SQL validation asserts transactional integrity, foreign key relations, and immutable audit logs.
* **Postman Artifacts:** Ready-to-import `CitizenCare.postman_collection.json` and `CitizenCare.postman_environment.json`.

---

## 💼 LSEG / Tier-1 Interview Mastery & Talking Points

| Question | Technical Answer |
| :--- | :--- |
| **Why Selenium WebDriver over Protractor?** | Protractor historically relied on AngularJS `$http` digest loop hooks. With Protractor's official deprecation in 2022 and modern SPAs (React 19, Vite), raw Selenium WebDriver in TypeScript with explicit wait strategies provides superior cross-browser resilience, W3C standard adherence, and long-term maintainability. |
| **Why SuperTest for REST API automation?** | SuperTest executes in-process directly against Express route stacks in milliseconds without network serialization overhead, making it 10x faster for CI quality gates while maintaining identical HTTP contract assertions. |
| **How are SLA deadlines computed?** | Priority formulas (`CRITICAL`: 24h, `HIGH`: 48h, `MEDIUM`: 72h, `LOW`: 7d) dynamically calculate resolution target timestamps upon ticket creation. Background telemetry flags tickets as `BREACHED` once deadlines pass without resolution. |
| **How are CI Quality Gates enforced?** | The Jenkins multi-stage pipeline enforces a strict Quality Gate threshold: if unit, API, or critical regression suites drop below **95% pass rate**, downstream deployment to staging/production is blocked. |

---

## 📁 Repository Structure

```
CitizenCare/
├── frontend/                     # React 19 + TypeScript + Vite + Tailwind CSS + Lucide
├── backend/                      # Node.js + Express.js + TypeScript + Prisma ORM
├── automation/                   # Selenium POM + SuperTest + Mocha/Chai + Reports
│   ├── pages/                    # Page Object Model classes
│   ├── tests/api/                # SuperTest REST API suites
│   ├── tests/ui/                 # Selenium WebDriver UI suites
│   ├── tests/e2e/                # Golden lifecycle user journeys
│   ├── tests/database/           # SQL state validation
│   ├── postman/                  # Postman collection & environment files
│   ├── bdd/                      # Gherkin .feature specifications
│   └── reports/                  # Generated Mochawesome HTML reports
├── deployment/                   # Docker Compose, Jenkinsfile, GitHub Actions, AWS Blueprints
├── docs/                         # Architecture, API Spec, Test Strategy, IEEE 829 Plan, RTM, Protractor Guide
└── scripts/                      # Cross-platform runner scripts (install, start, test, seed)
```

---

## 📖 Comprehensive Documentation Links

- 🏛️ [System Architecture & ERD Diagram](docs/architecture/ARCHITECTURE.md)
- 🧪 [Master Test Strategy](docs/test-strategy/TEST_STRATEGY.md)
- 📋 [IEEE 829 Master Test Plan](docs/test-plan/TEST_PLAN.md)
- 🎯 [Requirements Traceability Matrix (RTM) & Test Cases](docs/test-cases/TEST_CASES_AND_RTM.md)
- 📡 [REST API Specification (OpenAPI Reference)](docs/api/API_SPECIFICATION.md)
- 💡 [Protractor vs Modern Selenium Interview Masterclass](docs/protractor-vs-selenium/PROTRACTOR_VS_SELENIUM.md)
- ☁️ [AWS Cloud Architecture & Deployment Runbook](docs/deployment/AWS_DEPLOYMENT_GUIDE.md)
- 📘 [Interactive User Manual](docs/user-guide/USER_GUIDE.md)

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
