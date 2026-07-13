/**
 * Centralized Route Constants.
 * Defines all route paths in the application to ensure consistency.
 */
export const ROUTES = {
  ROOT: "/",
  LOGIN: "/login",
  FORGOT_PASSWORD: "/forgot-password",
  UNAUTHORIZED: "/unauthorized",
  
  EMPLOYEE: {
    DASHBOARD: "/employee/dashboard",
    APPLY: "/employee/apply-leave",
    HISTORY: "/employee/history",
    PROFILE: "/employee/profile",
  },
  
  MANAGER: {
    DASHBOARD: "/manager/dashboard",
    TEAM: "/manager/team",
    APPROVALS: "/manager/approvals",
    CALENDAR: "/manager/calendar",
  },
  
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    EMPLOYEES: "/admin/employees",
    DEPARTMENTS: "/admin/departments",
    LEAVE_TYPES: "/admin/leave-types",
    HOLIDAYS: "/admin/holidays",
    REPORTS: "/admin/reports",
    SETTINGS: "/admin/settings",
  },
};

export default ROUTES;
