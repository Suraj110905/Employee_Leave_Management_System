import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeader from "./SectionHeader";

/**
 * Responsive Mini Calendar Preview widget.
 * Renders July 2026 calendar highlighting holidays and submitted leaves.
 *
 * @component
 */
export default function CalendarPreview({ holidays = [], leaves = [], className = "" }) {
  const monthName = "July 2026";
  const totalDays = 31;
  const startDayOffset = 3; // July 1, 2026 starts on a Wednesday
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Helper to generate ISO strings matching July 2026 days
  const getDateString = (day) => {
    return `2026-07-${day.toString().padStart(2, "0")}`;
  };

  const getDayStatus = (day) => {
    const dateStr = getDateString(day);
    
    // Check public holidays
    const isHoliday = holidays.find((h) => h.date === dateStr);
    if (isHoliday) {
      return { type: "holiday", label: isHoliday.name };
    }

    // Check active leave request ranges
    const activeLeave = leaves.find((l) => {
      return dateStr >= l.start && dateStr <= l.end;
    });

    if (activeLeave) {
      return {
        type: "leave",
        status: activeLeave.status,
        label: `${activeLeave.type} Leave (${activeLeave.status})`,
      };
    }

    return null;
  };

  const renderCells = () => {
    const cells = [];
    
    // Render blank cells for start offsets
    for (let i = 0; i < startDayOffset; i++) {
      cells.push(<div key={`empty-${i}`} className="h-7 w-full"></div>);
    }

    // Render calendar days
    for (let day = 1; day <= totalDays; day++) {
      const status = getDayStatus(day);
      let dayClasses = "text-foreground hover:bg-accent/50 rounded-lg";
      let indicatorClass = "";

      if (status) {
        if (status.type === "holiday") {
          dayClasses = "text-rose-600 dark:text-rose-400 font-extrabold bg-rose-500/10 hover:bg-rose-500/20 rounded-lg border border-rose-200/50 dark:border-rose-900/40";
          indicatorClass = "bg-rose-500";
        } else if (status.type === "leave") {
          if (status.status === "Approved") {
            dayClasses = "text-emerald-700 dark:text-emerald-400 font-extrabold bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg border border-emerald-200/50 dark:border-emerald-900/40";
            indicatorClass = "bg-emerald-500";
          } else if (status.status === "Rejected") {
            dayClasses = "text-rose-700 dark:text-rose-400 font-extrabold bg-rose-500/10 hover:bg-rose-500/20 rounded-lg border border-rose-200/50 dark:border-rose-900/40";
            indicatorClass = "bg-rose-500";
          } else {
            dayClasses = "text-amber-700 dark:text-amber-400 font-extrabold bg-amber-500/10 hover:bg-amber-500/20 rounded-lg border border-amber-200/50 dark:border-amber-900/40";
            indicatorClass = "bg-amber-500";
          }
        }
      }

      cells.push(
        <div
          key={`day-${day}`}
          title={status ? status.label : undefined}
          className={`h-7 w-full flex flex-col items-center justify-center text-[10px] font-semibold transition-all relative cursor-pointer ${dayClasses}`}
        >
          <span>{day}</span>
          {indicatorClass && (
            <span className={`absolute bottom-1 w-1 h-1 rounded-full ${indicatorClass}`}></span>
          )}
        </div>
      );
    }

    return cells;
  };

  return (
    <Card className={`p-6 border border-border bg-card text-card-foreground shadow-xs text-left ${className}`}>
      <div className="flex items-center justify-between gap-4 mb-4 select-none">
        <div>
          <h3 className="text-sm font-bold text-foreground tracking-tight leading-none">
            Team Calendar
          </h3>
          <p className="text-[10px] text-muted-foreground font-medium mt-1 leading-none">
            {monthName}
          </p>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button className="p-1 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer transition-colors" aria-label="Previous month">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground cursor-pointer transition-colors" aria-label="Next month">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Week Headers */}
      <div className="grid grid-cols-7 gap-1 text-center font-bold text-[9px] text-muted-foreground uppercase mb-2 select-none">
        {daysOfWeek.map((day) => (
          <div key={day} className="py-1">{day}</div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 text-center font-semibold select-none">
        {renderCells()}
      </div>

      {/* Calendar Legend */}
      <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 mt-5 pt-4 border-t border-border text-[9px] font-bold text-muted-foreground uppercase tracking-wider select-none">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-emerald-500/20 border border-emerald-400/40 block"></span>
          <span>Approved</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-amber-500/20 border border-amber-400/40 block"></span>
          <span>Pending</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-rose-500/20 border border-rose-400/40 block"></span>
          <span>Holiday</span>
        </div>
      </div>
    </Card>
  );
}
