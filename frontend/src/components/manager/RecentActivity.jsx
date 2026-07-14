import { Card } from "@/components/ui/card";
import { UserCheck, CheckCircle2, XCircle, Info } from "lucide-react";
import SectionHeader from "@/components/dashboard/SectionHeader";

/**
 * Presentational widget listing recent manager decision logs.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Array<Object>} props.activities - Action logs list.
 */
export default function RecentActivity({ activities = [] }) {
  const getIcon = (type) => {
    switch (type) {
      case "Approved":
        return CheckCircle2;
      case "Rejected":
        return XCircle;
      default:
        return Info;
    }
  };

  const getColorClass = (type) => {
    switch (type) {
      case "Approved":
        return "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30";
      case "Rejected":
        return "text-rose-500 bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/30";
      default:
        return "text-blue-500 bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/30";
    }
  };

  return (
    <Card className="p-6 border border-border bg-card text-card-foreground shadow-xs text-left h-full flex flex-col justify-between">
      <div>
        <SectionHeader title="Recent Activity" subtitle="Your historical reviews trail" />

        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground select-none">
            <Info className="w-10 h-10 text-muted-foreground/35 mb-2.5" />
            <p className="text-xs font-semibold text-foreground leading-none">No activity logs</p>
            <p className="text-[10px] text-muted-foreground mt-1">
              Your recent action history log is empty.
            </p>
          </div>
        ) : (
          <div className="space-y-4 select-none mt-4">
            {activities.map((act, idx) => {
              const Icon = getIcon(act.status);
              const colorClass = getColorClass(act.status);

              return (
                <div key={idx} className="flex gap-3 items-start">
                  <span className={`p-1.5 rounded-lg border shrink-0 mt-0.5 ${colorClass}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground leading-relaxed">
                      You {act.status.toLowerCase()} <span className="font-bold">{act.employeeName}'s</span> {act.leaveType} leave request.
                    </p>
                    {act.remarks && (
                      <p className="text-[10px] text-muted-foreground italic mt-0.5 truncate">
                        "{act.remarks}"
                      </p>
                    )}
                    <span className="text-[9px] text-muted-foreground/80 font-bold block mt-1 uppercase tracking-wider">
                      {act.reviewedAt ? new Date(act.reviewedAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" }) : "Today"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}
export { RecentActivity };
