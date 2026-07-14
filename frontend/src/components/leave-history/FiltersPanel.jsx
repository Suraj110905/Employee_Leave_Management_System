import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, RotateCcw } from "lucide-react";
import { LEAVE_STATUS } from "@/constants/dashboard";

/**
 * Presentational FiltersPanel.
 * Renders search criteria input triggers, status toggles, type selectors, and date pickers.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Object} props.filters - Active query parameters.
 * @param {Function} props.onFilterChange - Callback triggered when filter parameters change.
 * @param {Function} props.onClearFilters - Callback to reset all inputs.
 */
export default function FiltersPanel({
  filters = {},
  onFilterChange = () => {},
  onClearFilters = () => {},
  searchLabel = "Search Reason",
  searchPlaceholder = "Filter keyword...",
}) {
  const hasActiveFilters =
    filters.status ||
    filters.leaveType ||
    filters.startDate ||
    filters.endDate ||
    filters.search;

  return (
    <Card className="p-5 border border-border bg-card text-card-foreground shadow-xs text-left">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        
        {/* Search by reason */}
        <div className="relative">
          <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
            {searchLabel}
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-3.5 w-3.5 h-3.5 text-muted-foreground/60 pointer-events-none" />
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={filters.search || ""}
              onChange={(e) => onFilterChange("search", e.target.value)}
              className="pl-9 h-10 rounded-xl bg-card border-border focus-visible:ring-ring/40 hover:border-primary/50 transition-colors text-xs font-medium"
              aria-label="Search leave requests by reason keyword"
            />
          </div>
        </div>

        {/* Filter by Status */}
        <div>
          <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
            Status
          </label>
          <select
            value={filters.status || ""}
            onChange={(e) => onFilterChange("status", e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-border bg-card text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 cursor-pointer hover:border-primary/50 transition-colors"
            aria-label="Filter requests by authorization status"
          >
            <option value="">All Statuses</option>
            {Object.values(LEAVE_STATUS).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Filter by Leave Type */}
        <div>
          <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
            Leave Type
          </label>
          <select
            value={filters.leaveType || ""}
            onChange={(e) => onFilterChange("leaveType", e.target.value)}
            className="w-full h-10 px-3 rounded-xl border border-border bg-card text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring/40 cursor-pointer hover:border-primary/50 transition-colors"
            aria-label="Filter requests by leave type category"
          >
            <option value="">All Types</option>
            <option value="Annual">Annual Leave</option>
            <option value="Sick">Sick Leave</option>
            <option value="Casual">Casual Leave</option>
            <option value="Maternity">Maternity Leave</option>
            <option value="Paternity">Paternity Leave</option>
          </select>
        </div>

        {/* Start Date filter */}
        <div>
          <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
            Start Date From
          </label>
          <Input
            type="date"
            value={filters.startDate || ""}
            onChange={(e) => onFilterChange("startDate", e.target.value)}
            className="h-10 rounded-xl bg-card border-border focus-visible:ring-ring/40 hover:border-primary/50 transition-colors text-xs font-medium cursor-pointer"
            aria-label="Filter leaves starting after this date"
          />
        </div>

        {/* End Date filter */}
        <div>
          <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
            End Date To
          </label>
          <Input
            type="date"
            value={filters.endDate || ""}
            onChange={(e) => onFilterChange("endDate", e.target.value)}
            className="h-10 rounded-xl bg-card border-border focus-visible:ring-ring/40 hover:border-primary/50 transition-colors text-xs font-medium cursor-pointer"
            aria-label="Filter leaves ending before this date"
          />
        </div>
      </div>

      {/* Clear Filters Button Row */}
      {hasActiveFilters && (
        <div className="flex justify-end mt-4 pt-3.5 border-t border-border animate-fadeIn">
          <Button
            onClick={onClearFilters}
            variant="ghost"
            size="sm"
            className="text-[10px] font-bold text-muted-foreground hover:text-foreground hover:bg-accent flex items-center gap-1.5 rounded-lg cursor-pointer"
            aria-label="Reset all query filters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Query
          </Button>
        </div>
      )}
    </Card>
  );
}
