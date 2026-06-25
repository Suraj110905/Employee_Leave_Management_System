# Database Design and ERD

## Overview

This document explains the database design for the Employee Leave Management System. The database stores users, employees, departments, leave types, leave requests, leave balances, holidays, and notifications.

## Main Entities

### 1. User

Stores login and authentication details.

Fields:
- id
- username
- email
- password
- role
- is_active
- created_at

Roles:
- Employee
- Manager
- HR Admin

---

### 2. EmployeeProfile

Stores employee-specific information.

Fields:
- id
- user_id
- employee_code
- department_id
- manager_id
- designation
- joining_date
- phone
- address

---

### 3. Department

Stores department details.

Fields:
- id
- name
- description

Examples:
- HR
- IT
- Sales
- Finance

---

### 4. LeaveType

Stores different types of leaves.

Fields:
- id
- name
- total_days
- carry_forward_allowed
- is_paid
- description

Examples:
- Sick Leave
- Casual Leave
- Paid Leave
- Unpaid Leave

---

### 5. LeaveRequest

Stores employee leave applications.

Fields:
- id
- employee_id
- leave_type_id
- start_date
- end_date
- total_days
- reason
- status
- manager_comment
- applied_at
- updated_at

Status:
- Pending
- Approved
- Rejected
- Cancelled

---

### 6. LeaveBalance

Stores leave balance for each employee.

Fields:
- id
- employee_id
- leave_type_id
- total_allocated
- used_leaves
- remaining_leaves
- year

---

### 7. Holiday

Stores company holidays.

Fields:
- id
- name
- date
- location
- description

---

### 8. Notification

Stores system notifications.

Fields:
- id
- user_id
- message
- is_read
- created_at

---

## Relationships

User has one EmployeeProfile.

Department has many EmployeeProfiles.

EmployeeProfile has many LeaveRequests.

LeaveType has many LeaveRequests.

EmployeeProfile has many LeaveBalances.

LeaveType has many LeaveBalances.

User has many Notifications.

## Simple ER Flow

```text
User
 |
 | 1:1
 |
EmployeeProfile
 |
 | many:1
 |
Department

EmployeeProfile
 |
 | 1:many
 |
LeaveRequest
 |
 | many:1
 |
LeaveType

EmployeeProfile
 |
 | 1:many
 |
LeaveBalance
 |
 | many:1
 |
LeaveType

User
 |
 | 1:many
 |
Notification

```mermaid
erDiagram
    USER ||--|| EMPLOYEE_PROFILE : has
    DEPARTMENT ||--o{ EMPLOYEE_PROFILE : contains
    EMPLOYEE_PROFILE ||--o{ LEAVE_REQUEST : creates
    LEAVE_TYPE ||--o{ LEAVE_REQUEST : used_for
    EMPLOYEE_PROFILE ||--o{ LEAVE_BALANCE : owns
    LEAVE_TYPE ||--o{ LEAVE_BALANCE : tracks
    USER ||--o{ NOTIFICATION : receives

    USER {
        int id
        string username
        string email
        string password
        string role
        boolean is_active
        datetime created_at
    }

    EMPLOYEE_PROFILE {
        int id
        int user_id
        string employee_code
        int department_id
        int manager_id
        string designation
        date joining_date
        string phone
        string address
    }

    DEPARTMENT {
        int id
        string name
        string description
    }

    LEAVE_TYPE {
        int id
        string name
        int total_days
        boolean carry_forward_allowed
        boolean is_paid
        string description
    }

    LEAVE_REQUEST {
        int id
        int employee_id
        int leave_type_id
        date start_date
        date end_date
        int total_days
        string reason
        string status
        string manager_comment
        datetime applied_at
        datetime updated_at
    }

    LEAVE_BALANCE {
        int id
        int employee_id
        int leave_type_id
        int total_allocated
        int used_leaves
        int remaining_leaves
        int year
    }

    HOLIDAY {
        int id
        string name
        date date
        string location
        string description
    }

    NOTIFICATION {
        int id
        int user_id
        string message
        boolean is_read
        datetime created_at
    }
    ```