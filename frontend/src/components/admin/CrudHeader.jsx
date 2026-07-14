import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

/**
 * Presentational CrudHeader.
 * Unifies dashboard title headers and actions buttons across admin CRUD pages.
 * Matches design board page header style: h2 title + subtitle + green CTA button.
 *
 * @component
 */
export default function CrudHeader({
  title,
  subtitle,
  actionLabel = "",
  onActionClick = () => {},
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none text-left">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-tight">{title}</h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>

      {actionLabel && (
        <Button
          onClick={onActionClick}
          className="font-semibold rounded-xl text-sm cursor-pointer flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
