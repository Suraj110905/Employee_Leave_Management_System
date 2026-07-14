# System Architecture Documentation

This document describes the high-level architecture, directory layout, routing state guards, authentication patterns, and presentation component policies for the **Employee Leave Management System**.

---

## 🏗️ Technology Stack

The application is structured as a modern Single Page Application (SPA):

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Core Framework** | React 19 + Vite 8 | Next-generation rendering engine and ultra-fast asset compilation. |
| **Routing Security** | React Router v7 | Declarative nested client routing and lazy boundary resolution. |
| **Design System** | Tailwind CSS v4 | Global variable-based modern CSS utility layer. |
| **Primitives Engine** | Base UI (`@base-ui/react`) | Unstyled fully accessible interactive markup. |
| **Mock Database** | JavaScript Service Layers | Abstracted service layers mimicking database transaction latencies. |

---

## 📁 Repository Directory Structure

The frontend repository is divided logically by concerns:

```
employee-leave-management-system/
├── docs/                           # High-level system architecture documents
│   ├── ARCHITECTURE.md             # Core system design parameters (this file)
│   └── FRONTEND_ARCHITECTURE.md    # Frontend layout definitions
└── frontend/
    ├── src/
    │   ├── components/             # Reusable visual presenter components
    │   │   ├── dashboard/          # Cards for Employee / Manager views
    │   │   ├── leave-application/  # Input fields and balance projections
    │   │   ├── leave-history/      # Tables, filters panels, and timeline trackers
    │   │   ├── layout/             # Sidebar navigation and headers
    │   │   └── ui/                 # Core primitive custom styled components
    │   ├── constants/              # Static routes, roles configurations
    │   ├── context/                # AuthContext session providers
    │   ├── data/                   # JSON collections simulating DB entries
    │   ├── layouts/                # Structural layout page controllers
    │   ├── lib/                    # apiClient Axios client instances
    │   ├── middleware/             # ProtectedRoute and RoleProtectedRoute check wrappers
    │   ├── pages/                  # Stateful view controllers orchestrators
    │   ├── services/               # Mock API gateways handles
    │   └── utils/                  # Reusable helper utility calculations
    ├── vite.config.js              # Vite server settings
    └── package.json                # Project dependencies
```

---

## 🛣️ Routing Flow

Routing is driven by nested parameters in React Router v7:

```
                  ┌──────────────────────┐
                  │   BrowserRouter      │
                  └──────────┬───────────┘
                             │
              ┌──────────────┴──────────────┐
              ▼                             ▼
     ┌─────────────────┐           ┌─────────────────┐
     │  Public Layout  │           │ Protected Route │
     └────────┬────────┘           └────────┬────────┘
              │                             │
       ┌──────┴──────┐               ┌──────┴──────┐
       ▼             ▼               ▼             ▼
    [/login]       [/]       [RoleProtectedRoute]
                                     │
                    ┌────────────────┼────────────────┐
                    ▼                ▼                ▼
                [Employee]       [Manager]        [HR Admin]
                    │                │                │
            [/employee/*]       [/manager/*]      [/admin/*]
```

