# 📄 Employee Leave Management System (ELMS) — Final Project Report

---

### **A Major Project Report Submitted in Partial Fulfillment of the Requirements for the Degree of Bachelor of Technology in Computer Science & Engineering**

---

## 📌 Table of Contents
1. [Abstract](#1-abstract)
2. [Introduction](#2-introduction)
3. [Problem Statement](#3-problem-statement)
4. [Objectives](#4-objectives)
5. [Scope](#5-scope)
6. [Technology Stack](#6-technology-stack)
7. [System Design](#7-system-design)
8. [Implementation Details](#8-implementation-details)
9. [Testing & Quality Assurance](#9-testing--quality-assurance)
10. [Results & Dashboards Showcase](#10-results--dashboards-showcase)
11. [Development Challenges Resolved](#11-development-challenges-resolved)
12. [Future Enhancements](#12-future-enhancements)
13. [Project Journey & Implementation Timeline](#13-project-journey--implementation-timeline)
14. [Conclusion](#14-conclusion)
15. [References](#15-references)

---

## 1. Abstract
The **Employee Leave Management System (ELMS)** is a web application designed to automate the administration of leave requests within corporate organizations. Developed using the MERN stack (MongoDB, Express, React, and Node.js), the system decouples client views from database servers through a RESTful API. ELMS supports role-based access control (RBAC) across three organizational tiers: Employees, Managers, and HR Administrators. Key features include automatic exclusion of weekend dates during leave applications, interactive calendar coordination for team schedules, live notification alerts, and comprehensive CSV/JSON report exports. The project enforces security best practices through rate limiters, token rotation, and data validation layers.

---

## 2. Introduction
In modern enterprise environments, managing employee leaves manually using spreadsheets or physical forms is inefficient and error-prone. These manual processes can result in scheduling conflicts, miscalculated balances, and coordination delays between managers and employees. 

ELMS addresses these challenges by automating leave requests, approvals, policy configurations, and reporting. Employees can apply for leaves, track approval statuses, and monitor their available balances. Managers can review pending requests, check team calendars, and monitor department availability. HR Administrators configure company policies, holiday calendars, and manage employee directories.

---

## 3. Problem Statement
Traditional paper-based or spreadsheet-driven leave tracking processes present several operational challenges:
* **Coordination Overhead:** Back-and-forth communication between employees, managers, and HR leads to delays.
* **Lack of Visibility:** Employees cannot easily view their remaining balances, and managers cannot view team availability calendars.
* **Human Error:** Miscalculations in leave balances and scheduling overlaps can lead to understaffing.
* **Security & Audits:** Lack of secure access controls and centralized audit trails for tracking policy and user changes.

---

## 4. Objectives
The primary objectives of the ELMS project are:
1. **Automation:** Automate the leave lifecycle from request submission to manager approval and balance deduction.
2. **Access Control:** Secure the application using role-based access control (RBAC) for Employees, Managers, and HR Admins.
3. **Visibility:** Provide managers with a team calendar to coordinate schedules and prevent understaffing.
4. **Data Integrity:** Prevent balance overdrafts and calculate leave durations accurately (excluding weekends and public holidays).
5. **Security:** Implement stateless session handling using JSON Web Tokens (JWT) and restrict API access using Helmet and CORS.

---

## 5. Scope
The scope of the ELMS project covers:
* **Identity Management:** User registration, secure login, password resets, and role modifications.
* **Leave Workflows:** Leave requests, cancellations, and approvals with multi-manager stages.
* **Calendar Integration:** Interactive team availability calendars for managers.
* **Holiday Management:** Global company and national holiday calendars.
* **System Reports:** Exporting system data (leaves, employees, and departments) in CSV and JSON formats.
* **Notification Center:** Dynamic notification alerts (e.g., when leaves are submitted or holidays are registered).
* **Audit Trails:** Centralized logs of all administrative and security actions.

---

## 6. Technology Stack

### Frontend (Client Layer)
* **React 18:** Component-based UI library.
* **Vite:** High-performance frontend build tool.
* **Tailwind CSS:** Responsive layout styling.
* **Radix UI:** Accessible component library.

### Backend (Application Server Layer)
* **Node.js:** Server runtime environment.
* **Express.js:** Web application framework for building REST APIs.
* **Mongoose:** Object Data Modeling (ODM) library for MongoDB.

### Database (Data Storage Layer)
* **MongoDB Atlas:** Cloud NoSQL document store.

### Security & Utilities
* **JSON Web Tokens (JWT):** Stateless authentication.
* **Bcrypt:** Secure password hashing.
* **Winston:** Server logging framework.

---

## 7. System Design

The system is designed as a decoupled, layered architecture:

```text
  +-------------------------------------------------------------+
  |                   Web Client (React / Vite)                 |
  +-------------------------------------------------------------+
                               |
                               | HTTPS REST Requests (JWT)
                               v
  +-------------------------------------------------------------+
  |                  API Gateway (Express.js)                   |
  +-------------------------------------------------------------+
                               |
       +-----------------------+-----------------------+
       |                       |                       |
       v                       v                       v
+--------------+        +--------------+        +--------------+
| Auth Check   |        | Payload Val  |        | Rate Limiter |
+--------------+        +--------------+        +--------------+
       |                       |                       |
       +-----------------------+-----------------------+
                               |
                               v
  +-------------------------------------------------------------+
  |                      Controller Layer                       |
  +-------------------------------------------------------------+
                               |
                               v
  +-------------------------------------------------------------+
  |                     Business Service Layer                  |
  +-------------------------------------------------------------+
                               |
                               v
  +-------------------------------------------------------------+
  |                       Database (MongoDB)                    |
  +-------------------------------------------------------------+
```

---

## 8. Implementation Details

### Database Design
ELMS stores data across 9 key MongoDB collections:
* `users`: Stores credentials, roles, departments, and communication preferences.
* `leaverequests`: Records leave durations, reasons, statuses, and manager remarks.
* `leavebalances`: Tracks available, used, and allowed days for each leave type per employee.
* `departments`: Stores department names, managers, and headcounts.
* `leavetypes`: Configures leave policies, annual limits, and carry-forward rules.
* `holidays`: Stores company and national holidays.
* `notifications`: Manages unread/read alerts for users.
* `auditlogs`: Logs administrative actions.
* `settings`: Stores global system configurations.

### API Architecture
The backend routes API requests through middleware pipelines (authentication, authorization, rate limiting, and input validation) before handing off to controllers:
* `/api/v1/auth`: Authentication and password resets.
* `/api/v1/users`: Profile details and settings.
* `/api/v1/leaves`: Leave applications, history, and balances.
* `/api/v1/manager`: Team approvals, rosters, and calendars.
* `/api/v1/admin`: Employee CRUD, department structures, policy changes, and audit logs.

### Frontend
The frontend is built using React, using Context Providers (`AuthContext`) for auth state management and Axios interceptors to handle token refreshes and route protection.

---

## 9. Testing & Quality Assurance
The application was validated using automated API integration tests (`backend/tests/`) and manual end-to-end tests:
* **Auth Validation:** Verified that incorrect credentials block logins, and validated that rate limiters trigger after repeated failures.
* **Authorization Checking:** Verified that role permissions block employees from accessing HR settings (`403 Forbidden`).
* **Workflow Integrity:** Verified that leave requests subtract days from the correct balance categories, and confirmed that cancelling a leave restores the balance.
* **Edge Case Verification:** Handled timezone differences (using a 24-hour offset buffer) to allow leave requests starting "today".

---

## 10. Results & Dashboards Showcase
The system was successfully deployed in a development environment:
* **Admin Dashboard:** Displays employee directory grids, department headcount cards, policy controls, holiday creators, and audit log tables.
* **Manager Dashboard:** Displays team leave request approval grids, metrics cards, and calendar views showing approved leaves.
* **Employee Dashboard:** Displays leave request forms, available balances cards, and notification feeds.

---

## 11. Development Challenges Resolved
* **Timezone Synchronization:** Adjusted client-server date validation checks using a 24-hour offset buffer, allowing users in any timezone to submit leave requests starting on their local "today".
* **State Updates:** Fixed a bug in the leave cancellation workflow by updating the backend API to return the modified request document instead of a success string, allowing the frontend table UI to update state smoothly.
* **Manager ID Parsing:** Created a parser regex in the employee registration workflow to extract and store clean IDs (e.g. `MGR-20015`) when admins select manager entries containing parenthesized names.
* **Interactive Notifications Dropdown:** Replaced the static notification bell with an interactive DropdownMenu, allowing users to mark alerts as read in real-time.

---

## 12. Future Enhancements
* **Shared Storage Buckets:** Store leave request attachments in cloud buckets (e.g. AWS S3) instead of local servers to support horizontal scaling.
* **WebSocket Alerts:** Implement WebSockets for real-time notification alerts, replacing the current HTTP polling mechanism.
* **Automated Test Coverage:** Set up E2E automated test suites (using Cypress) and unit test pipelines (using Vitest) to check frontend components and service actions.

---

## 13. Project Journey & Implementation Timeline
The development journey followed a structured, incremental approach from requirements mapping to deployment readiness:

* **Initial Phase (Late June):** Focused on requirement definitions (SRS creation, system specifications) and environment configurations. The project was initially structured around a backend scaffolding, which was later refined into a modular Node.js Express framework.
* **UI Scaffolding Phase (Early July):** Built presentational components, pages routing pathways, grids, and mock service layers first to visualize final UI constraints.
* **Integrations & Refactoring (Mid-July):** Connected real Express controllers to frontends, substituting mock states with secure REST calls. Fixed bugs related to timezone validations, deactivations, dashboard stats metrics, and real-time alerts.

---

## 14. Conclusion
The ELMS project automated the leave lifecycle within corporate organizations. By using the MERN stack, we created a decoupled, role-secured system that prevents scheduling conflicts and calculates leave balances accurately. The application enforces security best practices and is ready for production hosting.

---

## 15. References
1. *MERN Web Development, Second Edition*, Packt Publishing, 2018.
2. Express.js Official Documentation: [expressjs.com](https://expressjs.com)
3. React Official Documentation: [react.dev](https://react.dev)
4. Mongoose Documentation: [mongoosejs.com](https://mongoosejs.com)
5. MongoDB Atlas Database Guides: [mongodb.com/docs/atlas](https://www.mongodb.com/docs/atlas/)
