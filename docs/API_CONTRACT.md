# API Contract & Schema Specifications

This document defines the REST API endpoints, request payloads, response structures, HTTP status codes, and JWT parameters for the backend service integration.

---

## 🔐 Authentication & Session Tokens

### JWT Requirements
* **Signing Algorithm**: HS256 (HMAC with SHA-256).
* **Token Structure**:
  * **Access Token**: Short-lived (e.g. 15 minutes) passed in headers: `Authorization: Bearer <token>`.
  * **Refresh Token**: Long-lived (e.g. 7 days) stored in a secure HttpOnly cookie.
* **Payload Claims**:
  ```json
  {
    "sub": "EMP-10024",
    "email": "john.doe@company.com",
    "role": "employee",
    "iat": 1783852800,
    "exp": 1783853700
  }
  ```

---

## 📡 Endpoints Roster

### 1. Authentication Layer

#### POST `/api/v1/auth/login`
* **Description**: Verifies credentials and signs access/refresh tokens.
* **Request Body**:
  ```json
  {
    "email": "john.doe@company.com",
    "password": "Password123",
    "rememberMe": true
  }
  ```
* **Success Response (200 OK)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "user": {
      "id": "EMP-10024",
      "name": "John Doe",
      "email": "john.doe@company.com",
      "role": "employee",
      "department": "Engineering"
    }
  }
  ```
* **Error Response (401 Unauthorized)**:
  ```json
  {
    "error": "Invalid email or password credentials."
  }
  ```

---

### 2. Employee Leaves Layer

#### GET `/api/v1/leaves/balances/:employeeId`
* **Description**: Retrieves remaining leave allowances for a user.
* **Success Response (200 OK)**:
  ```json
  [
    { "type": "Annual", "total": 15, "used": 3, "available": 12 },
    { "type": "Sick", "total": 10, "used": 2, "available": 8 },
    { "type": "Casual", "total": 8, "used": 4, "available": 4 }
  ]
  ```

#### GET `/api/v1/leaves/history/:employeeId`
* **Description**: Retrieves paginated leave history logs.
* **Query Parameters**:
  * `page` (default: 1)
  * `limit` (default: 10)
  * `status` (Pending/Approved/Rejected/Cancelled)
  * `leaveType`
  * `search` (match reason description)
* **Success Response (200 OK)**:
  ```json
  {
    "data": [
      {
        "id": "LV-102",
        "employeeId": "EMP-10024",
        "leaveType": "Annual",
        "startDate": "2026-07-15",
        "endDate": "2026-07-20",
        "totalDays": 6,
        "workingDays": 4,
        "reason": "Family vacation",
        "status": "Pending",
        "appliedAt": "2026-07-08T10:00:00Z",
        "reviewer": null,
        "reviewedAt": null,
        "remarks": null,
        "attachment": null
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
  ```

#### POST `/api/v1/leaves/apply`
* **Description**: Submits a new leave request. Performs date checks and allowance reviews on the server side.
* **Request Body**:
  ```json
  {
    "employeeId": "EMP-10024",
    "leaveType": "Annual",
    "startDate": "2026-07-15",
    "endDate": "2026-07-20",
    "reason": "Family vacation details"
  }
  ```
* **Success Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "id": "LV-108",
      "status": "Pending",
      "workingDays": 4,
      "appliedAt": "2026-07-13T09:00:00Z"
    }
  }
  ```
* **Error Response (400 Bad Request / 409 Conflict)**:
  ```json
  {
    "error": "Insufficient leave balance remaining for Annual."
  }
  ```

#### POST `/api/v1/leaves/cancel/:leaveId`
* **Description**: Withdraws a pending leave request, restoring deducted balances.
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Leave request LV-102 cancelled successfully."
  }
  ```

---

### 3. Manager Approvals Layer

#### GET `/api/v1/manager/stats/:managerId`
* **Description**: Returns key statistics counters for the manager's department.
* **Success Response (200 OK)**:
  ```json
  {
    "pendingCount": 3,
    "approvedThisMonth": 1,
    "rejectedThisMonth": 0,
    "onLeaveTodayCount": 1,
    "upcomingLeavesCount": 2,
    "teamAvailabilityPercentage": 88
  }
  ```

#### GET `/api/v1/manager/approvals/:managerId`
* **Description**: Fetches requests assigned to the manager. Supports filtering by status and searching employee names.
* **Success Response (200 OK)**:
  ```json
  {
    "data": [
      {
        "id": "LV-102",
        "employeeId": "EMP-10024",
        "employeeName": "John Doe",
        "avatar": "JD",
        "role": "Software Engineer",
        "leaveType": "Annual",
        "startDate": "2026-07-15",
        "endDate": "2026-07-20",
        "workingDays": 4,
        "status": "Pending",
        "currentStage": 1,
        "totalStages": 1,
        "approvedBy": [],
        "rejectedBy": null
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
  ```

#### POST `/api/v1/manager/approvals/:id/approve`
* **Description**: Approves a leave request. Increments approval stage.
* **Request Body**:
  ```json
  {
    "managerId": "MGR-20015",
    "remarks": "Approved. Project milestones covered."
  }
  ```
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "status": "Approved"
  }
  ```

#### POST `/api/v1/manager/approvals/:id/reject`
* **Description**: Rejects a leave request. Comments are mandatory.
* **Request Body**:
  ```json
  {
    "managerId": "MGR-20015",
    "remarks": "Rejected due to release dates overlap."
  }
  ```
* **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "status": "Rejected"
  }
  ```

---

## 🚫 Standard Status Codes
* `200 OK`: Successful retrieval or action.
* `201 Created`: Submission successfully saved.
* `400 Bad Request`: Form input validation failures.
* `401 Unauthorized`: Missing, expired, or invalid authorization headers.
* `403 Forbidden`: Employee attempting admin/manager role actions.
* `404 Not Found`: Specific leave ID or endpoint does not exist.
* `422 Unprocessable Entity`: Validation failure on the server side (e.g., date ranges overlap).
