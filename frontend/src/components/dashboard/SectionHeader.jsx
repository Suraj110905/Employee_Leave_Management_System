import { Button } from "@/components/ui/button";

/**
 * Reusable Widget Section Header.
 *
 * @component
 */
export default function SectionHeader({
  title = "",
  subtitle = "",
  action = null, // Can be a custom node or object { label, onClick, disabled }
  compact = false,
}) {
  return (
    <div className={`flex items-start justify-between gap-4 select-none text-left ${compact ? "" : "mb-4"}`}>
      <div className="min-w-0">
        <h3 className="text-sm font-bold text-foreground tracking-tight leading-none">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs text-muted-foreground font-medium mt-1.5 leading-none truncate">
            {subtitle}
          </p>
        )}
      </div>

      {action && (
        <div className="shrink-0">
          {typeof action.onClick === "function" ? (
            <Button
              variant="ghost"
              size="sm"
              disabled={action.disabled}
              onClick={action.onClick}
              className="text-xs font-semibold text-primary hover:text-primary-foreground hover:bg-primary/90 rounded-lg cursor-pointer"
            >
              {action.label}
            </Button>
          ) : (
            action
          )}
        </div>
      )}
    </div>
  );
}
