# CitizenCare — Interactive User Manual & System Guide

## 1. Persona Roles & Overview

CitizenCare supports three primary municipal stakeholders:

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     CITIZEN     │       │ MUNICIPAL STAFF │       │   CITY ADMIN    │
│                 │       │                 │       │                 │
│ • Report Issues │       │ • Queue Triage  │       │ • City KPIs     │
│ • Upload Photos │       │ • Claim Tickets │       │ • SLA Analytics │
│ • Track Live SLA│       │ • Dispatch Tech │       │ • Staff Workload│
│ • 1-5★ Rating   │       │ • Update Work   │       │ • Audit Trail   │
└─────────────────┘       └─────────────────┘       └─────────────────┘
```

---

## 2. Citizen User Journey

1. **Sign In or Register:** Use `citizen@citizencare.gov` / `Citizen@123` or register your personal citizen profile.
2. **File a Civic Problem:** Click **"Report New Problem"**, select the category (e.g. Road Pothole, Water Outage, Dark Streetlight), type the description, specify the location landmark, and drag-and-drop evidence photos or PDF documents.
3. **Monitor Live SLA Countdown:** View the real-time progress stepper (`SUBMITTED` -> `ACKNOWLEDGED` -> `ASSIGNED` -> `IN_PROGRESS` -> `RESOLVED` -> `CLOSED`) with remaining SLA hours.
4. **Rate Resolution:** When marked RESOLVED, inspect the field work and submit 1–5 stars with feedback to automatically close the ticket.

---

## 3. Municipal Staff Workflow

1. **Log in to Department Queue:** (e.g. `staff.roads@citizencare.gov` / `Staff@123` or `staff.power@citizencare.gov` / `Staff@123`).
2. **Review Priority Queue:** Filter by *Assigned To Me*, *Unassigned*, or *Overdue Breaches*.
3. **Dispatch & Progress Status:** Click **"Assign Tech"** or **"Update Status"** to advance the state machine to `IN_PROGRESS` and `RESOLVED` with technician investigation remarks.

---

## 4. City Administrator Command Center

1. **Log in as Administrator:** (`admin@citizencare.gov` / `Admin@123`).
2. **Inspect Real-Time City Telemetry:** View overall SLA compliance rates, average resolution time in hours, category breakdowns, and department volume distributions.
3. **Review Audit Event Stream:** Inspect every user login, complaint creation, technician assignment, and status change with immutable ISO timestamps and IP address telemetry.
