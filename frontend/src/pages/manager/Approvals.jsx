import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { managerService } from "@/services/mock/managerService";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCw } from "lucide-react";
import FiltersPanel from "@/components/leave-history/FiltersPanel";
import ApprovalsTable from "@/components/manager/ApprovalsTable";
import RejectRemarksDialog from "@/components/manager/RejectRemarksDialog";
import LeaveDetailDrawer from "@/components/leave-history/LeaveDetailDrawer";

/**
 * Orchestrator Shell Page for Manager Approvals Logs.
 * Manages paginated queries, approvals, rejections, and search parameters.
 *
 * @component
 */
export default function Approvals() {
  const { user } = useAuth();
  const managerId = user?.id || "MGR-20015";

  const [approvalsData, setApprovalsData] = useState({
    data: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    status: "",
    leaveType: "",
    search: "",
  });

  // Local state for debounced search queries
  const [searchQuery, setSearchQuery] = useState("");

  // Rejection comments state
  const [rejectId, setRejectId] = useState(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  // Detail drawer state
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchApprovals = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const options = {
        page,
        limit: 5, // Paginate with 5 items per page
        sortBy: "appliedAt",
        sortOrder: "desc",
        filters,
      };

      const result = await managerService.getApprovals(managerId, options);
      setApprovalsData(result);
    } catch (err) {
      setErrorMsg(err.message || "Failed to load leave approvals.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, [page, filters, user]);

  // Debounce search query changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        search: searchQuery,
      }));
      setPage(1);
    }, 450);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handleFilterChange = (field, value) => {
    if (field === "search") {
      setSearchQuery(value);
    } else {
      setFilters((prev) => ({
        ...prev,
        [field]: value,
      }));
      setPage(1);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setFilters({
      status: "",
      leaveType: "",
      search: "",
    });
    setPage(1);
  };

  const handleApprove = async (id) => {
    try {
      await managerService.approveRequest(id, managerId, "Approved.");
      fetchApprovals();
    } catch (err) {
      alert(`Approval error: ${err.message}`);
    }
  };

  const handleOpenRejectDialog = (id) => {
    setRejectId(id);
    setRejectOpen(true);
  };

  const handleCloseRejectDialog = () => {
    setRejectId(null);
    setRejectOpen(false);
  };

  const handleRejectSubmit = async (remarks) => {
    setSubmittingReview(true);
    try {
      await managerService.rejectRequest(rejectId, managerId, remarks);
      handleCloseRejectDialog();
      fetchApprovals();
    } catch (err) {
      alert(`Rejection error: ${err.message}`);
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleOpenDrawer = (req) => {
    // Map properties from approvals schema (employeeId, reason) to history schema for compatibility
    const compatibleLeave = {
      ...req,
      employeeName: req.employeeName,
      reviewedAt: req.reviewedAt,
      remarks: req.remarks,
      reviewer: req.reviewer,
    };
    setSelectedRequest(compatibleLeave);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setSelectedRequest(null);
    setDrawerOpen(false);
  };

  return (
    <div className="space-y-6 font-sans text-left select-none">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Review Leave Requests</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Review, approve, or reject leave requests from your department
        </p>
      </div>

      <FiltersPanel
        filters={{ ...filters, search: searchQuery }}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        searchLabel="Employee Name"
        searchPlaceholder="Filter by name..."
      />

      {errorMsg && (
        <div className="min-h-[40vh] flex flex-col items-center justify-center text-center p-6 bg-card border border-border rounded-2xl">
          <AlertCircle className="w-10 h-10 text-destructive mb-4" />
          <h3 className="text-base font-bold text-foreground mb-1">Connection Error</h3>
          <p className="text-xs text-muted-foreground max-w-sm mb-6">{errorMsg}</p>
          <button
            onClick={fetchApprovals}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-xl text-xs shadow-md hover:bg-primary/90 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry Query
          </button>
        </div>
      )}

      {loading && !errorMsg && (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      )}

      {!loading && !errorMsg && (
        <ApprovalsTable
          requests={approvalsData.data}
          onApprove={handleApprove}
          onReject={handleOpenRejectDialog}
          onView={handleOpenDrawer}
          pagination={{
            page: approvalsData.page,
            limit: approvalsData.limit,
            total: approvalsData.total,
            totalPages: approvalsData.totalPages,
          }}
          onPageChange={handlePageChange => setPage(handlePageChange)}
        />
      )}

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
