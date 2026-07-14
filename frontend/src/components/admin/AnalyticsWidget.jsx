import { Card } from "@/components/ui/card";
import SectionHeader from "@/components/dashboard/SectionHeader";

/**
 * Presentational AnalyticsWidget.
 * Renders SVG and CSS bar charts visual statistics of leave types distribution and monthly trend lines.
 *
 * @component
 */
export default function AnalyticsWidget() {
  const categories = [
    { type: "Annual", percentage: 48, color: "bg-primary" },
    { type: "Sick", percentage: 22, color: "bg-rose-500" },
    { type: "Casual", percentage: 18, color: "bg-amber-500" },
    { type: "Maternity", percentage: 12, color: "bg-indigo-500" },
  ];

  const trends = [
    { month: "Jan", count: 12, height: "h-16" },
    { month: "Feb", count: 8, height: "h-11" },
    { month: "Mar", count: 15, height: "h-20" },
    { month: "Apr", count: 22, height: "h-32" },
    { month: "May", count: 18, height: "h-24" },
    { month: "Jun", count: 28, height: "h-40" },
    { month: "Jul", count: 32, height: "h-44" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 select-none font-sans text-left">
      {/* Leave distribution percentages */}
      <Card className="p-5 border border-border bg-card text-card-foreground shadow-xs">
        <SectionHeader title="Leave Category Share" subtitle="Distribution across all leave types" />
        
        <div className="space-y-4 mt-6">
          {categories.map((c) => (
            <div key={c.type} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-foreground">
                <span>{c.type} Leave</span>
                <span>{c.percentage}%</span>
              </div>
              <div className="w-full bg-accent h-2 rounded-full overflow-hidden">
                <div
                  style={{ width: `${c.percentage}%` }}
                  className={`${c.color} h-full rounded-full transition-all duration-300`}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Monthly trends chart */}
      <Card className="p-5 border border-border bg-card text-card-foreground shadow-xs flex flex-col justify-between">
        <div>
          <SectionHeader title="Monthly Leave Trends" subtitle="Leave requests processed per month" />
        </div>

        <div className="flex items-end justify-between gap-2 h-48 mt-6 border-b border-border pb-2 px-2">
          {trends.map((t, index) => (
            <div key={index} className="flex flex-col items-center flex-1 gap-1">
              <div className="relative group w-full flex justify-center">
                <div className={`w-8 bg-primary/20 hover:bg-primary rounded-t-lg transition-all duration-200 ${t.height}`}></div>
                {/* Tooltip on hover */}
                <span className="absolute -top-7 scale-0 group-hover:scale-100 transition-all bg-foreground text-background text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-sm">
                  {t.count}
                </span>
              </div>
              <span className="text-[10px] font-bold text-muted-foreground mt-1">{t.month}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
export { AnalyticsWidget };
