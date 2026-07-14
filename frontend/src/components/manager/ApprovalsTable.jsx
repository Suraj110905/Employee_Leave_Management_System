import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Eye, Check, X, CalendarOff, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDateRange, formatLeaveType } from "@/utils/historyUtils";

const TABS = ["All", "Pending", "Approved", "Rejected", "Cancelled"];

function StatusBadge({ status = "" }) {
  const map = {
    Approved:  "badge badge-approved",
    Pending:   "badge badge-pending",
    Rejected:  "badge badge-rejected",
    Cancelled: "badge badge-cancelled",
  };
  return <span className={map[status] ?? "badge badge-cancelled"}>{status}</span>;
}

/**
 * Manager Approvals table — with tab filters (All/Pending/Approved/Rejected/Cancelled).
 * Matches the design board leave review page layout.
 *
 * @component
 */
export default function ApprovalsTable({
  requests = [],
  onApprove = () => {},
  onReject = () => {},
  onView = () => {},
  pagination = { page: 1, limit: 10, total: 0, totalPages: 1 },
  onPageChange = () => {},
}) {
  const [activeTab, setActiveTab] = useState("All");
  const { page, totalPages, total } = pagination;

  const filtered =
    activeTab === "All" ? requests : requests.filter((r) => r.status === activeTab);

  const tabCount = (tab) =>
    tab === "All" ? requests.length : requests.filter((r) => r.status === tab).length;

  return (
    <div className="space-y-4 text-left font-sans select-none">
      <Card className="border border-border bg-card shadow-xs">
        {/* Tab bar header */}
        <div className="px-6 pt-4 flex gap-0.5 border-b border-border">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-[11px] font-semibold rounded-t-lg transition-all cursor-pointer border-b-2 ${
                  isActive
                    ? "text-primary border-primary bg-primary/5"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                }`}
              >
                {tab}
                <span
                  className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                    isActive ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {tabCount(tab)}
                </span>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <CalendarOff className="w-12 h-12 text-muted-foreground/30 mb-3" />
            <h4 className="text-sm font-bold text-foreground">No Records Found</h4>
            <p className="text-xs text-muted-foreground max-w-sm mt-1">
              No leave requests found for this filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs" aria-label="Leave approvals table">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  <th className="px-6 py-3">Employee</th>
                  <th className="px-4 py-3">Leave Type</th>
                  <th className="px-4 py-3">Date Range</th>
                  <th className="px-4 py-3">Days</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((req) => {
                  const isPending = req.status === "Pending";
                  return (
                    <tr key={req.id} className="hover:bg-accent/20 transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-8 w-8 shrink-0 border border-border">
                            <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold uppercase">
                              {req.avatar || req.employeeName?.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-bold text-foreground leading-none">{req.employeeName}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{req.role || "—"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-semibold text-foreground">
                        {formatLeaveType(req.leaveType)}
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground">
                        {formatDateRange(req.startDate, req.endDate)}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-foreground">{req.workingDays}d</td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={req.status} />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onView(req)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                            title="View details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {isPending && (
                            <>
                              <button
                                onClick={() => onApprove(req.id)}
                                className="p-1.5 rounded-lg text-muted-foreground hover:text-green-600 hover:bg-green-50 transition-colors cursor-pointer"
                                title="Approve"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onReject(req.id)}
                                className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Reject"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <span className="text-xs text-muted-foreground">
              Showing {filtered.length} of {total} results
            </span>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                variant="outline"
                size="sm"
                className="h-8 px-3 rounded-lg text-xs cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                Prev
              </Button>
              <span className="text-xs font-semibold text-foreground">
                {page} / {totalPages}
              </span>
              <Button
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                variant="outline"
                size="sm"
                className="h-8 px-3 rounded-lg text-xs cursor-pointer"
              >
                Next
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
export { ApprovalsTable };