* **Route Declarations**: Defined centrally in [routes.index](file:///c:/Users/Lenovo/OneDrive/Documents/Projects/employee-leave-management-system/frontend/src/routes/index.jsx) using React `lazy` for bundle splitting.
* **Fallback Rules**: Any unmatched routes fall back to a 404 page, and unauthorized permissions redirect to `/unauthorized`.

---

## 🔐 Authentication Flow

The security boundaries are managed globally by the authentication middleware wrapper:

```
📱 Client Credentials Form
   ↓
🔐 AuthService.login()
   ↓ [Validates mock profiles & signs local token]
💾 Token Storage Layer (utils/token.js)
   ├─► Remember Me: Toggled   ──► Saved in localStorage
   └─► Remember Me: Untoggled ──► Saved in sessionStorage
   ↓
🔄 AuthProvider Session Update
   └─► Sets state: isAuthenticated = true, loading = false
```

### 📡 Interceptor Auto-injection
All network requests configured via the Axios HTTP Client automatically register request filters to append headers:
```javascript
// src/lib/axios.js
apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

---

## 📊 State Management Model

To maintain a clean architectural separation between business logic and rendering, state ownership follows a unidirectional design:

```
1. Client Event ──► Presentational Component (stateless) bubbles up event
2. Orchestrator ──► Stateful Page (pages/*) processes state updates
3. Data Query   ──► Calls Service Gateway (services/*) returns Promises
4. UI Repaint   ──► Orchestrator passes new data down as simple React Props
```

* **Global Session State**: Owned by `AuthContext.jsx`, providing session context parameters (`user`, `isAuthenticated`, `loading`).
* **Page-Specific Domain State**: Owned by orchestrator page containers (e.g. `ApplyLeave.jsx`, `LeaveHistory.jsx`).
* **UI Presentational State**: UI components do not maintain network states. If they have internal state (e.g., search keywords input), it is temporary and bubbles up on complete actions.

---

## ☁️ API Layer & Service Architecture

Our API layer uses a **Service Layer Abstraction** to ensure components are decoupled from specific data sources.

### 🔌 Service Layer Gateway Contracts
UI files never import Axios client configurations directly. They communicate exclusively through service objects:
```javascript
// src/services/mock/leaveService.js
export const leaveService = {
  getBalances: async (userId) => {
    // return apiClient.get(`/leaves/balances/${userId}`);
    return mockBalances;
  },
  submitLeave: async (userId, leaveData) => {
    // return apiClient.post(`/leaves`, leaveData);
    return mockSave(leaveData);
  }
};
```

---

## ⚡ Future Express Architecture Compatibility

Transitioning to a real Express backend requires **zero changes** to the presentation layer:

```
Current:  [UI Presenters] ──► [Page Containers] ──► [Mock Service Layer]
                                                           │ (Simulates delays & returns mocks)
                                                           ▼
Express:  [UI Presenters] ──► [Page Containers] ──► [Express Axios Service Layer]
                                                           │ (apiClient.post/get requests)
                                                           ▼
                                                    [Express Server Controllers]
                                                           │ (Node.js/SQL queries)
```

To switch, developers only need to swap mock functions in the service folder with standard Axios API endpoints (e.g., swapping `leaveService.js` contents to make real backend HTTP calls).

---

## 🎨 Theme & Styling System

Styling is driven by **Tailwind CSS v4** utilizing HSL theme variables:

```css
/* src/index.css */
@theme {
  --background: hsl(0 0% 100%);
  --foreground: hsl(222.2 84% 4.9%);
  --card: hsl(0 0% 100%);
  --primary: hsl(142.1 76.2% 36.3%);
  --sidebar: hsl(222.2 47.4% 11.2%);
}
```

* **Semantic Classes**: Components must use semantic tailwind variable names (e.g. `bg-card`, `text-foreground`, `border-border`) rather than hardcoded absolute color hex codes.
* **Centralized Status Badges**: All colors (e.g. Approved = emerald, Rejected = rose) are defined in `src/constants/dashboard.js` to ensure visual consistency.

---

## 🏷️ Naming Conventions

To keep the codebase maintainable, we enforce strict naming rules:

* **Presentational Components**: TitleCase starting with a noun (e.g., `StatCard.jsx`, `LeaveTimeline.jsx`, `FiltersPanel.jsx`).
* **Service Modules**: camelCase ending with "Service" (e.g., `leaveService.js`, `historyService.js`).
* **Utilities/Helpers**: camelCase ending with "Utils" (e.g., `historyUtils.js`).
* **Constants**: UPPER_SNAKE_CASE (e.g., `LEAVE_STATUS`, `ROUTES`).
* **Directories**: kebab-case (e.g., `leave-application/`, `leave-history/`).
