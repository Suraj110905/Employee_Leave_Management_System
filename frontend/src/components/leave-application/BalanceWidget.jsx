import { Card } from "@/components/ui/card";
import { Info, HelpCircle } from "lucide-react";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

/**
 * Presentational BalanceWidget.
 * Displays the current available days and totals for a selected leave type.
 *
 * @component
 */
export default function BalanceWidget({ balances = [], selectedType = "Annual" }) {
  const activeBalance = balances.find(
    (b) => b.type.toLowerCase() === selectedType.toLowerCase()
  ) || { total: 0, used: 0, available: 0 };

  return (
    <Card className="p-5 border border-border bg-card text-card-foreground shadow-xs text-left">
      <div className="flex items-center justify-between mb-3 select-none">
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
          Leave Balance Context
        </h4>
        <TooltipProvider delay={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-muted-foreground hover:text-foreground cursor-pointer focus:outline-none" aria-label="Balance information">
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="bg-popover border border-border text-xs text-popover-foreground px-3 py-1.5 rounded-lg shadow-md max-w-xs">
              This represents your remaining allowance for {selectedType} leaves. Submission requires sufficient available balance.
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex items-baseline gap-2 mt-2 select-none">
        <span className="text-3xl font-extrabold text-foreground tracking-tight">
          {activeBalance.available}
        </span>
        <span className="text-xs text-muted-foreground font-semibold">days available</span>
      </div>

      <div className="flex justify-between items-center mt-4 pt-3.5 border-t border-border text-[10px] font-bold text-muted-foreground uppercase tracking-wider select-none">
        <span>Total: {activeBalance.total}d</span>
        <span>Used: {activeBalance.used}d</span>
      </div>
    </Card>
  );
}
