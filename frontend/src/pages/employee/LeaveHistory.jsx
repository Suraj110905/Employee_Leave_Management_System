import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { historyService } from "@/services/mock/historyService";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  WifiOff,
  Clock,
  Search,
  RefreshCw,
  FileQuestion,
} from "lucide-react";
import FiltersPanel from "@/components/leave-history/FiltersPanel";
import HistoryTable from "@/components/leave-history/HistoryTable";
import LeaveDetailDrawer from "@/components/leave-history/LeaveDetailDrawer";

/**
 * Presentational Error display component handling different network and server boundary outcomes.
 *
 * @component
 */
function ErrorBoundaryView({ error = "", onRetry = () => {} }) {
  const getErrorDetails = () => {
    const errLower = error.toLowerCase();
    if (errLower.includes("offline") || errLower.includes("internet") || errLower.includes("network")) {
      return {
        title: "No Internet Connection",
        description: "Please check your network cables or Wi-Fi status and try again.",
        icon: WifiOff,
        color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
      };
    }
    if (errLower.includes("timeout") || errLower.includes("latency") || errLower.includes("delay")) {
      return {
        title: "Connection Timeout",
        description: "The database gateway took too long to respond. Server might be under heavy load.",
        icon: Clock,
        color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
      };
    }
    if (errLower.includes("404") || errLower.includes("not found")) {
      return {
        title: "Resource Not Found (404)",
        description: "The requested history logs collection was not found in the current workspace catalog.",
        icon: FileQuestion,
        color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
      };
    }
    return {
      title: "Generic Server Error",
      description: error || "An unexpected error occurred while communicating with the database.",
      icon: AlertTriangle,
      color: "text-destructive bg-destructive/10 border-destructive/20",
    };
  };

  const details = getErrorDetails();
  const Icon = details.icon;

  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center text-center p-6 select-none font-sans">
      <div className={`p-4 border rounded-full mb-4 ${details.color}`}>
        <Icon className="w-10 h-10" />
      </div>
      <h3 className="text-base font-bold text-foreground mb-1">{details.title}</h3>
      <p className="text-xs text-muted-foreground max-w-sm mb-6 leading-relaxed">
        {details.description}
      </p>
      <Button
        onClick={onRetry}
        size="sm"
        className="flex items-center gap-2 rounded-xl text-xs font-semibold cursor-pointer"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        Retry Query Request
      </Button>
    </div>
  );
}

/**
 * Stateful Page Orchestrator for Leave History.
 * Manages paginated queries, status filters, keyword searches, and detail drawer select states.
 *
 * @component
 */
export default function LeaveHistory() {
  const { user } = useAuth();
  
  const [historyData, setHistoryData] = useState({
    data: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Query configurations
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    status: "",
    leaveType: "",
    startDate: "",
    endDate: "",
    search: "",
  });

  // Local state for reason search input, to support search debouncing
  const [searchQuery, setSearchQuery] = useState("");

  // Sidebar detail drawer select state
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const employeeId = user?.id || "EMP-10024";
      const options = {
        page,
        limit: 5, // Requesting 5 logs per page to demonstrate pagination cleanly
        sortBy: "appliedAt",
        sortOrder: "desc",
        filters,
      };

      // Optional error simulation: if search query is "trigger-error-404", throw 404
      if (filters.search === "trigger-error-404") {
        throw new Error("404 Resource Not Found");
      }
      if (filters.search === "trigger-error-offline") {
        throw new Error("No internet connection available.");
      }
      if (filters.search === "trigger-error-timeout") {
        throw new Error("Connection Timeout");
      }

      const result = await historyService.getHistory(employeeId, options);
      setHistoryData(result);
    } catch (err) {
      setErrorMsg(err.message || "Failed to load leave history.");
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch query when page or filters modify
  useEffect(() => {
    fetchHistory();
  }, [page, filters, user]);

  // Debounce search query input keystrokes
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        search: searchQuery,
      }));
      setPage(1); // Reset to page 1 on new search
    }, 450);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleFilterChange = (field, value) => {
    if (field === "search") {
      setSearchQuery(value);
    } else {
      setFilters((prev) => ({
        ...prev,
        [field]: value,
      }));
      setPage(1); // Reset to page 1 on filter changes
    }
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setFilters({
      status: "",
      leaveType: "",
      startDate: "",
      endDate: "",
      search: "",
    });
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenDetails = (leave) => {
    setSelectedLeave(leave);
    setDrawerOpen(true);
  };

  const handleCloseDetails = () => {
    setDrawerOpen(false);
    setSelectedLeave(null);
  };

  const handleCancelLeave = async (leaveId) => {
    try {
      const updatedLeave = await historyService.cancelLeave(leaveId);
      
      // Update local history collection state immutably
      setHistoryData((prev) => {
        const updatedData = prev.data.map((l) =>
          l.id === leaveId ? updatedLeave : l
        );
        return {
          ...prev,
          data: updatedData,
        };
      });

      // Update active selection if open in drawer
      if (selectedLeave?.id === leaveId) {
        setSelectedLeave(updatedLeave);
      }
    } catch (err) {
      alert(`Cancel failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 font-sans text-left select-none">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Leave History</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Review and audit past submitted requests and validation timelines
        </p>
      </div>

      {/* Filter Options Controls */}
      <FiltersPanel
        filters={{ ...filters, search: searchQuery }}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Error outcomes block */}
      {errorMsg && (
        <ErrorBoundaryView error={errorMsg} onRetry={fetchHistory} />
      )}

      {/* Loading Outline Skeletons */}
      {loading && !errorMsg && (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      )}

      {/* Grid listing data items */}
      {!loading && !errorMsg && (
        <HistoryTable
          leaves={historyData.data}
          onViewDetails={handleOpenDetails}
          onCancelLeave={handleCancelLeave}
          pagination={{
            page: historyData.page,
            limit: historyData.limit,
            total: historyData.total,
            totalPages: historyData.totalPages,
          }}
          onPageChange={handlePageChange}
        />
      )}

      {/* Details Slide Sheet Drawer */}
      <LeaveDetailDrawer
        leave={selectedLeave}
        isOpen={drawerOpen}
        onClose={handleCloseDetails}
      />
    </div>
  );
}
