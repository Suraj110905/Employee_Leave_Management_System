import { Button } from "@/components/ui/button";
import { Eye, Ban, CalendarOff, ChevronLeft, ChevronRight } from "lucide-react";
import { formatDateRange, formatLeaveType } from "@/utils/historyUtils";
import { LEAVE_STATUS } from "@/constants/dashboard";

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
 * Presentational requests history log grid table.
 * Supports page navigators and cancel triggers on Pending leaves.
 *
 * @component
 */
export default function HistoryTable({
  leaves = [],
  onViewDetails = () => {},
  onCancelLeave = () => {},
  pagination = { page: 1, limit: 10, total: 0, totalPages: 1 },
  onPageChange = () => {},
}) {
  const { page, totalPages, total } = pagination;

  return (
    <div className="space-y-4 text-left font-sans select-none">
      {leaves.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 border border-border border-dashed rounded-2xl bg-card text-muted-foreground text-center">
          <CalendarOff className="w-12 h-12 text-muted-foreground/35 mb-3" />
          <h4 className="text-sm font-bold text-foreground">No Leave Records Found</h4>
          <p className="text-[11px] text-muted-foreground max-w-sm mt-0.5">
            Try adjusting your status or category filters, or search keywords.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto border border-border rounded-xl shadow-xs">
            <table className="w-full text-left text-xs text-muted-foreground" aria-label="Employee leave requests history table">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  <th className="px-6 py-3">ID</th>
                  <th className="px-4 py-3">Leave Type</th>
                  <th className="px-4 py-3">Date Range</th>
                  <th className="px-4 py-3">Working Days</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Manager</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {leaves.map((leave) => {
                  const showCancel = leave.status === LEAVE_STATUS.PENDING;

                  return (
                    <tr key={leave.id} className="hover:bg-accent/20 transition-colors">
                      <td className="px-6 py-3.5 font-bold text-foreground">{leave.id}</td>
                      <td className="px-4 py-3.5 font-semibold text-foreground">
                        {formatLeaveType(leave.leaveType)}
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground">
                        {formatDateRange(leave.startDate, leave.endDate)}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-foreground">
                        {leave.workingDays}d
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={leave.status} />
                      </td>
                      <td className="px-4 py-3.5 text-muted-foreground">
                        {leave.reviewer || "System Queue"}
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onViewDetails(leave)}
                            className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          
                          {showCancel && (
                            <button
                              onClick={() => onCancelLeave(leave.id)}
                              className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Cancel Request"
                            >
                              <Ban className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Simple Pagination controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border border-border p-4 bg-card rounded-xl shadow-xs select-none">
              <span className="text-xs text-muted-foreground">
                Showing page {page} of {totalPages} &bull; {total} total records
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
        </>
      )}
    </div>
  );
}
export { HistoryTable };

