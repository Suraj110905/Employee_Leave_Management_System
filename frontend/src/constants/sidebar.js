import {
  LayoutDashboard,
  CalendarPlus,
  History,
  Wallet,
  User,
  ClipboardList,
  Calendar,
  Users,
  Building2,
  Settings2,
  Palmtree,
  BarChart3,
  Settings,
} from "lucide-react";
import { ROLES } from "./roles";
import { ROUTES } from "./routes";

/**
 * Role-based Sidebar Navigation Configurations.
 * Defines display labels, routes, icons, and permissions maps.
 */
export const SIDEBAR_ITEMS = {
  [ROLES.EMPLOYEE]: [
    {
      label: "Dashboard",
      route: ROUTES.EMPLOYEE.DASHBOARD,
      icon: LayoutDashboard,
      role: ROLES.EMPLOYEE,
    },
    {
      label: "Apply Leave",
      route: ROUTES.EMPLOYEE.APPLY,
      icon: CalendarPlus,
      role: ROLES.EMPLOYEE,
    },
    {
      label: "Leave History",
      route: ROUTES.EMPLOYEE.HISTORY,
      icon: History,
      role: ROLES.EMPLOYEE,
    },
    {
      label: "Leave Balance",
      route: ROUTES.EMPLOYEE.BALANCE,
      icon: Wallet,
      role: ROLES.EMPLOYEE,
    },
    {
      label: "Profile",
      route: ROUTES.EMPLOYEE.PROFILE,
      icon: User,
      role: ROLES.EMPLOYEE,
    },
  ],
  
  [ROLES.MANAGER]: [
    {
      label: "Dashboard",
      route: ROUTES.MANAGER.DASHBOARD,
      icon: LayoutDashboard,
      role: ROLES.MANAGER,
    },
    {
      label: "Pending Requests",
      route: ROUTES.MANAGER.REQUESTS,
      icon: ClipboardList,
      role: ROLES.MANAGER,
    },
    {
      label: "Team Calendar",
      route: ROUTES.MANAGER.CALENDAR,
      icon: Calendar,
      role: ROLES.MANAGER,
    },
    {
      label: "Team Members",
      route: ROUTES.MANAGER.MEMBERS,
      icon: Users,
      role: ROLES.MANAGER,
    },
    {
      label: "Profile",
      route: ROUTES.MANAGER.PROFILE,
      icon: User,
      role: ROLES.MANAGER,
    },
  ],
  
  [ROLES.HR_ADMIN]: [
    {
      label: "Dashboard",
      route: ROUTES.ADMIN.DASHBOARD,
      icon: LayoutDashboard,
      role: ROLES.HR_ADMIN,
    },
    {
      label: "Employees",
      route: ROUTES.ADMIN.EMPLOYEES,
      icon: Users,
      role: ROLES.HR_ADMIN,
    },
    {
      label: "Departments",
      route: ROUTES.ADMIN.DEPARTMENTS,
      icon: Building2,
      role: ROLES.HR_ADMIN,
    },
    {
      label: "Leave Types",
      route: ROUTES.ADMIN.LEAVE_TYPES,
      icon: Settings2,
      role: ROLES.HR_ADMIN,
    },
    {
      label: "Holidays",
      route: ROUTES.ADMIN.HOLIDAYS,
      icon: Palmtree,
      role: ROLES.HR_ADMIN,
    },
    {
      label: "Reports",
      route: ROUTES.ADMIN.REPORTS,
      icon: BarChart3,
      role: ROLES.HR_ADMIN,
    },
    {
      label: "Settings",
      route: ROUTES.ADMIN.SETTINGS,
      icon: Settings,
      role: ROLES.HR_ADMIN,
    },
  ],
};

export default SIDEBAR_ITEMS;
