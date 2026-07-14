import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, X, AlertCircle } from "lucide-react";
import { formatDateRange, getStatusColor, formatLeaveType, formatStatus } from "@/utils/historyUtils";
import LeaveTimeline from "./LeaveTimeline";

/**
 * Presentational LeaveDetailDrawer.
 * Slides in from the side to display comprehensive request details and the audit timeline.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.leave - Selected leave object details.
 * @param {boolean} props.isOpen - Controls sheet overlays visibility.
 * @param {Function} props.onClose - Triggers exit transitions.
 */
export default function LeaveDetailDrawer({ leave = null, isOpen = false, onClose = () => {} }) {
  if (!leave) return null;

  const badgeColor = getStatusColor(leave.status);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md bg-card text-card-foreground p-6 overflow-y-auto border-l border-border flex flex-col justify-between"
      >
        <div className="space-y-6 text-left">
          {/* Header row */}
          <SheetHeader className="flex flex-row items-center justify-between border-b border-border pb-4 select-none">
            <div>
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                Leave Details
              </span>
              <SheetTitle className="text-base font-extrabold text-foreground mt-0.5">
                Request {leave.id}
              </SheetTitle>
            </div>
            <SheetClose asChild>
              <button
                className="p-1 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                aria-label="Close details panel"
              >
                <X className="w-4 h-4" />
              </button>
            </SheetClose>
          </SheetHeader>

          {/* Core leave details */}
          <div className="space-y-4 font-sans text-xs">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground font-semibold">Category Type</span>
              <span className="font-bold text-foreground">
                {formatLeaveType(leave.leaveType)}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground font-semibold">Timeline range</span>
              <span className="font-semibold text-foreground">
                {formatDateRange(leave.startDate, leave.endDate)}
              </span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground font-semibold">Working Weekdays</span>
              <span className="font-bold text-foreground">{leave.workingDays} days</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground font-semibold">Calendar Duration</span>
              <span className="font-bold text-foreground">{leave.totalDays} days</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground font-semibold">Current Status</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase border tracking-wider leading-none ${badgeColor}`}>
                {formatStatus(leave.status)}
              </span>
            </div>

            {/* Reason block */}
            <div className="py-2">
              <span className="text-muted-foreground font-semibold block mb-1">Reason / Description</span>
              <p className="p-3 bg-accent/25 border border-border rounded-xl text-foreground font-semibold leading-relaxed">
                {leave.reason || "No comment provided."}
              </p>
            </div>

            {/* Reviewer notes */}
            {leave.remarks && (
              <div className="py-2">
                <span className="text-muted-foreground font-semibold block mb-1">Manager Remarks</span>
                <p className="p-3 bg-accent/25 border border-border rounded-xl text-foreground font-semibold leading-relaxed">
                  {leave.remarks}
                </p>
              </div>
            )}

            {/* Attachment placeholder */}
            <div className="py-2">
              <span className="text-muted-foreground font-semibold block mb-2">Attachments</span>
              {leave.attachment ? (
                <div className="flex items-center justify-between p-3 bg-accent/20 border border-border rounded-xl select-none">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-4 h-4 text-primary shrink-0" />
                    <span className="font-semibold text-foreground truncate max-w-[200px]">
                      {leave.attachment}
                    </span>
                  </div>
                  <Button
                    variant="link"
                    size="sm"
                    className="text-[10px] font-bold text-primary p-0 h-auto cursor-pointer"
                  >
                    Download
                  </Button>
                </div>
              ) : (
                <p className="text-[10px] text-muted-foreground font-semibold italic">
                  No attachment provided for this request.
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-4">
              Audit Timeline
            </h4>
            <LeaveTimeline leave={leave} />
          </div>
        </div>

        <div className="border-t border-border pt-4 mt-6">
          <SheetClose asChild>
            <Button variant="outline" className="w-full rounded-xl cursor-pointer font-semibold text-xs h-10">
              Close Details
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
export { LeaveDetailDrawer };
