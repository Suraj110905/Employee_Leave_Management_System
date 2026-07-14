import { Users, Clock, CheckCircle, UserMinus, CalendarDays } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";

/**
 * Manager KPI Stats grid — 5 cards matching the design board.
 * Team Members | Pending Requests | Approved This Month | On Leave Today | Leaves This Month
 *
 * @component
 */
export default function ManagerStats({ stats = null }) {
  const {
    teamMembersCount = 24,
    pendingCount = 8,
    approvedThisMonth = 18,
    onLeaveTodayCount = 6,
    leavesThisMonth = 32,
  } = stats || {};

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      <StatCard
        title="Team Members"
        value={teamMembersCount}
        icon={Users}
        description="Active members"
        colorClass="bg-blue-50 text-blue-600 border-blue-200"
      />
      <StatCard
        title="Pending Requests"
        value={pendingCount}
        icon={Clock}
        description="Requires your action"
        colorClass="bg-amber-50 text-amber-600 border-amber-200"
      />
      <StatCard
        title="Approved This Month"
        value={approvedThisMonth}
        icon={CheckCircle}
        description="+12% from last month"
        colorClass="bg-primary/10 text-primary border-primary/20"
      />
      <StatCard
        title="On Leave Today"
        value={onLeaveTodayCount}
        icon={UserMinus}
        description="Team members"
        colorClass="bg-rose-50 text-rose-500 border-rose-200"
      />
      <StatCard
        title="Leaves This Month"
        value={leavesThisMonth}
        icon={CalendarDays}
        description="All leave types"
        colorClass="bg-purple-50 text-purple-600 border-purple-200"
      />
    </div>
  );
}
