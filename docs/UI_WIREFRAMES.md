# 🖥️ UI Wireframes & Layout Design — ELMS

This document outlines the user interface layout, wireframe details, and navigation panels of the **Employee Leave Management System (ELMS)**.

---

## 📌 Table of Contents
1. [Login Page](#1-login-page)
2. [Employee Dashboard](#2-employee-dashboard)
3. [Manager Dashboard](#3-manager-dashboard)
4. [HR/Admin Dashboard](#4-hradmin-dashboard)
5. [Leave Application Form](#5-leave-application-form)
6. [Leave History Logs](#6-leave-history-logs)
7. [Employee Management Directory](#7-employee-management-directory)
8. [Department Management](#8-department-management)
9. [Reports Dashboard](#9-reports-dashboard)
10. [System Settings Panel](#10-system-settings-panel)
11. [Notification Center panel](#11-notification-center-panel)

---

## 1. Login Page
Allows users to choose their role (`Employee`, `Manager`, or `HR Admin`) and authenticate using credentials.
* **Layout Design:** Split-pane layout. The left side displays a clean welcome graphic, and the right side displays the role selectors and login fields.
* **Screenshot Placeholder:**
  ![Login Page Wireframe](/docs/assets/screenshots/login_screen.png)

---

## 2. Employee Dashboard
The central dashboard for employees to track their leaves.
* **Layout Design:** 
  * **Top row:** Leave balances cards (Annual, Sick, Casual) displaying allowed, used, and available days.
  * **Bottom row (left):** A list of upcoming national and company holidays.
  * **Bottom row (right):** An activity feed showing the status of recent requests.
* **Screenshot Placeholder:**
  ![Employee Dashboard Wireframe](/docs/assets/screenshots/employee_dashboard.png)

---

## 3. Manager Dashboard
Provides managers with metrics to monitor team availability.
* **Layout Design:**
  * **Top row:** Stats cards displaying pending approvals count, team headcount on leave, and total direct reports.
  * **Main area:** A pending approvals queue showing details for recent requests.
* **Screenshot Placeholder:**
  ![Manager Dashboard Wireframe](/docs/assets/screenshots/manager_dashboard.png)

---

## 4. HR/Admin Dashboard
Allows administrators to configure settings and manage the directories.
* **Layout Design:**
  * **Top row:** Stats cards displaying company headcount, total departments, and active leave policies.
  * **Main area:** Recent audit logs and system configuration panels.
* **Screenshot Placeholder:**
  ![Admin Dashboard Wireframe](/docs/assets/screenshots/admin_dashboard.png)

---

## 5. Leave Application Form
The interface for submitting leave requests.
* **Layout Design:** A card layout containing:
  * Dropdown selector for leave types.
  * Date range pickers (Start Date, End Date).
  * Text area for the request reason (minimum 10 characters).
  * Live day calculator (excluding weekend days).
* **Screenshot Placeholder:**
  ![Leave Application Wireframe](/docs/assets/screenshots/apply_leave_form.png)

---

## 6. Leave History Logs
Displays an employee's leave request history.
* **Layout Design:** A paginated table showing:
  * Leave ID, Leave Type, dates range, status badge, and manager remarks.
  * Action buttons (e.g., **Cancel Request** for pending leaves).
* **Screenshot Placeholder:**
  ![Leave History Wireframe](/docs/assets/screenshots/leave_history.png)

---

## 7. Employee Management Directory
Allows administrators to manage employee accounts.
* **Layout Design:** A data table containing search and department filters:
  * Row items display employee IDs, names, emails, roles, and status toggles.
  * Includes buttons to add new employees, edit details, or soft-delete accounts.
* **Screenshot Placeholder:**
  ![Employee Directory Wireframe](/docs/assets/screenshots/admin_employees.png)

---

## 8. Department Management
Allows administrators to manage departments.
* **Layout Design:** A grid layout of department cards displaying:
  * Department names, managers, and headcounts.
  * Includes controls to add new departments, edit managers, or delete divisions.
* **Screenshot Placeholder:**
  ![Department Management Wireframe](/docs/assets/screenshots/admin_departments.png)

---

## 9. Reports Dashboard
Provides export tools for administrators.
* **Layout Design:** 
  * Options to export Employee directory rosters, Leave logs, or Department headcounts.
  * Buttons to export data in **CSV** or **JSON** formats.
* **Screenshot Placeholder:**
  ![Reports Dashboard Wireframe](/docs/assets/screenshots/admin_reports.png)

---

## 10. System Settings Panel
Global configuration parameters.
* **Layout Design:** Fields to update:
  * Custom company name, working weekdays checkmarks (Mon-Sun), and toggle options for email notifications.
* **Screenshot Placeholder:**
  ![System Settings Wireframe](/docs/assets/screenshots/admin_settings.png)

---

## 11. Notification Center Panel
The header dropdown menu displaying notification alerts.
* **Layout Design:**
  * Popover dropdown list toggled by clicking the Topbar bell button.
  * Displays unread notifications with checkmark dismiss buttons.
* **Screenshot Placeholder:**
  ![Notification Center Wireframe](/docs/assets/screenshots/notification_bell.png)
