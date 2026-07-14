import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarPlus, History, Wallet, Users, FileBarChart, Settings } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { ROLES } from "@/constants/roles";
import SectionHeader from "./SectionHeader";

/**
 * Reusable Quick Actions panel.
 * Supports custom list of action configurations or maps defaults based on role.
 *
 * @component
 */
export default function QuickActions({ role = "employee", actions = null }) {
  const getDefaultActions = () => {
    const roleLower = role?.toLowerCase();

    if (roleLower === "admin" || roleLower === "hr_admin") {
      return [
        {
          label: "Manage Employees",
          path: ROUTES.ADMIN.EMPLOYEES,
          icon: Users,
          variant: "default",
          colorClass: "bg-teal-600 hover:bg-teal-700 text-white shadow-teal-900/10",
        },
        {
          label: "System Configuration",
          path: ROUTES.ADMIN.SETTINGS,
          icon: Settings,
          variant: "outline",
          colorClass: "border-border text-foreground hover:bg-accent",
        },
      ];
    }

    if (roleLower === "manager") {
      return [
        {
          label: "Review Leave Approvals",
          path: ROUTES.MANAGER.APPROVALS,
          icon: Users,
          variant: "default",
          colorClass: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-900/10",
        },
        {
          label: "Team Overlap Calendar",
          path: ROUTES.MANAGER.CALENDAR,
          icon: History,
          variant: "outline",
          colorClass: "border-border text-foreground hover:bg-accent",
        },
      ];
    }

    // Default: Employee Actions
    return [
      {
        label: "Apply for Leave",
        path: ROUTES.EMPLOYEE.APPLY,
        icon: CalendarPlus,
        variant: "default",
        colorClass: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-900/10",
      },
      {
        label: "View Leave History",
        path: ROUTES.EMPLOYEE.HISTORY,
        icon: History,
        variant: "outline",
        colorClass: "border-border text-foreground hover:bg-accent",
      },
    ];
  };

  const activeActions = actions || getDefaultActions();

  return (
    <Card className="p-6 border border-border bg-card text-card-foreground shadow-xs">
      <SectionHeader title="Quick Actions" subtitle="Frequently used tasks" />

      <div className="flex flex-col gap-2.5 mt-4">
        {activeActions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <Button
              key={idx}
              asChild
              variant={action.variant || "default"}
              className={`w-full justify-start gap-3 rounded-xl h-11 px-4 text-sm font-semibold transition-all duration-200 cursor-pointer shadow-xs ${action.colorClass}`}
            >
              <Link to={action.path}>
                {Icon && <Icon className="w-4 h-4 shrink-0" />}
                {action.label}
              </Link>
            </Button>
          );
        })}
      </div>
    </Card>
  );
}
