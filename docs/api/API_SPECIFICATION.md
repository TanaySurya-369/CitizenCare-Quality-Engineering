# CitizenCare REST API Specification

**Base URL:** `http://localhost:5000/api`  
**Content-Type:** `application/json` (or `multipart/form-data` for file uploads)  
**Authentication:** `Authorization: Bearer <JWT_TOKEN>`

---

## 1. Authentication Endpoints

### `POST /api/auth/register`
Creates a new citizen account.
- **Request Body:**
  ```json
  {
    "name": "John Doe",
    "email": "citizen@citizencare.gov",
    "password": "Password@123",
    "phone": "+1 555-0199",
    "role": "CITIZEN"
  }
  ```
- **Response `201 Created`:**
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": { "id": "uuid", "name": "John Doe", "email": "citizen@citizencare.gov", "role": "CITIZEN" },
      "token": "eyJhbGciOi..."
    }
  }
  ```

### `POST /api/auth/login`
Authenticates user and issues JWT session token.
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "user": { "id": "uuid", "name": "Marcus Chen", "role": "STAFF", "departmentId": "uuid" },
      "token": "eyJhbGciOi..."
    }
  }
  ```

---

## 2. Complaint Endpoints

### `POST /api/complaints`
Creates a civic complaint with optional multi-part photo/PDF evidence attachments.
- **Headers:** `Authorization: Bearer <TOKEN>`, `Content-Type: multipart/form-data`
- **Fields:**
  - `categoryId`: String (Required)
  - `title`: String (5–150 chars)
  - `description`: String (10–2000 chars)
  - `location`: String
  - `priority`: `LOW` | `MEDIUM` | `HIGH` | `CRITICAL` (Optional)
  - `attachments`: File (JPG, PNG, PDF, max 5MB)
- **Response `201 Created`:**
  ```json
  {
    "success": true,
    "message": "Complaint created successfully",
    "data": {
      "complaint": {
        "id": "uuid",
        "complaintNumber": "C-1001",
        "title": "Hazardous road damage",
        "status": "SUBMITTED",
        "priority": "HIGH",
        "expectedResolutionDate": "2026-09-03T18:00:00.000Z",
        "slaInfo": {
          "state": "ON_TRACK",
          "label": "On Track (48h left)",
          "remainingHours": 48
        }
      }
    }
  }
  ```

### `PATCH /api/complaints/:id/status`
Updates complaint workflow state (Staff / Admin only).
- **Request Body:**
  ```json
  {
    "status": "IN_PROGRESS",
    "remarks": "Asphalt patch machine dispatched to location."
  }
  ```

### `PATCH /api/complaints/:id/assign`
Assigns a field technician (Staff / Admin only).
- **Request Body:**
  ```json
  {
    "staffId": "uuid-of-staff",
    "notes": "Priority dispatch before rush hour."
  }
  ```

### `POST /api/complaints/:id/feedback`
Submits citizen rating and resolution confirmation.
- **Request Body:**
  ```json
  {
    "rating": 5,
    "comment": "Work completed cleanly and rapidly!",
    "resolutionConfirmed": true
  }
  ```

---

## 3. Analytics & Telemetry

### `GET /api/admin/analytics`
Returns real-time KPIs, SLA compliance rates, department volume, and satisfaction ratings.
- **Response `200 OK`:**
  ```json
  {
    "success": true,
    "data": {
      "totalComplaints": 42,
      "openComplaints": 12,
      "resolvedComplaints": 30,
      "overdueComplaints": 1,
      "slaComplianceRate": 96.4,
      "averageResolutionHours": 28.5,
      "citizenSatisfactionScore": 4.9,
      "byDepartment": [ ... ],
      "byPriority": [ ... ]
    }
  }
  ```
