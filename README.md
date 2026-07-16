# 🏢 Employee Leave Management System (ELMS)

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2018.x-brightgreen.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-%3E%3D%2018.x-blue.svg)](https://react.dev/)
[![Docker Support](https://img.shields.io/badge/docker-supported-blue.svg)](https://www.docker.com/)

A modern, production-grade enterprise Single Page Application (SPA) designed to automate corporate leave lifecycles. ELMS structures organization directories, leaves policies, date calculations, and approvals workflows into a role-secured portal.

Built using the **MERN Stack** (MongoDB, Express.js, React, Node.js), this system decouples client views from server logic using secure, stateless JWT RESTful APIs.

---

## 📌 Table of Contents
1. [Core Features](#-core-features)
2. [Technology Stack](#-technology-stack)
3. [Architecture Overview](#-architecture-overview)
4. [Quick Start (Local & Docker)](#-quick-start-local--docker)
5. [Default Credentials for Testing](#-default-credentials-for-testing)
6. [Documentation Hub Index](#-documentation-hub-index)
7. [Screenshots & UI Showcase](#-screenshots--ui-showcase)
8. [License](#-license)

---

## 🚀 Core Features

### 👤 Employee Self-Service
* **Leave Balances Ledgers:** Real-time visibility into Annual, Sick, and Casual leave allowances.
* **Duration Engine:** Automatic calculation of leave durations, excluding weekend days.
* **Resilient Validations:** 24-hour timezone offset buffer to support leave requests starting "today".
* **Alert Notifications:** Bell dropdown alerts when leave request statuses update.

### 👥 Manager Approvals & Scheduling
* **Review Queue:** Review pending leave requests from direct reports.
* **Remarks & Status Updates:** Approve or reject requests with required feedback remarks.
* **Team Calendar Visualizer:** Month-by-month calendar view showing direct reports' approved leaves to coordinate coverage.

### 🛡️ HR Administration Control
* **Employee Directory CRUD:** Register, edit, promote, or soft-delete employee profiles.
* **Corporate Structure:** Manage departments, assign managers, and monitor rosters.
* **Leave Policies:** Customize annual day limits and carry-forward rules for leave categories.
* **Holiday Calendars:** Register national and company holidays.
* **Auditing & Data Exports:** Read-only system audit trails and data exports (CSV/JSON).

---

## 💻 Technology Stack

* **Frontend Client:** React 18, Vite 8, Tailwind CSS v4, Radix UI Primitives, Lucide Icons, Axios.
* **Backend Application Server:** Node.js, Express.js, Mongoose ODM.
* **Database Layer:** MongoDB Atlas (NoSQL cloud cluster).
* **Security & Auth:** JSON Web Tokens (JWT), HTTP-Only cookies, Bcrypt encryption.
* **DevOps & Containers:** Docker, Docker Compose, Nginx.

---

## 🏗️ Architecture Overview

The system runs on a stateless, layered MVC model:

```text
  Web Browser (React SPA)
            │
            ▼ HTTPS Requests (JWT Bearer Token)
  Express API Server Gateway (Node.js)
            ├─► Rate Limiters & Helmet Security
            ├─► JWT Verification Middleware
            ├─► Mongoose Schema Validator
            ▼
  Controllers Layer (Request/Response Parsers)
            │
            ▼ Core Business Logic Handlers
  Services Layer (Balance Ledger calculations, date counts)
            │
            ▼ Mongoose Queries
  MongoDB Atlas Document Store
```

---

## ⚙️ Quick Start (Local & Docker)

### 🐋 Docker Compose (Fastest Setup)
1. Ensure Docker is running on your machine.
2. In the root directory of the project, run:
   ```bash
   docker compose up --build -d
   ```
3. The services will start automatically:
   * **Frontend Client:** Access at `http://localhost:80`
   * **Backend REST API:** Access at `http://localhost:5000`

---

### 💻 Local Manual Setup

#### 1. Database Connection
Ensure a local MongoDB server is active, or configure a cloud cluster in MongoDB Atlas.

#### 2. Backend Scaffolding
Navigate to `backend`, install dependencies, set up environment variables, and start the development server:
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/employee-leave-system
JWT_SECRET=super_secure_access_key_123!
JWT_REFRESH_SECRET=super_secure_refresh_key_456!
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```
Start the Nodemon server:
```bash
npm run dev
```

#### 3. Frontend Client
In a new terminal window, navigate to `frontend`, install dependencies, configure environment variables, and start the Vite dev server:
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` folder:
```env
VITE_API_URL=http://localhost:5000/api/v1
```
Start the Vite dev server:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🔑 Default Credentials for Testing

Use the following default accounts to test different role configurations:

| Role | Email | Password |
| :--- | :--- | :--- |
| **HR Admin** | `admin@company.com` | `password123` |
| **Manager** | `manager@company.com` | `password123` |
| **Employee** | `employee@company.com` | `password123` |

---

## 📚 Documentation Hub Index

Detailed technical blueprints and project guides are located in the [docs/](file:///c:/Users/Lenovo/OneDrive/Documents/Projects/employee-leave-management-system/docs) folder:

* 📝 **[SRS.md](file:///c:/Users/Lenovo/OneDrive/Documents/Projects/employee-leave-management-system/docs/SRS.md):** Software Requirements Specification (scopes, requirements, and constraints).
* 📦 **[SYSTEM_ARCHITECTURE.md](file:///c:/Users/Lenovo/OneDrive/Documents/Projects/employee-leave-management-system/docs/SYSTEM_ARCHITECTURE.md):** Unified frontend & backend architecture, state flows, layouts, folder structure, and conventions.
* 🗄️ **[DATABASE_SCHEMA.md](file:///c:/Users/Lenovo/OneDrive/Documents/Projects/employee-leave-management-system/docs/DATABASE_SCHEMA.md):** Collection schemas, validation constraints, and indexes.
* 📡 **[API_DOCUMENTATION.md](file:///c:/Users/Lenovo/OneDrive/Documents/Projects/employee-leave-management-system/docs/API_DOCUMENTATION.md):** REST API specifications, query filters, success wrappers, and error codes.
* ⚙️ **[INSTALLATION_GUIDE.md](file:///c:/Users/Lenovo/OneDrive/Documents/Projects/employee-leave-management-system/docs/INSTALLATION_GUIDE.md):** Detailed local and Docker installation walkthroughs.
* 🚀 **[DEPLOYMENT_PLAN.md](file:///c:/Users/Lenovo/OneDrive/Documents/Projects/employee-leave-management-system/docs/DEPLOYMENT_PLAN.md):** Production configurations for hosting on Render, Vercel, and Atlas clusters.
* 🧪 **[TESTING_REPORT.md](file:///c:/Users/Lenovo/OneDrive/Documents/Projects/employee-leave-management-system/docs/TESTING_REPORT.md):** Quality Assurance results and test cases tables.
* 📖 **[USER_MANUAL.md](file:///c:/Users/Lenovo/OneDrive/Documents/Projects/employee-leave-management-system/docs/USER_MANUAL.md):** Navigation flows and step-by-step role-based operational guides.
* 🖥️ **[UI_WIREFRAMES.md](file:///c:/Users/Lenovo/OneDrive/Documents/Projects/employee-leave-management-system/docs/UI_WIREFRAMES.md):** Visual wireframe guides and interface walkthroughs.
* 🎓 **[FINAL_PROJECT_REPORT.md](file:///c:/Users/Lenovo/OneDrive/Documents/Projects/employee-leave-management-system/docs/FINAL_PROJECT_REPORT.md):** Full academic project thesis.
* 🔮 **[FUTURE_ENHANCEMENTS.md](file:///c:/Users/Lenovo/OneDrive/Documents/Projects/employee-leave-management-system/docs/FUTURE_ENHANCEMENTS.md):** Product backlog items roadmap.

---

## 🖥️ Screenshots & UI Showcase

* **Login Panel Page:**
  ![Login Screenshot](/screenshots/login_screen.png)
* **Employee Leave Balance & Holidays Dashboard:**
  ![Employee Dashboard Screenshot](/screenshots/employee_dashboard.png)
* **Manager Review Queue Dashboard:**
  ![Manager Queue Screenshot](/screenshots/manager_dashboard.png)
* **Admin Corporate Department Management Cards:**
  ![Admin Departments Screenshot](/screenshots/admin_departments.png)

---

## 📄 License
ELMS is open-source software licensed under the [MIT License](https://opensource.org/licenses/MIT).