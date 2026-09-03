# Master Test Strategy: CitizenCare Platform

## 1. Executive Summary

The CitizenCare Quality Engineering framework is engineered as a first-class citizen of the software delivery lifecycle, applying the **Test Pyramid Principle** across all layers of the application stack.

```
       / \
      /   \      E2E User Journeys (10+ Golden Scenarios)
     / E2E \
    /-------\
   /   UI    \   Selenium WebDriver + Page Object Model (40+ Tests)
  /-----------\
 /  API / DB   \  SuperTest REST + Direct SQL Verification (50+ Tests)
/---------------\
|   Unit / TDD  | Pure Math & SLA Engine Domain Tests (20+ Tests)
-----------------
```

---

## 2. Test Pyramid Breakdown & Tooling

| Test Level | Scope | Primary Framework | Execution Speed | CI/CD Frequency |
| :--- | :--- | :--- | :--- | :--- |
| **Unit / TDD** | Pure business logic, SLA math, deadline algorithms | Mocha + Chai + TypeScript | < 50ms | Every Commit & PR |
| **API Automation** | REST endpoints, JWT auth, RBAC barriers, boundary cases | SuperTest + Mocha + Chai | < 100ms per endpoint | Every Commit & PR |
| **Database Testing** | SQL table state, foreign key integrity, audit trail logging | Prisma Client / Direct SQL | < 200ms | Every PR & Nightly |
| **UI Automation** | Browser workflows, form interactions, error alerts | Selenium WebDriver + POM | 1–3s per scenario | Nightly & Pre-Release |
| **E2E Journeys** | Golden end-to-end user lifecycle across all personas | SuperTest + Selenium E2E | 2–5s per flow | Merge to Main & Release |

---

## 3. Automation Framework Design Principles

1. **Page Object Model (POM):** UI element locators and page interaction methods are strictly decoupled from test assertion logic.
2. **Explicit Wait Strategies:** Zero reliance on arbitrary sleeps (`sleep(5000)`). Replaced with dynamic DOM condition polling (`waitForElementVisible`, `waitForElementClickable`).
3. **Automated Screenshot on Failure:** Captures timestamped high-resolution PNG screenshots on any unexpected test exception.
4. **Data Isolation & Centralization:** Test data loaded via centralized JSON fixtures (`test-data/`), with randomized dynamic email/ID generation for collision prevention.
5. **Quality Gates Enforced in CI:** Pipelines automatically fail if regression suite pass rate drops below **95%** or if any critical security test fails.

---

## 4. Defect Severity & Priority Classification

| Severity | Definition | Target Resolution SLA |
| :--- | :--- | :--- |
| **Critical (S1)** | System crash, data loss, security bypass, or broken complaint creation | < 4 Hours |
| **High (S2)** | SLA calculation failure, file upload broken, or notification drop | < 24 Hours |
| **Medium (S3)** | UI rendering defect, filter glitch, or minor validation message error | < 3 Days |
| **Low (S4)** | Cosmetic spacing inconsistency or minor visual alignment issue | Next Sprint Cycle |
