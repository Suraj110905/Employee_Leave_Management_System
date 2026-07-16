import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { adminService } from "@/services/mock/adminService";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCw, Plus, Users, Clock, CheckCircle, UserMinus, CalendarDays, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/dashboard/StatCard";
import GlobalSearchInput from "@/components/admin/GlobalSearchInput";
import AnalyticsWidget from "@/components/admin/AnalyticsWidget";
import AuditLogsTable from "@/components/admin/AuditLogsTable";

/**
 * HR/Admin Dashboard — matches the design board layout:
 * — Welcome + Add New Employee CTA
 * — 5 or 6 KPI stat cards
 * — Analytics chart
 * — Audit logs table
 *
 * @component
 */
export default function AdminDashboard() {
  const { user } = useAuth();
  const firstName = (user?.name || "Admin").split(" ")[0];

  const [stats, setStats] = useState(null);
  const [logsData, setLogsData] = useState({ data: [], total: 0, page: 1, limit: 5, totalPages: 1 });
  const [searchResults, setSearchResults] = useState({ employees: [], departments: [], holidays: [], leaveTypes: [] });

  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [logsPage, setLogsPage] = useState(1);

  const fetchDashboardData = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const [statsData, logsResult] = await Promise.all([
        adminService.getAdminStats(),
        adminService.getAuditLogs({ page: logsPage, limit: 5 }),
      ]);
      setStats(statsData);
      setLogsData(logsResult);
    } catch (err) {
      setErrorMsg(err.message || "Failed to load admin dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async (pageNum) => {
    setLogsLoading(true);
    try {
      const result = await adminService.getAuditLogs({ page: pageNum, limit: 5 });
      setLogsData(result);
    } catch (err) { console.error(err); }
    finally { setLogsLoading(false); }
  };

  useEffect(() => { fetchDashboardData(); }, [user]);

  const handlePageChange = (newPage) => { setLogsPage(newPage); fetchLogs(newPage); };

  const handleSearchChange = async (keyword) => {
    if (!keyword || keyword.trim().length < 2) {
      setSearchResults({ employees: [], departments: [], holidays: [], leaveTypes: [] });
      return;
    }
    try {
      const results = await adminService.globalSearch(keyword);
      setSearchResults(results);
    } catch (err) { console.error(err); }
  };

  const handleResultClick = (type, item) => {
    alert(`Quick View: [${type.toUpperCase()}] ${item.name || item.type}`);
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
  };

  if (loading) {
    return (
      <div className="space-y-6 font-sans select-none text-left">
        <Skeleton className="h-14 w-full rounded-2xl" />
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-24 w-full rounded-2xl" />)}
        </div>
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 select-none font-sans">
        <div className="p-3.5 bg-destructive/10 border border-destructive/20 rounded-full text-destructive mb-4">
          <AlertCircle className="w-10 h-10" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-1">Failed to Load Dashboard</h3>
        <p className="text-xs text-muted-foreground max-w-sm mb-6">{errorMsg}</p>
        <button
          onClick={fetchDashboardData}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-xl text-xs hover:bg-primary/90 cursor-pointer transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans select-none">
      {/* Welcome + Add New Employee CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
            {getGreeting()}, {firstName}! 👋
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Here&apos;s an overview of your organization&apos;s leave activities.
          </p>
        </div>
        <Button size="sm" className="shrink-0 gap-2 rounded-xl font-semibold cursor-pointer">
          <Plus className="w-4 h-4" />
          Add New Employee
        </Button>
      </div>

      {/* Global search bar */}
      <GlobalSearchInput
        results={searchResults}
        onSearchChange={handleSearchChange}
        onResultClick={handleResultClick}
      />

      {/* 5 KPI stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-left">
        <StatCard
          title="Total Employees"
          value={stats?.totalHeadcount ?? 0}
          icon={Users}
          description="Active roster"
          colorClass="bg-blue-50 text-blue-600 border-blue-200"
        />
        <StatCard
          title="Pending Requests"
          value={stats?.pendingReviewsCount ?? 0}
          icon={Clock}
          description="Awaiting review"
          colorClass="bg-amber-50 text-amber-600 border-amber-200"
        />
        <StatCard
          title="Approved This Month"
          value={stats?.approvedThisMonth ?? 0}
          icon={CheckCircle}
          description="Leave approvals"
          colorClass="bg-primary/10 text-primary border-primary/20"
        />
        <StatCard
          title="On Leave Today"
          value={stats?.onLeaveTodayCount ?? 0}
          icon={UserMinus}
          description="Currently out"
          colorClass="bg-rose-50 text-rose-500 border-rose-200"
        />
        <StatCard
          title="Leaves This Month"
          value={stats?.leavesThisMonth ?? stats?.holidaysCount ?? 0}
          icon={CalendarDays}
          description="All leave types"
          colorClass="bg-purple-50 text-purple-600 border-purple-200"
        />
      </div>

      {/* Analytics chart widget */}
      <AnalyticsWidget />

      {/* Audit logs trail */}
      <div className="space-y-3 text-left">
        <h3 className="text-sm font-bold text-foreground">Recent System Audit Logs</h3>
        {logsLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>
        ) : (
          <AuditLogsTable
            logs={logsData.data}
            pagination={{ page: logsData.page, totalPages: logsData.totalPages, total: logsData.total }}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}

export { AdminDashboard };
