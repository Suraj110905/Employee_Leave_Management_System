# 🧪 Employee Leave Management System (ELMS) — Testing Report

This document outlines the testing strategy, execution results, test coverage, and validation matrices for the **Employee Leave Management System (ELMS)**.

---

## 📌 Table of Contents
1. [Testing Strategy](#1-testing-strategy)
2. [Security & Performance Testing](#2-security--performance-testing)
3. [Edge Cases & Error Handling](#3-edge-cases--error-handling)
4. [Test Execution Environment](#4-test-execution-environment)
5. [Automated API Integration Tests](#5-automated-api-integration-tests)
6. [Detailed Test Cases Matrix (Tabular)](#6-detailed-test-cases-matrix-tabular)
7. [Known Limitations & Future Improvements](#7-known-limitations--future-improvements)

---

## 1. Testing Strategy
Our validation plan uses a hybrid strategy combining automated API integration tests with structured manual user flow checks:
* **API Integration Testing:** Executed via Node.js scripts (`backend/tests/`) targeting local Express ports. Verifies auth flows, access rules, schema validations, and database writes.
* **Frontend UI Verification:** Component checks via Vite dev servers. Validates path protections, UI state transformations, Radix components accessibility, and dashboard widgets.
* **End-to-End (E2E) Flow Checks:** Manual walks checking actions from employee application to manager decisions and admin rosters.

---

## 2. Security & Performance Testing

### Security Testing
* **CORS Restrictions:** Checked with external origin requests, verifying the API rejects requests from unauthorized domains.
* **Rate Limiting:** Verified auth gateways lock accounts after 5 consecutive incorrect requests.
* **Role-Based Access Control (RBAC):** Verified that routing requests to admin paths (`/api/v1/admin/*`) return `403 Forbidden` when using an Employee token.

### Performance Testing
* **Index Coverage:** Verified index hits on key fields like `employeeId`, `email`, `startDate`, and `status`.
* **Pagination Payload Checks:** Verified that querying large data lists returns page counts, metadata limits, and paginated records efficiently.

---

## 3. Edge Cases & Error Handling

### Date Timezone Offset Validation Buffer
* **Scenario:** Client browser timezone (e.g. UTC+05:30) is ahead of the database server timezone (e.g. UTC+00:00).
* **Test Case:** Applying for a leave starting "today" (local client time) is accepted rather than rejected as a past date.
* **Result:** Passed. The 24-hour buffer allows safe timezone comparisons.

### Cancel Leave Workflow State Alignment
* **Scenario:** Employee cancels a pending request.
* **Test Case:** The system cancels the leave, restores the balances in `leavebalances`, and returns the updated leave record.
* **Result:** Passed. Frontend UI states update immediately without rendering crashes.

### Manager ID Name String Sanitation
* **Scenario:** Admin registers an employee selecting a manager value like `"Mike Manager (MGR-20015)"`.
* **Test Case:** Backend cleans the string, extracting and storing only the clean ID (`MGR-20015`).
* **Result:** Passed. Relations mapping resolved successfully.

---

## 4. Test Execution Environment
* **Database:** Local MongoDB instance and MongoDB Atlas Cloud Cluster.
* **API Server:** Node.js (v18.x) running on Express at `http://localhost:5000`.
* **Client Server:** Vite v8.x dev server running at `http://localhost:5173`.

---

## 5. Automated API Integration Tests
The project contains test scripts located in the `backend/tests/` folder:

| Test Script | Execution Command | Areas Verified | Status |
| :--- | :--- | :--- | :--- |
| `testAuth.js` | `node backend/tests/testAuth.js` | Login validation, Token verification, JWT refresh flows, and Profile info. | **Passed** ✅ |
| `testEmployee.js` | `node backend/tests/testEmployee.js` | Leave applications, balance limits checks, cancellations, and holiday lookups. | **Passed** ✅ |
| `testManager.js` | `node backend/tests/testManager.js` | Direct report rosters, team calendars, dashboard counters, approvals, and rejections. | **Passed** ✅ |
| `testAdmin.js` | `node backend/tests/testAdmin.js` | Employee CRUD, Department operations, Leave policy adjustments, and System settings. | **Passed** ✅ |

---

## 6. Detailed Test Cases Matrix (Tabular)

| Test ID | Module | Title / Objective | Input Data / Trigger | Expected Outcome | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-001** | Auth | Login with valid credentials | `email: employee@company.com`, `password: Password123` | Returns `200 OK`, JWT access token, and user info. | Returned valid access token. | **Pass** |
| **TC-002** | Auth | Login with invalid password | `email: employee@company.com`, `password: wrongpass` | Returns `401 Unauthorized` with error list. | Returned 401 with validation error. | **Pass** |
| **TC-003** | Auth | Rate limit restriction | 6 consecutive bad requests | Request blocked with `429 Too Many Requests`. | Returned 429 after limit exceeded. | **Pass** |
| **TC-004** | Profile | Update phone number | `phone: "+919876543211"` via `PUT /users/me` | Returns `200 OK` and updates the database record. | Database record updated successfully. | **Pass** |
| **TC-005** | Leave | Apply within balance limit | Annual Leave, 5 working days, Balance: 15 | Request submitted, status is `Pending`. | Created pending leave document. | **Pass** |
| **TC-006** | Leave | Apply exceeding balance limit | Annual Leave, 20 working days, Balance: 15 | Returns `400 Bad Request` with balance warning. | Blocked request with error. | **Pass** |
| **TC-007** | Leave | Timezone date offset boundary | Apply for today's date in local client time | Request accepted successfully. | Buffer validated today's date. | **Pass** |
| **TC-008** | Leave | Cancel pending leave request | Trigger `PATCH /leaves/:id/cancel` | Status updates to `Cancelled` and restores leave balance. | Status updated and balances restored. | **Pass** |
| **TC-009** | Manager | Approve leave request | Trigger `/leave-requests/:id/approve` with remarks | Request status updates to `Approved`. | Updated status and logged manager remarks. | **Pass** |
| **TC-010** | Manager | Reject leave request | Trigger `/leave-requests/:id/reject` with remarks | Request status updates to `Rejected`. | Updated status and logged rejection reason. | **Pass** |
| **TC-011** | Manager | Team calendar availability | Query calendar with date boundaries | Returns team leave details within date range. | Returned approved leaves. | **Pass** |
| **TC-012** | Admin | Register new employee | Submit employee metadata with manager ID | Creates user profile, updates headcount, and seeds default balances. | Created profile and seeded leave balances. | **Pass** |
| **TC-013** | Admin | Soft delete employee | Trigger `DELETE /admin/employees/:id` | `isActive` set to `false`, blocking logins. | Account deactivated, login blocked. | **Pass** |
| **TC-014** | Admin | Promote employee role | Trigger `PATCH /employees/:id/role` | User role field updates in database. | User role updated successfully. | **Pass** |
| **TC-015** | Admin | Create holiday broadcast | Submit new holiday | Holiday created and notifications broadcast to all employees. | Holiday created and alerts broadcast. | **Pass** |
| **TC-016** | Search | Spotlight search execution | Search keyword `q="Eng"` | Returns matching employees, departments, and holidays. | Returned matching search results. | **Pass** |
| **TC-017** | Notifications | Interactive Topbar bell count | Dismiss notification from dropdown | Dropdown count badge decrements in real-time. | Badge count decremented successfully. | **Pass** |

---

## 7. Known Limitations & Future Improvements

### Known Limitations
* **Local Storage Attachments:** Leave request attachment uploads store files locally. If scaled horizontally across servers, file retrievals will fail unless configured with a shared storage bucket (e.g. AWS S3).
* **HTTP Long Polling:** Notifications refresh every 10 seconds via API polling rather than using persistent WebSocket connections.

### Future Test Improvements
* **Unit Test Coverage:** Configure Jest or Vitest suites to run unit tests on isolated service layer methods.
* **Component Testing:** Add React Testing Library tests to verify component renders and mock context states.
* **E2E Automation:** Integrate Cypress testing to automate browser flows (login, leave applications, manager approvals).
* **CI/CD Integration:** Integrate GitHub Actions to run automated checks on pull requests.
