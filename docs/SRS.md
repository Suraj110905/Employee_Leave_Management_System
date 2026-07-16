# 📝 Software Requirements Specification (SRS) — ELMS

This document specifies the software requirements for the **Employee Leave Management System (ELMS)**.

---

## 📌 Table of Contents
1. [Introduction](#1-introduction)
2. [Project Scope](#2-project-scope)
3. [Objectives](#3-objectives)
4. [User Roles](#4-user-roles)
5. [Functional Requirements](#5-functional-requirements)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [Constraints & Assumptions](#7-constraints--assumptions)
8. [Use Cases](#8-use-cases)
9. [Acceptance Criteria](#9-acceptance-criteria)

---

## 1. Introduction
The Employee Leave Management System (ELMS) is an intranet application designed to handle corporate leave policies. The system replaces spreadsheet-based workflow tracking, digitizing leave balance allocations, submissions, date logic validations, and approvals.

---

## 2. Project Scope
The scope of ELMS includes:
* **Authentication & Profiles:** Secure authentication using JSON Web Tokens (JWT) and role assignments (`employee`, `manager`, `hr_admin`).
* **Leave Requests Management:** Validation against balances, automatic calculation of working days (excluding weekends), and cancellation of pending requests.
* **Manager Actions:** Direct report directories, calendar visualizers, and remarks-supported reviews.
* **Administration Panel:** Roster management, leave type balance configurations, holiday calendars, global system parameters, and audit trails.
* **Alert Notifications:** Broadcasting announcements when holidays are registered, and alerts when leaves are applied for or reviewed.

---

## 3. Objectives
* **Process Automation:** Reduce the time to submit and approve leave requests.
* **Accuracy:** Automate leave balance tracking and duration calculations.
* **Visibility:** Provide managers with a centralized team calendar.
* **Auditability:** Log administrative actions for compliance and reporting.

---

## 4. User Roles

| Role | Access Scope | Key Responsibilities |
| :--- | :--- | :--- |
| **Employee (`employee`)** | Personal Profile & Leave Ledger | Apply for leaves, check remaining balances, view company holidays, and cancel pending requests. |
| **Manager (`manager`)** | Direct Reports Directory & Team Calendar | Approve or reject requests from direct reports and view team calendars to plan schedules. |
| **HR Admin (`hr_admin`)** | Global Organization Directory & Settings | Manage employees, set leave policies, register public holidays, view audit logs, and export reports. |

---

## 5. Functional Requirements

### 5.1 User Authentication & Profile
* **FR-001 (Login):** Authenticate users using valid email and password credentials.
* **FR-002 (Session Security):** Lock accounts for 60 seconds after 5 failed login attempts.
* **FR-003 (Profile Editing):** Allow users to update their contact numbers and change passwords.

### 5.2 Employee Leave Lifecycle
* **FR-004 (Leave Request):** Allow employees to submit leave requests selecting a leave type, start date, end date, and reason (minimum 10 characters).
* **FR-005 (Balance Validation):** Automatically validate requests against available leave balances.
* **FR-006 (Duration Calculation):** Calculate leave durations excluding weekends and public holidays.
* **FR-007 (Cancellation):** Allow employees to cancel pending requests, immediately restoring their leave balance.

### 5.3 Manager Approvals
* **FR-008 (Approvals Queue):** Display pending requests from direct reports.
* **FR-009 (Review Actions):** Allow managers to approve or reject requests with required remarks.
* **FR-010 (Team Calendar):** Provide a monthly calendar view showing approved leaves for direct reports.

### 5.4 HR Admin Panel
* **FR-011 (Employee Directory CRUD):** Allow admins to create, read, update, and soft-delete employees.
* **FR-012 (Policy Settings):** Allow admins to set annual day limits and carry-forward rules for leave types.
* **FR-013 (Holidays Calendar):** Allow admins to add, edit, and delete company and national holidays.
* **FR-014 (Audit Logs):** Maintain a read-only list of all administrative actions.
* **FR-015 (Reports Export):** Export leave records, employee directory, and department data in CSV and JSON formats.

---

## 6. Non-Functional Requirements

### 6.1 Security
* **NFR-001 (Password Encryption):** Hash passwords using Bcrypt before saving them to the database.
* **NFR-002 (Stateless Auth):** Authenticate API requests using JSON Web Tokens (JWT) passed in the `Authorization` header.
* **NFR-003 (Rate Limiting):** Protect API endpoints against brute-force attacks using rate limiters.

### 6.2 Performance
* **NFR-004 (Response Latency):** API endpoints must resolve requests in less than 500ms under standard network loads.
* **NFR-005 (Database Indexing):** Optimize queries using indexes on frequently searched fields (`employeeId`, `email`, `status`).

### 6.3 Reliability & Usability
* **NFR-006 (Graceful Shutdowns):** The backend server must close active database connections gracefully when receiving termination signals.
* **NFR-007 (Responsive UI):** The interface must adjust to desktop, tablet, and mobile layouts.

---

## 7. Constraints & Assumptions

### Constraints
* **Decoupled Architecture:** Client and server must communicate exclusively via HTTP JSON REST endpoints.
* **Local Storage Limits:** Files uploaded as attachments are stored on local servers. Horizontal scaling requires moving uploads to shared storage.

### Assumptions
* **Timezone Consistency:** Client browsers synchronize with server timezones, or use the 24-hour validation buffer to apply for leaves starting "today".
* **Network Availability:** The database (MongoDB Atlas) remains accessible via connection strings.

---

## 8. Use Cases

### Use Case 1: Submitting a Leave Request
* **Actor:** Employee
* **Preconditions:** Authenticated, active profile, and sufficient leave balance.
* **Flow:**
  1. Employee navigates to **Apply Leave**.
  2. Employee selects leave type, dates, and enters the reason.
  3. System calculates duration (excluding weekends) and verifies available balance.
  4. Employee submits the request. The request is created in a `Pending` state, and a notification is sent to the manager.

### Use Case 2: Approving a Leave Request
* **Actor:** Manager
* **Preconditions:** Authenticated as a manager, with pending requests in the queue.
* **Flow:**
  1. Manager navigates to **Pending Approvals**.
  2. Manager reviews a pending request and enters remarks.
  3. Manager clicks **Approve**.
  4. System updates request status to `Approved`, decrements the employee's available balance, and logs the action in the audit logs.

---

## 9. Acceptance Criteria

* **AC-001 (Authentication):** Users must be redirected to `/login` if their JWT token is missing or expired.
* **AC-002 (Access Restriction):** Managers and employees must be blocked from accessing URLs starting with `/admin/*`.
* **AC-003 (Duration Calculation):** Applying for leave from Friday to Monday must count as 2 working days (excluding Saturday and Sunday).
* **AC-004 (Balance Deductions):** Leave balance must not update when a request is submitted (`Pending`). Deductions must only occur upon approval (`Approved`).
