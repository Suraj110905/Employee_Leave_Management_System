# Production Deployment & Hosting Plan

This document details the build scripts, target cloud hosting platforms, configuration variables, and pipelines configuration to deploy the application to production.

---

## 🚀 Production Hosting Stack

We target a decoupled server-client cloud host infrastructure:

```
┌──────────────────┐               ┌──────────────────┐
│  Frontend (SPA)  │               │   Backend (API)  │
├──────────────────┤               ├──────────────────┤
│ Host: Vercel     │               │ Host: Render     │
└────────┬─────────┘               └────────┬─────────┘
         │ (HTTP / JSON)                    │ (Database Queries)
         ▼                                  ▼
┌─────────────────────────────────────────────────────┐
│ Database: MongoDB Atlas (Cloud Cluster DB)          │
└─────────────────────────────────────────────────────┘
```

---

## 🔧 Environment Configurations (Environment Variables)

### 1. Frontend Environment Variables (`.env.production`)
Create this file in the `frontend/` root folder during deployment:
```env
VITE_API_BASE_URL=https://api.leavemanagement.com/api/v1
VITE_APP_NAME="Employee Leave Management System"
VITE_APP_VERSION=v1.0.0
```

### 2. Backend Environment Variables (`.env`)
Configure these keys inside your Render/Railway hosting dashboard:
```env
PORT=5000
MONGODB_URI=mongodb+srv://admin:<password>@cluster0.mongodb.net/leave_management
JWT_SECRET=super_secret_jwt_encryption_key_2026
JWT_REFRESH_SECRET=super_secret_refresh_encryption_key_2026
NODE_ENV=production
```

---

## 📦 Build Procedures & Verification

To prepare assets for deployment:

### 1. Frontend Build Verification
Verify client assets compiles warning-free:
```bash
cd frontend
npm run build
```
Vite will output optimized static files inside `dist/`. Map this directory as the publish directory in Vercel.

### 2. Backend Container Setup
Start using PM2 or Docker configurations inside your Render webservice:
```dockerfile
# Dockerfile placeholder
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

---

## 🔄 CI/CD Deployment Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml` in project root:
```yaml
name: Production Deployment CI/CD

on:
  push:
    branches: [ main ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Use Node.js
      uses: actions/setup-node@v4
      with:
        node-size: 20
        
    - name: Validate Frontend Assets Build
      run: |
        cd frontend
        npm install
        npm run build
```
 Vercel and Render dashboards automatically detect successful main branch commits to initiate live deploys.
