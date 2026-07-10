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

export const employeeNavigation = [
  {
    name: "Dashboard",
    path: "/employee/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Apply Leave",
    path: "/employee/apply-leave",
    icon: CalendarPlus,
  },
  {
    name: "Leave History",
    path: "/employee/history",
    icon: History,
  },
  {
    name: "Leave Balance",
    path: "/employee/balance",
    icon: Wallet,
  },
  {
    name: "Profile",
    path: "/employee/profile",
    icon: User,
  },
];

export const managerNavigation = [
  {
    name: "Dashboard",
    path: "/manager/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Pending Requests",
    path: "/manager/requests",
    icon: ClipboardList,
  },
  {
    name: "Team Calendar",
    path: "/manager/calendar",
    icon: Calendar,
  },
  {
    name: "Profile",
    path: "/manager/profile",
    icon: User,
  },
];

export const adminNavigation = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Employees",
    path: "/admin/employees",
    icon: Users,
  },
  {
    name: "Departments",
    path: "/admin/departments",
    icon: Building2,
  },
  {
    name: "Leave Types",
    path: "/admin/leave-types",
    icon: Settings2,
  },
  {
    name: "Holidays",
    path: "/admin/holidays",
    icon: Palmtree,
  },
  {
    name: "Reports",
    path: "/admin/reports",
    icon: BarChart3,
  },
  {
    name: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
];
