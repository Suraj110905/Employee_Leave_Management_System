# 📖 Employee Leave Management System (ELMS) — User Manual

Welcome to the **Employee Leave Management System (ELMS)** User Manual. This guide provides step-by-step instructions for employees, managers, and HR administrators to navigate the platform.

---

## 📌 Table of Contents
1. [Introduction](#1-introduction)
2. [Application Navigation Flow](#2-application-navigation-flow)
3. [Login & Profile Setup](#3-login--profile-setup)
4. [Employee Module Guide](#4-employee-module-guide)
5. [Manager Module Guide](#5-manager-module-guide)
6. [HR/Admin Module Guide](#6-hradmin-module-guide)
7. [Applying for Leave](#7-applying-for-leave)
8. [Approving/Rejecting Leave](#8-approvingrejecting-leave)
9. [Notification Center](#9-notification-center)
10. [Spotlight Search](#10-spotlight-search)
11. [Exporting Reports](#11-exporting-reports)
12. [System Configurations](#12-system-configurations)
13. [FAQs & Troubleshooting](#13-faqs--troubleshooting)
14. [Platform Best Practices](#14-platform-best-practices)

---

## 1. Introduction
ELMS is a self-service system designed to automate leave requests and approvals.
* **Role Hierarchy:**
  * **Employees:** Apply for leaves, check balances, and view notifications.
  * **Managers:** Review leaves for direct reports and view team calendars.
  * **HR Admins:** Manage employees, set leave policies, and export reports.

---

## 2. Application Navigation Flow
The layout structure maps user pathways based on roles after login:

```text
               ┌───────────────────────┐
               │    Login Dashboard    │
               └───────────┬───────────┘
                           │
             ┌─────────────┼─────────────┐
             ▼             ▼             ▼
       [Employee]      [Manager]     [HR Admin]
         │               │             │
         ├─► Dashboard   ├─► Dashboard ├─► Dashboard
         ├─► Apply Leave ├─► Approvals ├─► Employees
         ├─► History     ├─► Calendar  ├─► Departments
         ├─► Balances    ├─► Team      ├─► Policies
         ├─► Alerts      ├─► Alerts    ├─► Holidays
         └─► Profile     └─► Profile   ├─► Reports
                                       └─► Settings
```

Every user can safely return to the `/login` portal by clicking the **Logout** button on the Topbar menu.

---

## 3. Login & Profile Setup

### Accessing the Portal
1. Open your browser and navigate to `http://localhost:5173`.
2. Select your role (`Employee`, `Manager`, or `HR Admin`) from the dropdown.
3. Enter your corporate email and password.
4. Click **Sign In**.

> **Default Accounts for Testing:**
> * **HR Admin:** `admin@company.com` / `password123`
> * **Manager:** `manager@company.com` / `password123`
> * **Employee:** `employee@company.com` / `password123`

![Login Screen Placeholder](/screenshots/login_screen.png)

### Managing Your Profile
Click on your avatar in the Topbar header and select **Profile** to update your contact number or change your login password.

---

## 4. Employee Module Guide

As an employee, your dashboard highlights your leave ledger and alerts:
* **Balances Cards:** Displays available days for Annual, Sick, and Casual leaves.
* **Upcoming Holidays:** Lists upcoming company and national holidays.
* **Recent Activity Feed:** Shows status updates for your submitted leave requests.

![Employee Dashboard Placeholder](/screenshots/employee_dashboard.png)

---

## 5. Manager Module Guide

Managers oversee team scheduling and review pending leave requests:
* **Team Metrics:** Displays pending approvals, team size, and headcount currently on leave.
* **Pending Approvals Queue:** Review requests from direct reports.
* **Team Calendar:** View approved leaves in a calendar interface to coordinate scheduling and prevent understaffing.

Layout Dashboard is also documented in [Navigation Flow](#2-application-navigation-flow).

![Manager Dashboard Placeholder](/screenshots/manager_dashboard.png)

---

## 6. HR/Admin Module Guide

HR Admins configure policies and manage staff rosters:
* **Employee Directory:** Add new employees, modify details, promote roles, or soft-delete accounts.
* **Corporate Departments:** Manage company divisions and monitor headcounts.
* **Leave Policies:** Set annual limits and carry-forward rules for leave types.
* **Holiday Calendar:** Add national and company holidays.
* **Audit Logs:** View a read-only list of system activities.

![Admin Directory Placeholder](/screenshots/admin_employees.png)

---

## 7. Applying for Leave

To apply for leave, navigate to **Apply Leave** from the sidebar:

1. **Select Type:** Choose from Annual, Sick, or Casual leave.
2. **Select Dates:** Pick your start and end dates.
3. **Reason:** Provide a brief explanation (minimum 10 characters).
4. **Submit:** Click **Apply**.

> [!NOTE]
> The system automatically excludes weekend days when calculating your leave duration.

![Apply Leave Placeholder](/screenshots/apply_leave_form.png)

---

## 8. Approving/Rejecting Leave

To process requests, navigate to **Pending Approvals** (as a Manager):

### Approving a Request
1. Click **Review** on the leave request item.
2. Enter comments in the **Remarks** input.
3. Click **Approve**. The employee's leave balance will be updated automatically.

### Rejecting a Request
1. Click **Review** on the leave request item.
2. Enter the reason for rejection in **Remarks**.
3. Click **Reject**.

---

## 9. Notification Center

The Bell 🔔 icon in the header displays your pending notifications:
* **Unread Badge:** Displays a count of unread notifications.
* **Dropdown List:** Click the Bell icon to view notification details.
* **Mark as Read:** Click the checkmark (`✓`) icon on a notification to dismiss it.
* **Clear All:** Click **Mark all as read** to clear the list.

![Notification Dropdown Placeholder](/screenshots/notification_bell.png)

---

## 10. Spotlight Search

Use the search bar next to the notification bell for quick navigation:
1. Type search queries (e.g., `"Eng"` or `"Sick"`).
2. The popup lists matching employees, departments, and holidays.
3. Click on search results to navigate to the corresponding page.

---

## 11. Exporting Reports

Navigate to **System Reports** (as an Admin):
1. **Choose Category:** Select Leave logs, Employees roster, or Department headcounts.
2. **Choose Format:** Click **Export CSV** or **Export JSON**.
3. The report file will download directly to your computer.

---

## 12. System Configurations

Navigate to **System Settings** (as an Admin):
* **Company Name:** Update the company name shown on dashboards and headers.
* **Working Weekdays:** Select your weekly working days (e.g., Monday through Friday).
* **Workflows:** Toggle multi-stage manager reviews or global email alerts.

---

## 13. FAQs & Troubleshooting

### ❓ FAQ

**Q: Can I apply for leave starting today?**
**A:** Yes. The system has a 24-hour buffer to handle timezone differences, allowing you to submit leave requests starting on your local "today".

**Q: Can I cancel an approved leave request?**
**A:** Approved requests cannot be cancelled directly. Please contact your manager or HR administrator to manually void the record.

**Q: What happens when I soft-delete an employee?**
**A:** The employee's status changes to inactive. They cannot log in, and their data is hidden from directories but preserved for audit logs.

---

### 🩺 Troubleshooting

#### Error: "429 Too Many Requests"
* **Cause:** You submitted too many login attempts or requests in a short period.
* **Fix:** Wait 60 seconds for the rate limiter to cool down, then try again.

#### Error: "Insufficient Leave Balance"
* **Cause:** You requested more days than you have available.
* **Fix:** Check your **Leave Balances** and submit a shorter request, or select a different leave type.

---

## 14. Platform Best Practices

* **Submit Requests Early:** Submit leave requests ahead of time to allow managers to review coverage.
* **Coordinate Calendar Coverage:** Managers should check the **Team Calendar** before approving leaves to prevent understaffing.
* **Use Strong Passwords:** Set secure passwords using at least 8 characters, including numbers and symbols. Change your password regularly.
* **Audit Log Inspections:** Admins should check the **Audit Logs** weekly to monitor configuration changes and ensure security compliance.
