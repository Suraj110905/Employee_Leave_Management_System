# 🌐 Employee Leave Management System (ELMS) — API Documentation

This documentation details the RESTful HTTP API services of the **Employee Leave Management System (ELMS)**. The API acts as the core data engine powering the React frontend client, handling identity, leave request lifecycles, and staff administration.

---

## 📌 Table of Contents
1. [Project Overview](#1-project-overview)
2. [Base URL](#2-base-url)
3. [Authentication](#3-authentication)
4. [Response Format](#4-response-format)
5. [Authentication APIs](#5-authentication-apis)
6. [Employee APIs](#6-employee-apis)
7. [Manager APIs](#7-manager-apis)
8. [HR/Admin APIs](#8-hradmin-apis)
9. [Notification APIs](#9-notification-apis)
10. [Search API](#10-search-api)

---

## 1. Project Overview
The ELMS API is constructed using Node.js and Express.js, storing documents in MongoDB.
It structures system operations into distinct roles:
* **HR Admin (`hr_admin`):** General configurations, policy adjustments, and employee roster management.
* **Manager (`manager`):** Direct team approvals, availability checking, and statistics.
* **Employee (`employee`):** Personal balance viewing, history logs, and leave requests submittals.

---

## 2. Base URL
All API requests must be sent to the following root entry point:
* **Local Development Environment:** `http://localhost:5000/api/v1`

---

## 3. Authentication
The API uses JSON Web Tokens (JWT) for stateless user session verification.

### JWT Flow
1. Client logs in with valid credentials (`POST /auth/login`).
2. Server responds with a short-lived `accessToken` and sets a HTTP-only `refreshToken` cookie.
3. Client attaches the `accessToken` to all subsequent headers.

### Authorization Header
All protected resources require the `Authorization` header containing the JWT token:
```http
Authorization: Bearer <your_jwt_access_token>
```

---

## 4. Response Format

### Success Response
Every successful API execution returns a status code `2xx` and conforms to this structure:
```json
{
  "success": true,
  "message": "Resource successfully resolved.",
  "data": {
    "key": "value"
  }
}
```

### Error Response
Unsuccessful calls return standard HTTP status codes (`400`, `401`, `403`, `404`, `500`) with details:
```json
{
  "success": false,
  "message": "Validation or execution error occurred.",
  "errors": [
    "Field 'email' must be a valid email format.",
    "Password requirements not met."
  ]
}
```

---

## 5. Authentication APIs

### Login
* **Method:** `POST`
* **URL:** `/auth/login`
* **Authorization:** None (Guest)
* **Request Body:**
  ```json
  {
    "email": "employee@company.com",
    "password": "Password123"
  }
  ```
* **Response Example (200 OK):**
  ```json
  {
    "success": true,
    "message": "User logged in successfully.",
    "data": {
      "accessToken": "eyJhbGciOi...",
      "user": {
        "id": "EMP-10024",
        "name": "John Employee",
        "email": "employee@company.com",
        "role": "employee"
      }
    }
  }
  ```
* **Error Response (401 Unauthorized):**
  ```json
  {
    "success": false,
    "message": "Authentication failed.",
    "errors": ["Invalid email address or password credentials."]
  }
  ```

---

### Current User
* **Method:** `GET`
* **URL:** `/auth/me`
* **Authorization:** Bearer Token
* **Response Example (200 OK):**
  ```json
  {
    "success": true,
    "message": "Authenticated profile retrieved.",
    "data": {
      "id": "EMP-10024",
      "name": "John Employee",
      "email": "employee@company.com",
      "role": "employee"
    }
  }
  ```

---

### Change Password
* **Method:** `POST`
* **URL:** `/auth/change-password`
* **Authorization:** Bearer Token
* **Request Body:**
  ```json
  {
    "currentPassword": "Password123",
    "newPassword": "SecretSecurePassword456"
  }
  ```
* **Response Example (200 OK):**
  ```json
  {
    "success": true,
    "message": "Password changed successfully!"
  }
  ```
* **Error Response (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "Password update rejected.",
    "errors": ["New password must be at least 8 characters long."]
  }
  ```

---

## 6. Employee APIs

### Profile Details
* **Method:** `GET`
* **URL:** `/users/me`
* **Authorization:** Bearer Token
* **Response Example (200 OK):**
  ```json
  {
    "success": true,
    "message": "Employee details retrieved.",
    "data": {
      "employeeId": "EMP-10024",
      "name": "John Employee",
      "email": "employee@company.com",
      "department": "Engineering",
      "designation": "Software Developer",
      "phone": "+919876543210"
    }
  }
  ```

---

### Update Profile Settings
* **Method:** `PUT`
* **URL:** `/users/me`
* **Authorization:** Bearer Token
* **Request Body:**
  ```json
  {
    "phone": "+919876543211",
    "email": "john.employee.new@company.com"
  }
  ```
* **Response Example (200 OK):**
  ```json
  {
    "success": true,
    "message": "Profile updated successfully.",
    "data": {
      "employeeId": "EMP-10024",
      "phone": "+919876543211",
      "email": "john.employee.new@company.com"
    }
  }
  ```

---

### Leave Balances
* **Method:** `GET`
* **URL:** `/leaves/balances`
* **Authorization:** Bearer Token
* **Response Example (200 OK):**
  ```json
  {
    "success": true,
    "message": "Leave balances fetched successfully.",
    "data": [
      { "type": "Annual", "allowed": 15, "used": 2, "available": 13 },
      { "type": "Sick", "allowed": 10, "used": 1, "available": 9 },
      { "type": "Casual", "allowed": 8, "used": 0, "available": 8 }
    ]
  }
  ```

---

### Active Holidays List
* **Method:** `GET`
* **URL:** `/leaves/holidays/list`
* **Authorization:** Bearer Token
* **Response Example (200 OK):**
  ```json
  {
    "success": true,
    "message": "Holidays list retrieved.",
    "data": [
      {
        "id": "6a58f273a752b3313a66e334",
        "name": "Christmas Day",
        "date": "2026-12-25",
        "type": "National"
      }
    ]
  }
  ```

---

### Leave Application (Create)
* **Method:** `POST`
* **URL:** `/leaves`
* **Authorization:** Bearer Token
* **Request Body:**
  ```json
  {
    "leaveType": "Annual",
    "startDate": "2026-07-20",
    "endDate": "2026-07-24",
    "reason": "Family vacation planning."
  }
  ```
* **Response Example (201 Created):**
  ```json
  {
    "success": true,
    "message": "Leave application submitted successfully.",
    "data": {
      "id": "LV-299",
      "status": "Pending",
      "workingDays": 5,
      "appliedAt": "2026-07-16T21:06:46.000Z"
    }
  }
  ```
* **Error Response (400 Bad Request):**
  ```json
  {
    "success": false,
    "message": "Request failed.",
    "errors": ["Insufficient leave balance. Requested: 15 days, Available: 13 days."]
  }
  ```

---

### Fetch Leave Details
* **Method:** `GET`
* **URL:** `/leaves/:id`
* **Authorization:** Bearer Token
* **Response Example (200 OK):**
  ```json
  {
    "success": true,
    "message": "Leave details retrieved.",
    "data": {
      "id": "LV-299",
      "employeeId": "EMP-10024",
      "leaveType": "Annual",
      "startDate": "2026-07-20",
      "endDate": "2026-07-24",
      "workingDays": 5,
      "status": "Pending",
      "reason": "Family vacation planning."
    }
  }
  ```

---

### Cancel Leave Request
* **Method:** `PATCH`
* **URL:** `/leaves/:id/cancel`
* **Authorization:** Bearer Token
* **Response Example (200 OK):**
  ```json
  {
    "success": true,
    "message": "Leave request LV-299 cancelled successfully.",
    "data": {
      "id": "LV-299",
      "status": "Cancelled"
    }
  }
  ```

---

## 7. Manager APIs

### Manager Dashboard Stats
* **Method:** `GET`
* **URL:** `/manager/dashboard`
* **Authorization:** Bearer Token (Manager Role required)
* **Response Example (200 OK):**
  ```json
  {
    "success": true,
    "message": "Dashboard statistics retrieved successfully.",
    "data": {
      "pendingCount": 1,
      "approvedThisMonth": 4,
      "rejectedThisMonth": 0,
      "onLeaveTodayCount": 0,
      "upcomingLeavesCount": 2,
      "teamAvailabilityPercentage": 100,
      "teamMembersCount": 5,
      "leavesThisMonth": 2
    }
  }
  ```

---

### Team Approvals Queue (Roster History)
* **Method:** `GET`
* **URL:** `/manager/leave-requests`
* **Authorization:** Bearer Token (Manager Role required)
* **Query Parameters:**
  * `page` (optional): Page number (default: 1)
  * `limit` (optional): Page sizes (default: 10)
  * `status` (optional): Filter status (`Pending`, `Approved`, `Rejected`)
* **Response Example (200 OK):**
  ```json
  {
    "success": true,
    "message": "Approvals queue retrieved successfully.",
    "data": {
      "data": [
        {
          "id": "LV-299",
          "employeeId": "EMP-10024",
          "employeeName": "John Employee",
          "leaveType": "Annual",
          "startDate": "2026-07-20",
          "endDate": "2026-07-24",
          "status": "Pending"
        }
      ],
      "total": 1,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
  ```

---

### Approve Request
* **Method:** `PATCH`
* **URL:** `/manager/leave-requests/:id/approve`
* **Authorization:** Bearer Token (Manager Role required)
* **Request Body:**
  ```json
  {
    "remarks": "Approved. Have a great vacation!"
  }
  ```
* **Response Example (200 OK):**
  ```json
  {
    "success": true,
    "message": "Leave request approved successfully."
  }
  ```

---

### Reject Request
* **Method:** `PATCH`
* **URL:** `/manager/leave-requests/:id/reject`
* **Authorization:** Bearer Token (Manager Role required)
* **Request Body:**
  ```json
  {
    "remarks": "Rejected due to server release deadline overlap."
  }
  ```
* **Response Example (200 OK):**
  ```json
  {
    "success": true,
    "message": "Leave request rejected successfully."
  }
  ```

---

### Direct Reports Roster
* **Method:** `GET`
* **URL:** `/manager/team`
* **Authorization:** Bearer Token (Manager Role required)
* **Response Example (200 OK):**
  ```json
  {
    "success": true,
    "message": "Team roster retrieved.",
    "data": {
      "data": [
        {
          "employeeId": "EMP-10024",
          "name": "John Employee",
          "email": "employee@company.com",
          "department": "Engineering"
        }
      ]
    }
  }
  ```

---

### Team Calendar Leaves
* **Method:** `GET`
* **URL:** `/manager/calendar`
* **Authorization:** Bearer Token (Manager Role required)
* **Query Parameters:**
  * `startDate` (required): ISO date boundary ('YYYY-MM-DD')
  * `endDate` (required): ISO date boundary ('YYYY-MM-DD')
* **Response Example (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      {
        "employeeId": "EMP-10024",
        "employeeName": "John Employee",
        "startDate": "2026-07-20",
        "endDate": "2026-07-24",
        "status": "Approved"
      }
    ]
  }
  ```

---

## 8. HR/Admin APIs

### Admin stats counters
* **Method:** `GET`
* **URL:** `/admin/stats`
* **Authorization:** Bearer Token (HR Admin Role required)
* **Response Example (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "totalHeadcount": 25,
      "departmentsCount": 4,
      "leaveTypesCount": 3,
      "holidaysCount": 1,
      "activeLeavesCount": 0,
      "onLeaveTodayCount": 0,
      "pendingReviewsCount": 1,
      "approvedThisMonth": 2,
      "leavesThisMonth": 3
    }
  }
  ```

---

### Employee Directory CRUD

#### Get Employees list (Paginated & Filterable)
* **Method:** `GET`
* **URL:** `/admin/employees`
* **Authorization:** Bearer Token (HR Admin Role required)
* **Query Parameters:** `page`, `limit`, `search`, `department`, `role`
* **Response Example (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "items": [
        {
          "employeeId": "EMP-10024",
          "name": "John Employee",
          "email": "employee@company.com",
          "role": "employee",
          "department": "Engineering",
          "isActive": true
        }
      ],
      "total": 1
    }
  }
  ```

#### Register Employee
* **Method:** `POST`
* **URL:** `/admin/employees`
* **Authorization:** Bearer Token (HR Admin Role required)
* **Request Body:**
  ```json
  {
    "name": "Jane Employee",
    "email": "jane@company.com",
    "role": "employee",
    "department": "Engineering",
    "designation": "UI Developer",
    "managerId": "MGR-20015",
    "phone": "+919999999999"
  }
  ```
* **Response Example (201 Created):**
  ```json
  {
    "success": true,
    "message": "Employee account registered.",
    "data": {
      "employeeId": "EMP-77724",
      "name": "Jane Employee"
    }
  }
  ```

#### Update Employee Details
* **Method:** `PUT`
* **URL:** `/admin/employees/:id`
* **Authorization:** Bearer Token (HR Admin Role required)
* **Request Body:** Send fields to update.
* **Response Example (200 OK):**
  ```json
  {
    "success": true,
    "message": "Employee updated successfully."
  }
  ```

#### Soft Delete Employee
* **Method:** `DELETE`
* **URL:** `/admin/employees/:id`
* **Authorization:** Bearer Token (HR Admin Role required)
* **Response Example (200 OK):**
  ```json
  {
    "success": true,
    "message": "Employee account deactivated successfully."
  }
  ```

---

### Department CRUD

#### List Departments
* **Method:** `GET`
* **URL:** `/admin/departments`
* **Authorization:** Bearer Token (HR Admin Role required)
* **Response Example (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      { "id": "DEPT-ENG", "name": "Engineering", "description": "Software products" }
    ]
  }
  ```

#### Create Department
* **Method:** `POST`
* **URL:** `/admin/departments`
* **Authorization:** Bearer Token (HR Admin Role required)
* **Request Body:** `{ "name": "Human Resources", "code": "DEPT-HR", "description": "Talent ops" }`

---

### Leave Policy CRUD

#### List Leave Policies
* **Method:** `GET`
* **URL:** `/admin/leave-types`
* **Authorization:** Bearer Token (HR Admin Role required)
* **Response Example (200 OK):**
  ```json
  {
    "success": true,
    "data": [
      { "id": "LT-ANN", "type": "Annual", "daysAllowed": 15 }
    ]
  }
  ```

---

### Holiday Events CRUD

#### List Holidays
* **Method:** `GET`
* **URL:** `/admin/holidays`
* **Authorization:** Bearer Token (HR Admin Role required)

#### Create Holiday
* **Method:** `POST`
* **URL:** `/admin/holidays`
* **Authorization:** Bearer Token (HR Admin Role required)
* **Request Body:** `{ "name": "New Year Day", "date": "2026-01-01", "type": "National" }`

---

### Audit Logs Trails
* **Method:** `GET`
* **URL:** `/admin/audits`
* **Authorization:** Bearer Token (HR Admin Role required)
* **Query Parameters:** `page`, `limit`
* **Response Example (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "items": [
        {
          "performedBy": "ADM-90001",
          "role": "hr_admin",
          "action": "HOLIDAY_CREATED",
          "details": "Created holiday event New Year Day",
          "createdAt": "2026-07-16T21:07:41.000Z"
        }
      ]
    }
  }
  ```

---

### Reports Exports
* **GET `/admin/reports/leaves`:** Export leave logs data roster.
* **GET `/admin/reports/employees`:** Export employee roster lists.
* **GET `/admin/reports/departments`:** Export corporate headcount distributions.
* **Query Parameters:** `format` (csv/json)

---

## 9. Notification APIs

### Fetch Notification Alerts
* **Method:** `GET`
* **URL:** `/notifications`
* **Authorization:** Bearer Token
* **Query Parameters:** `status` (optional: `unread`, `read`), `page`, `limit`
* **Response Example (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "data": [
        {
          "id": "6a58f273a752b3313a66e339",
          "title": "New Holiday Added",
          "message": "A new holiday Christmas has been registered.",
          "type": "HolidayAlert",
          "status": "unread"
        }
      ]
    }
  }
  ```

---

### Mark Notification as Read
* **Method:** `PATCH`
* **URL:** `/notifications/:id`
* **Authorization:** Bearer Token
* **Response Example (200 OK):**
  ```json
  {
    "success": true,
    "message": "Notification marked as read successfully."
  }
  ```

---

### Mark All Notifications as Read
* **Method:** `PATCH`
* **URL:** `/notifications/mark-all`
* **Authorization:** Bearer Token
* **Response Example (200 OK):**
  ```json
  {
    "success": true,
    "message": "All notifications marked as read."
  }
  ```

---

### Delete Notification
* **Method:** `DELETE`
* **URL:** `/notifications/:id`
* **Authorization:** Bearer Token

---

## 10. Search API

### Spotlight Search
* **Method:** `GET`
* **URL:** `/search`
* **Authorization:** Bearer Token
* **Query Parameters:**
  * `q` (required): search keyword string
* **Response Example (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "employees": [
        { "employeeId": "EMP-10024", "name": "John Employee", "email": "employee@company.com" }
      ],
      "departments": [],
      "holidays": [],
      "leaveTypes": []
    }
  }
  ```
