import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { managerService } from "@/services/mock/managerService";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, RefreshCw, X, Calendar, User, ShieldCheck } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import TeamGrid from "@/components/manager/TeamGrid";

/**
 * Orchestrator Shell Page for Team Roster.
 *
 * @component
 */
export default function Team() {
  const { user } = useAuth();
  const managerId = user?.id || "MGR-20015";

  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // Team profile drawer state
  const [selectedMember, setSelectedMember] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const fetchRoster = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const data = await managerService.getTeamRoster(managerId);
      setRoster(data);
    } catch (err) {
      setErrorMsg(err.message || "Failed to load team roster.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoster();
  }, [user]);

  const handleOpenProfile = (member) => {
    setSelectedMember(member);
    setDrawerOpen(true);
  };

  const handleCloseProfile = () => {
    setSelectedMember(null);
    setDrawerOpen(false);
  };

  return (
    <div className="space-y-6 font-sans text-left select-none">
      <div>
        <h2 className="text-2xl font-bold text-foreground">My Team</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Review, analyze, and manage active staff profiles in your department
        </p>
      </div>

      {errorMsg && (
        <div className="min-h-[40vh] flex flex-col items-center justify-center text-center p-6 bg-card border border-border rounded-2xl">
          <AlertCircle className="w-10 h-10 text-destructive mb-4" />
          <h3 className="text-base font-bold text-foreground mb-1">Connection Error</h3>
          <p className="text-xs text-muted-foreground max-w-sm mb-6">{errorMsg}</p>
          <button
            onClick={fetchRoster}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-xl text-xs shadow-md hover:bg-primary/90 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry Query
          </button>
        </div>
      )}

      {loading && !errorMsg && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton className="h-44 w-full rounded-2xl" />
          <Skeleton className="h-44 w-full rounded-2xl" />
          <Skeleton className="h-44 w-full rounded-2xl" />
          <Skeleton className="h-44 w-full rounded-2xl" />
        </div>
      )}

      {!loading && !errorMsg && (
        <TeamGrid roster={roster} onSelectMember={handleOpenProfile} />
      )}

      {/* Team Member Profile Sheet Drawer */}
      <Sheet open={drawerOpen} onOpenChange={(open) => !open && handleCloseProfile()}>
        {selectedMember && (
          <SheetContent
            side="right"
            className="w-full sm:max-w-md bg-card text-card-foreground p-6 overflow-y-auto border-l border-border flex flex-col justify-between"
          >
            <div className="space-y-6 text-left font-sans">
              <SheetHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
                <div>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                    Employee Profile
                  </span>
                  <SheetTitle className="text-base font-extrabold text-foreground mt-0.5">
                    {selectedMember.name}
                  </SheetTitle>
                </div>
                <SheetClose asChild>
                  <button
                    className="p-1 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                    aria-label="Close profile drawer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </SheetClose>
              </SheetHeader>

              {/* Profile Details List */}
              <div className="space-y-4 text-xs font-semibold text-foreground">
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Employee ID</span>
                  <span>{selectedMember.id}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Department</span>
                  <span>{selectedMember.department}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Designation</span>
                  <span>{selectedMember.designation}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Direct Manager</span>
                  <span>{selectedMember.manager}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-muted-foreground">Email Contact</span>
                  <span className="text-primary truncate max-w-[200px]">{selectedMember.email}</span>
                </div>
              </div>

              {/* Leave Balances Widget */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Leave Allowances Balances
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  {selectedMember.balances.map((bal) => (
                    <div key={bal.type} className="p-3 bg-accent/25 border border-border rounded-xl text-center">
                      <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider block">
                        {bal.type}
                      </span>
                      <span className="text-base font-extrabold text-foreground mt-1.5 block leading-none">
                        {bal.available}d
                      </span>
                      <span className="text-[8px] text-muted-foreground block mt-1.5 font-bold uppercase">
                        Used: {bal.used}d
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Holidays lists */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Upcoming Holidays
                </h4>
                {selectedMember.upcomingHolidays.length === 0 ? (
                  <p className="text-[10px] text-muted-foreground font-semibold italic">No upcoming holidays scheduled.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedMember.upcomingHolidays.map((h, index) => (
                      <div key={index} className="p-3 bg-accent/20 border border-border rounded-xl flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground">{h.name}</span>
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{h.date}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-border pt-4 mt-6">
              <SheetClose asChild>
                <Button variant="outline" className="w-full rounded-xl cursor-pointer font-semibold text-xs h-10">
                  Close Profile
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        )}
      </Sheet>
    </div>
  );
}
