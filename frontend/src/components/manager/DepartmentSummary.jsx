import { Card } from "@/components/ui/card";
import { Users, FileClock, ShieldCheck } from "lucide-react";
import SectionHeader from "@/components/dashboard/SectionHeader";

/**
 * Presentational widget rendering department headcount totals and active attendance indices.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Array<Object>} props.roster - Team members roster data.
 */
export default function DepartmentSummary({ roster = [] }) {
  const departmentName = roster[0]?.department || "Department";
  const headcount = roster.length;
  
  // Calculate mock attendance values for the department summary panel
  const onLeaveCount = roster.filter((m) =>
    m.leavesHistory.some((l) => l.status === "Approved" && l.id === "LV-098")
  ).length || 1;

  const activeCount = Math.max(0, headcount - onLeaveCount);
  const availabilityPercentage = headcount > 0 ? Math.round((activeCount / headcount) * 100) : 100;

  return (
    <Card className="p-6 border border-border bg-card text-card-foreground shadow-xs text-left h-full flex flex-col justify-between">
      <div>
        <SectionHeader title={`${departmentName} Overview`} subtitle="Roster metrics and attendance tracking" />

        <div className="space-y-5 select-none mt-5">
          {/* Availability Progress Indicator */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
              <span>Roster Availability</span>
              <span className="text-foreground">{availabilityPercentage}%</span>
            </div>
            <div className="w-full bg-accent h-2 rounded-full overflow-hidden">
              <div
                style={{ width: `${availabilityPercentage}%` }}
                className="bg-teal-500 h-full rounded-full transition-all duration-300"
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* Total Staff */}
            <div className="p-3 bg-accent/25 border border-border rounded-xl flex flex-col items-center justify-center text-center">
              <Users className="w-4 h-4 text-primary mb-1 shrink-0" />
              <span className="text-lg font-extrabold text-foreground leading-none">{headcount}</span>
              <span className="text-[8px] text-muted-foreground uppercase font-bold tracking-wider mt-1.5">Staff</span>
            </div>

            {/* Available staff */}
            <div className="p-3 bg-accent/25 border border-border rounded-xl flex flex-col items-center justify-center text-center">
              <ShieldCheck className="w-4 h-4 text-emerald-500 mb-1 shrink-0" />
              <span className="text-lg font-extrabold text-foreground leading-none">{activeCount}</span>
              <span className="text-[8px] text-muted-foreground uppercase font-bold tracking-wider mt-1.5">Active</span>
            </div>

            {/* Absent staff */}
            <div className="p-3 bg-accent/25 border border-border rounded-xl flex flex-col items-center justify-center text-center">
              <FileClock className="w-4 h-4 text-rose-500 mb-1 shrink-0" />
              <span className="text-lg font-extrabold text-foreground leading-none">{onLeaveCount}</span>
              <span className="text-[8px] text-muted-foreground uppercase font-bold tracking-wider mt-1.5">On Leave</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
export { DepartmentSummary };
