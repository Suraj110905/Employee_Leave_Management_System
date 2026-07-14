import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";

/**
 * Presentational TeamCalendarWidget.
 * Renders department monthly grid calendar with overlaps highlighting team absences.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Array<Object>} props.roster - Team members data.
 * @param {Object} props.filters - Active filters.
 * @param {Function} props.onFilterChange - Callback to adjust queries.
 */
export default function TeamCalendarWidget({
  roster = [],
  filters = {},
  onFilterChange = () => {},
}) {
  const monthName = "July 2026";
  const totalDays = 31;
  const startDayOffset = 3;
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Helper to compile ISO dates
  const getDateString = (day) => {
    return `2026-07-${day.toString().padStart(2, "0")}`;
  };

  // Find all team members on leave on a given day
  const getAbsencesForDay = (day) => {
    const dateStr = getDateString(day);
    const absences = [];

    roster.forEach((member) => {
      // Check if this employee matches active calendar filters
      if (filters.employeeId && member.id !== filters.employeeId) return;

      const activeLeaves = member.id === "EMP-10024"
        ? [{ start: "2026-07-15", end: "2026-07-20", status: "Pending", type: "Annual" }]
        : member.id === "EMP-10025"
        ? [{ start: "2026-07-12", end: "2026-07-13", status: "Approved", type: "Sick" }]
        : member.id === "EMP-10027"
        ? [{ start: "2026-07-25", end: "2026-07-27", status: "Pending", type: "Annual" }]
        : [];

      activeLeaves.forEach((leave) => {
        if (filters.leaveType && leave.type.toLowerCase() !== filters.leaveType.toLowerCase()) return;

        if (dateStr >= leave.start && dateStr <= leave.end) {
          absences.push({
            name: member.name,
            avatar: member.avatar,
            type: leave.type,
            status: leave.status,
          });
        }
      });
    });

    return absences;
  };

  const renderCells = () => {
    const cells = [];
    for (let i = 0; i < startDayOffset; i++) {
      cells.push(<div key={`empty-${i}`} className="min-h-[60px] border border-border bg-accent/5"></div>);
    }

    for (let day = 1; day <= totalDays; day++) {
      const absences = getAbsencesForDay(day);
      const isWeekend = (day + startDayOffset - 1) % 7 === 0 || (day + startDayOffset - 1) % 7 === 6;

      cells.push(
        <div
          key={`day-${day}`}
          className={`min-h-[65px] border border-border p-1.5 flex flex-col justify-between select-none ${
            isWeekend ? "bg-accent/15" : "bg-card text-card-foreground"
          }`}
        >
          <span className="text-[10px] font-bold text-muted-foreground">{day}</span>
          
          <div className="space-y-1 mt-1">
            {absences.map((abs, idx) => (
              <div
                key={idx}
                title={`${abs.name} - ${abs.type} Leave (${abs.status})`}
                className={`text-[8px] font-bold px-1 py-0.5 rounded-md flex items-center justify-between gap-1 leading-none ${
                  abs.status === "Approved"
                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-400/20"
                    : "bg-amber-500/10 text-amber-600 border border-amber-400/20"
                }`}
              >
                <span className="truncate">{abs.avatar}</span>
                <span>{abs.type[0]}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return cells;
  };

  return (
    <Card className="p-6 border border-border bg-card text-card-foreground shadow-xs text-left">
      {/* Filters Toolbar */}
      <div className="flex flex-wrap items-center gap-4 justify-between border-b border-border pb-4 mb-5">
        <div className="flex items-center gap-2 min-w-0">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          <h3 className="text-sm font-bold text-foreground truncate">Team Absences Calendar</h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Employee Filter */}
          <select
            value={filters.employeeId || ""}
            onChange={(e) => onFilterChange("employeeId", e.target.value)}
            className="h-8 px-2 rounded-lg border border-border bg-card text-[10px] font-semibold text-foreground focus:outline-none cursor-pointer"
          >
            <option value="">All Team Members</option>
            {roster.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={filters.leaveType || ""}
            onChange={(e) => onFilterChange("leaveType", e.target.value)}
            className="h-8 px-2 rounded-lg border border-border bg-card text-[10px] font-semibold text-foreground focus:outline-none cursor-pointer"
          >
            <option value="">All Leave Types</option>
            <option value="Annual">Annual Leave</option>
            <option value="Sick">Sick Leave</option>
            <option value="Casual">Casual Leave</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 mb-4 select-none">
        <span className="text-xs font-bold text-foreground leading-none">{monthName}</span>
        <div className="flex items-center gap-1.5">
          <Button variant="outline" size="icon" className="h-7 w-7 rounded-lg border-border cursor-pointer">
            <ChevronLeft className="w-3.5 h-3.5" />
          </Button>
          <Button variant="outline" size="icon" className="h-7 w-7 rounded-lg border-border cursor-pointer">
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Week headers */}
      <div className="grid grid-cols-7 gap-px text-center font-bold text-[9px] text-muted-foreground uppercase mb-1">
        {daysOfWeek.map((day) => (
          <div key={day} className="py-1">{day}</div>
        ))}
      </div>

      {/* Grid cells */}
      <div className="grid grid-cols-7 gap-px border border-border rounded-xl overflow-hidden bg-border">
        {renderCells()}
      </div>
    </Card>
  );
}
export { TeamCalendarWidget };
