import {
  LayoutDashboard,
  CalendarPlus,
  History,
  Wallet,
  User,
  ClipboardList,
  Calendar,
  Users,
  Settings2,
  Palmtree,
  BarChart3,
  Settings,
} from "lucide-react";
import { ROLES } from "@/constants/roles";

export const employeeNavigation = [
  {
    label: "Dashboard",
    route: "/employee/dashboard",
    icon: LayoutDashboard,
    role: ROLES.EMPLOYEE,
  },
  {
    label: "Apply Leave",
    route: "/employee/apply-leave",
    icon: CalendarPlus,
    role: ROLES.EMPLOYEE,
  },
  {
    label: "Leave History",
    route: "/employee/history",
    icon: History,
    role: ROLES.EMPLOYEE,
  },
  {
    label: "Leave Balance",
    route: "/employee/balance",
    icon: Wallet,
    role: ROLES.EMPLOYEE,
  },
  {
    label: "Profile",
    route: "/employee/profile",
    icon: User,
    role: ROLES.EMPLOYEE,
  },
];

export const managerNavigation = [
  {
    label: "Dashboard",
    route: "/manager/dashboard",
    icon: LayoutDashboard,
    role: ROLES.MANAGER,
  },
  {
    label: "Pending Requests",
    route: "/manager/requests",
    icon: ClipboardList,
    role: ROLES.MANAGER,
  },
  {
    label: "Team Calendar",
    route: "/manager/calendar",
    icon: Calendar,
    role: ROLES.MANAGER,
  },
  {
    label: "Team Members",
    route: "/manager/members",
    icon: Users,
    role: ROLES.MANAGER,
  },
];

export const adminNavigation = [
  {
    label: "Dashboard",
    route: "/admin/dashboard",
    icon: LayoutDashboard,
    role: ROLES.HR_ADMIN,
  },
  {
    label: "Employees",
    route: "/admin/employees",
    icon: Users,
    role: ROLES.HR_ADMIN,
  },
  {
    label: "Leave Types",
    route: "/admin/leave-types",
    icon: Settings2,
    role: ROLES.HR_ADMIN,
  },
  {
    label: "Holidays",
    route: "/admin/holidays",
    icon: Palmtree,
    role: ROLES.HR_ADMIN,
  },
  {
    label: "Reports",
    route: "/admin/reports",
    icon: BarChart3,
    role: ROLES.HR_ADMIN,
  },
  {
    label: "Settings",
    route: "/admin/settings",
    icon: Settings,
    role: ROLES.HR_ADMIN,
  },
];

// Combined navigation list helper for dynamic rendering based on active role
export const navigationConfig = {
  [ROLES.EMPLOYEE]: employeeNavigation,
  [ROLES.MANAGER]: managerNavigation,
  [ROLES.HR_ADMIN]: adminNavigation,
};
export default navigationConfig;
