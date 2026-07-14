import { Card } from "@/components/ui/card";

/**
 * Reusable Metric Statistic Card.
 * Matches ELMS design board style: icon with colored bg on right, large value, description text.
 *
 * @component
 */
export default function StatCard({
  title = "",
  value = "",
  icon: Icon = null,
  description = "",
  className = "",
  colorClass = "bg-primary/10 text-primary border-primary/20",
}) {
  return (
    <Card
      className={`relative p-5 flex items-center justify-between border border-border bg-card text-card-foreground shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden card-hover ${className}`}
    >
      {/* Left: Text content */}
      <div className="space-y-1.5 min-w-0 text-left flex-1">
        <p className="text-xs font-semibold text-muted-foreground truncate leading-none">
          {title}
        </p>
        <p className="text-3xl font-bold text-foreground leading-none tracking-tight mt-2">
          {value}
        </p>
        {description && (
          <p className="text-[11px] text-muted-foreground font-medium truncate mt-1">
            {description}
          </p>
        )}
      </div>

      {/* Right: Icon with colored bg circle */}
      {Icon && (
        <div
          className={`p-3 rounded-2xl border shrink-0 ml-4 ${colorClass}`}
        >
          <Icon className="w-5 h-5" />
        </div>
      )}
    </Card>
  );
}
