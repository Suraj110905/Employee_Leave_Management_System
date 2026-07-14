import { Clock, CheckCircle2, XCircle, AlertCircle, Ban } from "lucide-react";
import { formatStatus } from "@/utils/historyUtils";
import { LEAVE_STATUS } from "@/constants/dashboard";

/**
 * Reusable LeaveTimeline component.
 * Displays vertical milestone events for a leave request submission and approvals flow.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.leave - Target leave request object.
 */
export default function LeaveTimeline({ leave = null }) {
  if (!leave) return null;

  const { status, appliedAt, reviewedAt, reviewer, remarks } = leave;

  const formatDate = (isoStr) => {
    if (!isoStr) return "";
    return new Date(isoStr).toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const steps = [];

  // 1. Applied Step (Always active/completed)
  steps.push({
    title: "Request Submitted",
    description: "Application successfully submitted by employee.",
    time: formatDate(appliedAt),
    status: "completed",
    icon: CheckCircle2,
    colorClass: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-900/40",
  });

  // 2. Review Step
  if (status === LEAVE_STATUS.PENDING) {
    steps.push({
      title: "Review Phase",
      description: "Awaiting manager authorization and review.",
      time: "In progress",
      status: "active",
      icon: Clock,
      colorClass: "text-amber-500 bg-amber-50 dark:bg-amber-950/20 border-amber-200/50 dark:border-amber-900/40",
    });
  } else if (status === "Cancelled") {
    steps.push({
      title: "Review Terminated",
      description: "Request withdrawn by employee.",
      time: formatDate(leave.updatedAt),
      status: "cancelled",
      icon: Ban,
      colorClass: "text-slate-400 bg-slate-50 dark:bg-slate-950/20 border-slate-200/50 dark:border-slate-900/40",
    });
  } else {
    // Approved or Rejected
    steps.push({
      title: status === LEAVE_STATUS.APPROVED ? "Request Approved" : "Request Rejected",
      description: `Reviewed by ${reviewer || "System"}.${remarks ? ` Remarks: "${remarks}"` : ""}`,
      time: formatDate(reviewedAt),
      status: "completed",
      icon: status === LEAVE_STATUS.APPROVED ? CheckCircle2 : XCircle,
      colorClass: status === LEAVE_STATUS.APPROVED
        ? "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-900/40"
        : "text-rose-500 bg-rose-50 dark:bg-rose-950/20 border-rose-200/50 dark:border-rose-900/40",
    });
  }

  return (
    <div className="flow-root select-none text-left">
      <ul className="-mb-8">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isLast = idx === steps.length - 1;

          return (
            <li key={idx}>
              <div className="relative pb-8">
                {/* Connecting Line */}
                {!isLast && (
                  <span
                    className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-border"
                    aria-hidden="true"
                  />
                )}
                
                <div className="relative flex space-x-3.5 items-start">
                  <div>
                    <span className={`h-10 w-10 rounded-xl border flex items-center justify-center ring-4 ring-background shrink-0 ${step.colorClass}`}>
                      <Icon className="w-5 h-5" />
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <p className="text-xs font-bold text-foreground">{step.title}</p>
                    <p className="text-[10px] text-muted-foreground font-semibold leading-relaxed mt-1">
                      {step.description}
                    </p>
                    <span className="text-[9px] text-muted-foreground/80 font-bold uppercase tracking-wider block mt-1.5">
                      {step.time}
                    </span>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
export { LeaveTimeline };
