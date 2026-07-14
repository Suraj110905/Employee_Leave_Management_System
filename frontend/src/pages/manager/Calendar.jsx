import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { managerService } from "@/services/mock/managerService";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCw } from "lucide-react";
import TeamCalendarWidget from "@/components/manager/TeamCalendarWidget";

/**
 * Orchestrator Shell Page for Team Calendar schedule logs.
 *
 * @component
 */
export default function Calendar() {
  const { user } = useAuth();
  const managerId = user?.id || "MGR-20015";

  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [filters, setFilters] = useState({
    employeeId: "",
    leaveType: "",
  });

  const fetchCalendarData = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const rosterData = await managerService.getTeamRoster(managerId);
      setRoster(rosterData);
    } catch (err) {
      setErrorMsg(err.message || "Failed to load calendar roster information.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarData();
  }, [user]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <div className="space-y-6 font-sans select-none text-left">
        <Skeleton className="h-10 w-48 mb-2" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 bg-card border border-border rounded-2xl">
        <AlertCircle className="w-10 h-10 text-destructive mb-4" />
        <h3 className="text-base font-bold text-foreground mb-1">Connection Error</h3>
        <p className="text-xs text-muted-foreground max-w-sm mb-6">{errorMsg}</p>
        <button
          onClick={fetchCalendarData}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-xl text-xs shadow-md hover:bg-primary/90 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans text-left select-none">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Team Schedule</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Monitor overlap absences and staff calendar leaves parameters
        </p>
      </div>

      <TeamCalendarWidget
        roster={roster}
        filters={filters}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
}
