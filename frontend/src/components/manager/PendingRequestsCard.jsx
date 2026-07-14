import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Check, X, Eye, UserCheck, ArrowRight } from "lucide-react";
import SectionHeader from "@/components/dashboard/SectionHeader";

/**
 * Pending leave requests widget — table format matching the manager dashboard design board.
 * Shows employee avatar, name, leave type, date range, days, and action buttons.
 *
 * @component
 */
export default function PendingRequestsCard({
  requests = [],
  onApprove = () => {},
  onReject = () => {},
  onView = () => {},
}) {
  return (
    <Card className="border border-border bg-card shadow-xs text-left">
      <div className="px-6 pt-5 pb-4 border-b border-border flex items-center justify-between">
        <SectionHeader
          title="Pending Approvals"
          subtitle="Requests awaiting your decision"
          compact
        />
        <a
          href="#"
          className="text-xs font-semibold text-primary hover:underline underline-offset-2 flex items-center gap-1 shrink-0"
        >
          View all <ArrowRight className="w-3 h-3" />
        </a>
      </div>

      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 text-center px-6">
          <div className="p-4 rounded-full bg-primary/10 text-primary mb-3">
            <UserCheck className="w-8 h-8" />
          </div>
          <p className="text-sm font-bold text-foreground">All caught up!</p>
          <p className="text-xs text-muted-foreground mt-1">No pending leave requests in your queue.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                <th className="px-6 py-3">Employee</th>
                <th className="px-4 py-3">Leave Type</th>
                <th className="px-4 py-3">From</th>
                <th className="px-4 py-3">To</th>
                <th className="px-4 py-3">Days</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-accent/20 transition-colors">
                  {/* Employee with avatar */}
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-8 w-8 shrink-0 border border-border">
                        <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold uppercase">
                          {req.avatar || req.employeeName?.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-foreground leading-none">{req.employeeName}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{req.department || "—"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-foreground">
                    {req.leaveType}
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground">{req.startDate}</td>
                  <td className="px-4 py-3.5 text-muted-foreground">{req.endDate}</td>
                  <td className="px-4 py-3.5 font-bold text-foreground">{req.workingDays}d</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onView(req)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                        title="View details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
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
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

export { PendingRequestsCard };
