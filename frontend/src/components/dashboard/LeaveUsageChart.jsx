import { Card } from "@/components/ui/card";
import SectionHeader from "./SectionHeader";

/** Color palette matching the design board donut segments */
const SEGMENT_COLORS = [
  { bg: "#22c55e", light: "bg-green-500",  label: "Annual Leave" },
  { bg: "#3b82f6", light: "bg-blue-500",   label: "Sick Leave" },
  { bg: "#f59e0b", light: "bg-amber-500",  label: "Casual Leave" },
  { bg: "#a855f7", light: "bg-purple-500", label: "Others" },
];

/**
 * SVG Donut chart with center total, legend, and optional year filter.
 * Pure SVG — no external chart library needed.
 */
function DonutChart({ segments = [], total = 0 }) {
  const R = 60;
  const cx = 80;
  const cy = 80;
  const circ = 2 * Math.PI * R;

  let offset = 0;
  const arcs = segments.map((seg, i) => {
    const pct = total > 0 ? seg.days / total : 0;
    const arc = { offset, length: pct * circ, color: SEGMENT_COLORS[i]?.bg ?? "#6b7280" };
    offset += pct * circ;
    return arc;
  });

  return (
    <div className="relative flex items-center justify-center">
      <svg width="160" height="160" viewBox="0 0 160 160" aria-label="Leave summary donut chart">
        {/* Background track */}
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="var(--border)" strokeWidth="18" />
        {arcs.map((arc, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={R}
            fill="none"
            stroke={arc.color}
            strokeWidth="18"
            strokeDasharray={`${arc.length} ${circ - arc.length}`}
            strokeDashoffset={-arc.offset + circ * 0.25}
            strokeLinecap="round"
            style={{ transition: "stroke-dasharray 0.6s ease" }}
          />
        ))}
      </svg>
      {/* Center total text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
        <p className="text-2xl font-bold text-foreground leading-none">{total}</p>
        <p className="text-[10px] font-semibold text-muted-foreground mt-0.5">Total Days</p>
      </div>
    </div>
  );
}

/**
 * Leave Usage Chart component — matches employee dashboard design board.
 * Shows donut chart summary on the left, upcoming leaves list on the right.
 *
 * @component
 */
export default function LeaveUsageChart({ usageData = [], className = "" }) {
  // Build donut segments from usageData or fallback mock
  const segments = usageData.length
    ? usageData.slice(0, 4).map((d, i) => ({ label: d.month || `Type ${i + 1}`, days: d.days }))
    : [
        { label: "Annual Leave", days: 18 },
        { label: "Sick Leave",   days: 6 },
        { label: "Casual Leave", days: 5 },
        { label: "Others",       days: 3 },
      ];
  const total = segments.reduce((s, d) => s + d.days, 0);

  return (
    <Card className={`p-6 border border-border bg-card text-card-foreground shadow-xs ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <SectionHeader title="Leave Summary" subtitle="This Year" compact />
        {/* Year filter chip */}
        <select className="text-xs font-semibold border border-border rounded-lg px-2.5 py-1.5 bg-card text-foreground focus:outline-none cursor-pointer hover:border-primary/50 transition-colors">
          <option>This Year</option>
          <option>Last Year</option>
        </select>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Donut */}
        <div className="shrink-0">
          <DonutChart segments={segments} total={total} />
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2.5 w-full">
          {segments.map((seg, i) => {
            const color = SEGMENT_COLORS[i];
            const pct = total > 0 ? Math.round((seg.days / total) * 100) : 0;
            return (
              <div key={i} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: color?.bg ?? "#6b7280" }}
                  />
                  <span className="text-xs font-medium text-muted-foreground truncate">
                    {color?.label ?? seg.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold text-foreground">{seg.days} days</span>
                  <span className="text-[10px] text-muted-foreground">({pct}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

export { DonutChart };
