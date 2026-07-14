import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { dashboardService } from "@/services/mock/dashboardService";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCw, Calendar, Clock, Navigation, CheckCircle } from "lucide-react";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import LeaveBalanceGrid from "@/components/dashboard/LeaveBalanceGrid";
import LeaveUsageChart from "@/components/dashboard/LeaveUsageChart";
import Announcements from "@/components/dashboard/Announcements";
import CalendarPreview from "@/components/dashboard/CalendarPreview";
import QuickActions from "@/components/dashboard/QuickActions";
import RequestsTabs from "@/components/dashboard/RequestsTabs";
import StatCard from "@/components/dashboard/StatCard";

/**
 * Orchestrator Shell Page for Employee Dashboard.
 * Matches the ELMS design board layout:
 * — Welcome heading + CTA
 * — 4 summary stat cards (Available, Pending, Upcoming, Approved)
 * — Two-column: usage chart + requests table | side widgets
 */
export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await dashboardService.getDashboardData(user?.id || "EMP-10024");
      setData(response);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const handleCancelLeave = async (leaveId) => {
    try {
      await dashboardService.cancelLeaveRequest(leaveId);
      setData((prev) => {
        if (!prev) return prev;
        const updatedLeaves = prev.leaves.filter((l) => l.id !== leaveId);
        const pendingCount = updatedLeaves.filter((l) => l.status === "Pending").length;
        return {
          ...prev,
          leaves: updatedLeaves,
          summary: { ...prev.summary, pendingCount },
        };
      });
    } catch {
      alert("Error: Failed to cancel request. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 font-sans select-none text-left">
        <Skeleton className="h-14 w-full rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full rounded-2xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-44 w-full rounded-2xl" />
            <Skeleton className="h-60 w-full rounded-2xl" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 select-none font-sans">
        <div className="p-3.5 bg-destructive/10 border border-destructive/20 rounded-full text-destructive mb-4">
          <AlertCircle className="w-10 h-10" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-1">Failed to Load Dashboard</h3>
        <p className="text-xs text-muted-foreground max-w-sm mb-6">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-xl text-xs shadow-sm hover:bg-primary/90 cursor-pointer transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Connection
        </button>
      </div>
    );
  }

  /* Derive summary metrics for the 4 stat cards */
  const summary = data?.summary || {};
  const availableLeaves = data?.balances?.reduce((sum, b) => sum + (b.available || 0), 0) ?? 18;
  const pendingCount = summary.pendingCount ?? 2;
  const upcomingCount = summary.upcomingCount ?? 5;
  const approvedCount = summary.approvedCount ?? 12;

  return (
    <div className="space-y-6 font-sans">
      {/* Welcome heading + Apply Leave CTA */}
      <WelcomeBanner user={user} />

      {/* 4 summary stat cards — matches design board top row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Available Leaves"
          value={availableLeaves}
          icon={Calendar}
          description="+2 from last month"
          colorClass="bg-primary/10 text-primary border-primary/20"
        />
        <StatCard
          title="Pending Requests"
          value={pendingCount}
          icon={Clock}
          description="Awaiting approval"
          colorClass="bg-amber-50 text-amber-600 border-amber-200"
        />
        <StatCard
          title="Upcoming Leaves"
          value={upcomingCount}
          icon={Navigation}
          description={data?.summary?.nextLeaveDate ? `Next: ${data.summary.nextLeaveDate}` : "Scheduled ahead"}
          colorClass="bg-blue-50 text-blue-600 border-blue-200"
        />
        <StatCard
          title="Approved Leaves"
          value={approvedCount}
          icon={CheckCircle}
          description="This year"
          colorClass="bg-emerald-50 text-emerald-600 border-emerald-200"
        />
      </div>

      {/* Main dashboard two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        {/* Left Column: Usage Chart & Requests Table */}
        <div className="lg:col-span-2 space-y-6">
          <LeaveUsageChart usageData={data?.usageData} />
          <RequestsTabs leaves={data?.leaves} onCancelLeave={handleCancelLeave} />
        </div>

        {/* Right Column: Side Widgets */}
        <div className="space-y-6">
          <QuickActions role={user?.role} />
          <LeaveBalanceGrid balances={data?.balances} />
          <CalendarPreview holidays={data?.holidays} leaves={data?.leaves} />
          <Announcements announcements={data?.announcements} />
        </div>
      </div>
    </div>
  );
}
