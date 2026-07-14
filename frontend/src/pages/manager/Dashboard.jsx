import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { managerService } from "@/services/mock/managerService";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCw, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import ManagerStats from "@/components/manager/ManagerStats";
import PendingRequestsCard from "@/components/manager/PendingRequestsCard";
import RecentActivity from "@/components/manager/RecentActivity";
import DepartmentSummary from "@/components/manager/DepartmentSummary";
import RejectRemarksDialog from "@/components/manager/RejectRemarksDialog";
import LeaveDetailDrawer from "@/components/leave-history/LeaveDetailDrawer";

/**
 * Orchestrator Shell Page for Manager Dashboard.
 * Matches ELMS design board: greeting + Export Report CTA, 5 stat cards,
 * pending requests table, activity feed, and team calendar.
 *
 * @component
 */
export default function ManagerDashboard() {
  const { user } = useAuth();
  const managerId = user?.id || "MGR-20015";
  const firstName = (user?.name || "Manager").split(" ")[0];

  const [stats, setStats] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [roster, setRoster] = useState([]);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [rejectId, setRejectId] = useState(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const [statsData, approvalsData, historyData, rosterData] = await Promise.all([
        managerService.getDashboardStats(managerId),
        managerService.getApprovals(managerId, { limit: 5, filters: { status: "Pending" } }),
        managerService.getApprovals(managerId, { limit: 4 }),
        managerService.getTeamRoster(managerId),
      ]);
      setStats(statsData);
      setPendingRequests(approvalsData.data);
      setRecentActivities(historyData.data.filter((l) => l.status !== "Pending"));
      setRoster(rosterData);
    } catch (err) {
      setErrorMsg(err.message || "Failed to load manager dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, [user]);

  const handleApprove = async (id) => {
    try {
      await managerService.approveRequest(id, managerId, "Approved.");
      fetchDashboardData();
    } catch (err) { alert(`Approval error: ${err.message}`); }
  };

  const handleOpenRejectDialog = (id) => { setRejectId(id); setRejectOpen(true); };
  const handleCloseRejectDialog = () => { setRejectId(null); setRejectOpen(false); };

  const handleRejectSubmit = async (remarks) => {
    setSubmittingReview(true);
    try {
      await managerService.rejectRequest(rejectId, managerId, remarks);
      handleCloseRejectDialog();
      fetchDashboardData();
    } catch (err) { alert(`Rejection error: ${err.message}`); }
    finally { setSubmittingReview(false); }
  };

  const handleOpenDrawer = (req) => { setSelectedRequest(req); setDrawerOpen(true); };
  const handleCloseDrawer = () => { setSelectedRequest(null); setDrawerOpen(false); };

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 w-full rounded-2xl lg:col-span-2" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
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
    <div className="space-y-6 font-sans">
      {/* Welcome heading + Export Report CTA — matches design board */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
            {getGreeting()}, {firstName}! 👋
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Here&apos;s an overview of your team leave activities.
          </p>
        </div>
        <Button size="sm" variant="outline" className="shrink-0 gap-2 rounded-xl font-semibold cursor-pointer">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* 5 KPI Stat Cards */}
      <ManagerStats stats={stats} />

      {/* Dashboard two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
        {/* Left: Pending approvals + activity */}
        <div className="lg:col-span-2 space-y-6">
          <PendingRequestsCard
            requests={pendingRequests}
            onApprove={handleApprove}
            onReject={handleOpenRejectDialog}
            onView={handleOpenDrawer}
          />
          <RecentActivity activities={recentActivities} />
        </div>

        {/* Right: Team roster summary */}
        <div className="space-y-6">
          <DepartmentSummary roster={roster} />
        </div>
      </div>

      <RejectRemarksDialog
        isOpen={rejectOpen}
        onClose={handleCloseRejectDialog}
        onSubmit={handleRejectSubmit}
        loading={submittingReview}
      />
      <LeaveDetailDrawer
        leave={selectedRequest}
        isOpen={drawerOpen}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}
