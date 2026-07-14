# Development Guidelines & Setup Instructions

This document outlines environment configurations, directory definitions, dependencies setup, and running operations for developers.

---

## 🔧 Local Environment Requirements

Before launching the workspace:
* **Node.js**: Version 18.x or 20.x (Recommended LTS).
* **NPM**: Version 9.x or 10.x.
* **Database**: MongoDB (Local instance or MongoDB Atlas account for backend integration).

---

## 🚀 Getting Started Operations

### 1. Frontend Setup
Navigate to the frontend folder and download modules:
```bash
# Navigate to workspace
cd frontend

# Install dependencies
npm install

# Launch Vite hot-reload server
npm run dev

# Build production bundle assets
npm run build
```

The application will launch on your local host port: `http://localhost:5173`.

### 2. Backend Setup (Future Phase)
Once database development starts, execute:
```bash
# Navigate to backend folder
cd backend

# Install modules
npm install

# Launch development nodemon server
npm run dev
```

---

## 🗂️ Component Design Guidelines

To preserve code cleanliness and decouple business logic:

1. **State Isolation**: Page orchestrators (`pages/`) store states, fetch databases, and coordinate skeletons. Presentational widgets (`components/`) receive values as plain props and bubble up click handlers.
2. **Path Aliasing**: Always refer to project roots using `@/` path abbreviations:
   * **Correct**: `import StatCard from "@/components/dashboard/StatCard"`
   * **Incorrect**: `import StatCard from "../../components/dashboard/StatCard"`
3. **No Direct Service Imports**: Presentational components must never import services or hooks (like `useAuth()`) directly to ensure high unit testing and reuse indices.

---

## ⚡ Mock Swapping Configurations
To hook the frontend up to live server endpoints in Phase 10:
1. Open the target mock service file (e.g. `src/services/mock/leaveService.js`).
2. Replace mock timer functions with Axios client calls (apiClient wrapper is preconfigured inside `src/lib/axios.js` to automatically forward headers and handle requests).
3. Confirm that all component rendering logic remains completely untouched.
