# ⚙️ Employee Leave Management System (ELMS) — Installation Guide

This guide provides step-by-step instructions to set up, install, and run the **Employee Leave Management System (ELMS)** locally, inside Docker containers, or as a production build.

---

## 📌 Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [Clone Repository](#2-clone-repository)
3. [MongoDB Atlas Setup](#3-mongodb-atlas-setup)
4. [Backend Installation & Configuration](#4-backend-installation--configuration)
5. [Frontend Installation & Configuration](#5-frontend-installation--configuration)
6. [Running Locally](#6-running-locally)
7. [Docker Setup](#7-docker-setup)
8. [Production Build](#8-production-build)
9. [Common Errors & Troubleshooting](#9-common-errors--troubleshooting)
10. [Project Structure Reference](#10-project-structure-reference)

---

## 1. Prerequisites
Ensure the following tools are installed on your machine:
* **Node.js** (v18.x or higher) & **npm** (v9.x or higher)
* **MongoDB** (v6.x or higher, if running a local database instance)
* **Git**
* **Docker** & **Docker Compose** (optional, for containerized deployments)

---

## 2. Clone Repository
Clone the project repository to your local machine:
```bash
git clone https://github.com/your-username/employee-leave-management-system.git
cd employee-leave-management-system
```

---

## 3. MongoDB Atlas Setup
If you want to use a cloud database cluster instead of a local instance:

1. Create a free account at [cloud.mongodb.com](https://cloud.mongodb.com).
2. Create a new shared cluster.
3. In **Database Access**, create a user with read and write permissions (`readWriteAnyDatabase` or specific to `employee-leave-system`).
4. In **Network Access**, add `0.0.0.0/0` to allow access from any IP address (or specify your server's IP address).
5. Click **Connect** and select **Drivers**. Copy the connection string (`mongodb+srv://...`).

---

## 4. Backend Installation & Configuration

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` folder and add the following configurations:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/employee-leave-system
   JWT_SECRET=super_secret_access_key_change_in_production_123!
   JWT_EXPIRE=15m
   JWT_REFRESH_SECRET=super_secret_refresh_key_change_in_production_456!
   JWT_REFRESH_EXPIRE=7d
   CLIENT_URL=http://localhost:5173
   ```
   > **Note:** If using MongoDB Atlas, replace `MONGODB_URI` with the connection string copied in step 3.

---

## 5. Frontend Installation & Configuration

1. Navigate to the `frontend` directory:
   ```bash
   cd ../frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` folder and add the following configuration:
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   ```

---

## 6. Running Locally

To run the application locally, you need to start both the backend and frontend dev servers.

### Starting the Backend Server
In the `backend` folder, start the API server:
```bash
# Runs the server with Nodemon (auto-reloads on file changes)
npm run dev
```
The backend server will run at `http://localhost:5000`. You should see the terminal log confirming a successful connection to MongoDB.

### Starting the Frontend Client
In the `frontend` folder, start the Vite development server:
```bash
npm run dev
```
The React frontend application will run at `http://localhost:5173`. Open this URL in your browser to access the portal.

---

## 7. Docker Setup

To run the application inside Docker containers:

1. Return to the root folder (containing `docker-compose.yml`).
2. Create `backend/.env` and `frontend/.env.production` files.
3. Build and launch the container cluster:
   ```bash
   docker compose up --build -d
   ```
4. Verify the containers are running:
   ```bash
   docker compose ps
   ```
   * **Frontend Container:** Exposed at `http://localhost:80` (Nginx server).
   * **Backend Container:** Exposed at `http://localhost:5000`.

---

## 8. Production Build

To build the application for production deployment:

### Backend Build
No build step is required for Node.js, but make sure to set `NODE_ENV=production` in your environment settings and start the server using:
```bash
npm start
```

### Frontend Build
Build the static frontend assets:
```bash
cd frontend
npm run build
```
This command compiles the React SPA into a `dist/` directory, optimizing CSS, JS, and HTML bundles. These static files can then be served using web servers like Nginx or hosted on platforms like Vercel, Netlify, or AWS S3.

---

## 9. Common Errors & Troubleshooting

### 🔴 Error: "MongooseServerSelectionError"
* **Cause:** The backend server cannot connect to MongoDB.
* **Fix:** Verify that your local MongoDB server is running (`mongod` command) or check that your database connection string in `backend/.env` is correct.

### 🔴 Error: "429 Too Many Requests"
* **Cause:** The Express rate limiter is blocking requests (triggered by multiple rapid actions during testing).
* **Fix:** Wait 60 seconds for the rate limiter window to cool down, or bypass localhost IPs by adjusting the rate-limiting parameters in `backend/src/config/rateLimit.js`.

### 🔴 Error: "CORS Blocked Response"
* **Cause:** The backend server received a request from an origin not whitelisted in the CORS configuration.
* **Fix:** Verify that the `CLIENT_URL` in your backend `.env` matches the origin of your frontend client (e.g., `http://localhost:5173`).

---

## 10. Project Structure Reference

```text
employee-leave-management-system/
├── backend/
│   ├── src/
│   │   ├── config/          # Configurations (db.js, logger.js, rateLimit.js)
│   │   ├── controllers/     # API request controllers
│   │   ├── middleware/      # Express middleware (auth.js, error.js)
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # Express route routers
│   │   ├── services/        # Business logic services
│   │   └── validators/      # Payload validators
│   ├── package.json
│   └── server.js            # Entry server file
├── frontend/
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── context/         # AuthContext provider
│   │   ├── layouts/         # Dashboard layout components
│   │   ├── pages/           # Pages (Dashboard, Applying, Roster)
│   │   ├── services/        # Service requests layer
│   │   └── main.jsx         # React application entry point
│   ├── package.json
│   └── vite.config.js       # Vite configuration file
└── docker-compose.yml       # Docker compose orchestration
```
