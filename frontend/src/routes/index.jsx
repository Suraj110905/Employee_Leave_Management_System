import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layout components
import PublicLayout from "@/layouts/PublicLayout";
import DashboardLayout from "@/layouts/DashboardLayout";

// Route protection guards
import ProtectedRoute from "@/middleware/ProtectedRoute";
import RoleProtectedRoute from "@/middleware/RoleProtectedRoute";

// Auth context hook
import { useAuth } from "@/context/AuthContext";

// Constants & Mock data
import { ROUTES } from "@/constants/routes";
import { ROLES } from "@/constants/roles";
import { SIDEBAR_ITEMS } from "@/constants/sidebar";
import { DUMMY_NOTIFICATIONS } from "@/data/notifications";

// Lazy loading all page views
const Login = lazy(() => import("@/pages/auth/Login"));
const ForgotPassword = lazy(() => import("@/pages/auth/ForgotPassword"));
const Unauthorized = lazy(() => import("@/pages/auth/Unauthorized"));

// Employee views
const EmployeeDashboard = lazy(() => import("@/pages/employee/Dashboard"));
const ApplyLeave = lazy(() => import("@/pages/employee/ApplyLeave"));
const LeaveHistory = lazy(() => import("@/pages/employee/LeaveHistory"));
const EmployeeProfile = lazy(() => import("@/pages/employee/Profile"));

// Manager views
const ManagerDashboard = lazy(() => import("@/pages/manager/Dashboard"));
const Team = lazy(() => import("@/pages/manager/Team"));
const Approvals = lazy(() => import("@/pages/manager/Approvals"));
const Calendar = lazy(() => import("@/pages/manager/Calendar"));

// Admin views
const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const Employees = lazy(() => import("@/pages/admin/Employees"));
const Departments = lazy(() => import("@/pages/admin/Departments"));
const LeaveTypes = lazy(() => import("@/pages/admin/LeaveTypes"));
const Holidays = lazy(() => import("@/pages/admin/Holidays"));
const Reports = lazy(() => import("@/pages/admin/Reports"));
const Settings = lazy(() => import("@/pages/admin/Settings"));

// 404 handler
const NotFound = lazy(() => import("@/pages/NotFound"));

/**
 * Global fallback page loader spinner.
 */
function LoadingSpinner() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background text-primary select-none font-sans">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-xs font-semibold text-muted-foreground animate-pulse">Loading leave portal...</p>
      </div>
    </div>
  );
}

/**
 * DashboardLayoutWrapper context resolver.
 * Feeds current authenticated user and navigation config objects dynamically into layouts.
 */
function DashboardLayoutWrapper() {
  const { user, logout } = useAuth();
  const role = user?.role || ROLES.EMPLOYEE;

  return (
    <DashboardLayout
      user={user}
      notifications={DUMMY_NOTIFICATIONS}
      role={role}
      sidebarItems={SIDEBAR_ITEMS[role] || []}
      onLogout={logout}
    />
  );
}

/**
 * Main application routing configurations.
 */
export default function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public Routes inside PublicLayout wrapper */}
        <Route element={<PublicLayout />}>
          <Route path={ROUTES.ROOT} element={<Navigate to={ROUTES.LOGIN} replace />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
        </Route>

        {/* Global Permission Unauthorized Route */}
        <Route path={ROUTES.UNAUTHORIZED} element={<Unauthorized />} />

        {/* Protected Admin/Manager/Employee Dashboard Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayoutWrapper />}>
            
            {/* Employee Views */}
            <Route element={<RoleProtectedRoute allowedRoles={[ROLES.EMPLOYEE]} />}>
              <Route path={ROUTES.EMPLOYEE.DASHBOARD} element={<EmployeeDashboard />} />
              <Route path={ROUTES.EMPLOYEE.APPLY} element={<ApplyLeave />} />
              <Route path={ROUTES.EMPLOYEE.HISTORY} element={<LeaveHistory />} />
              <Route path={ROUTES.EMPLOYEE.PROFILE} element={<EmployeeProfile />} />
            </Route>

            {/* Manager Views */}
            <Route element={<RoleProtectedRoute allowedRoles={[ROLES.MANAGER]} />}>
              <Route path={ROUTES.MANAGER.DASHBOARD} element={<ManagerDashboard />} />
              <Route path={ROUTES.MANAGER.TEAM} element={<Team />} />
              <Route path={ROUTES.MANAGER.APPROVALS} element={<Approvals />} />
              <Route path={ROUTES.MANAGER.CALENDAR} element={<Calendar />} />
            </Route>

            {/* HR Admin Views */}
            <Route element={<RoleProtectedRoute allowedRoles={[ROLES.HR_ADMIN]} />}>
              <Route path={ROUTES.ADMIN.DASHBOARD} element={<AdminDashboard />} />
              <Route path={ROUTES.ADMIN.EMPLOYEES} element={<Employees />} />
              <Route path={ROUTES.ADMIN.DEPARTMENTS} element={<Departments />} />
              <Route path={ROUTES.ADMIN.LEAVE_TYPES} element={<LeaveTypes />} />
              <Route path={ROUTES.ADMIN.HOLIDAYS} element={<Holidays />} />
              <Route path={ROUTES.ADMIN.REPORTS} element={<Reports />} />
              <Route path={ROUTES.ADMIN.SETTINGS} element={<Settings />} />
            </Route>

          </Route>
        </Route>

        {/* Wildcard 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}