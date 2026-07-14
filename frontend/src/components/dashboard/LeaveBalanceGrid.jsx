import { Card } from "@/components/ui/card";
import SectionHeader from "./SectionHeader";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "@/constants/routes";

const BAR_COLORS = {
  Annual: "bg-green-500",
  Sick:   "bg-blue-500",
  Casual: "bg-amber-500",
  Compensatory: "bg-purple-500",
  Default: "bg-primary",
};

const ICON_COLORS = {
  Annual: "text-green-600 bg-green-50 border-green-200",
  Sick:   "text-blue-600 bg-blue-50 border-blue-200",
  Casual: "text-amber-600 bg-amber-50 border-amber-200",
  Compensatory: "text-purple-600 bg-purple-50 border-purple-200",
  Default: "text-primary bg-primary/10 border-primary/20",
};

function getKey(type = "") {
  const t = type.replace(" Leave", "").trim();
  return Object.keys(BAR_COLORS).find((k) => t.toLowerCase().includes(k.toLowerCase())) ?? "Default";
}

/**
 * Leave Balance card with progress bars — matches design board right-column widget.
 *
 * @component
 */
export default function LeaveBalanceGrid({ balances = [] }) {
  return (
    <Card className="p-6 border border-border bg-card shadow-xs text-left">
      <div className="flex items-center justify-between mb-5">
        <SectionHeader title="Leave Balance" compact />
        <Link
          to={ROUTES.EMPLOYEE?.PROFILE ?? "#"}
          className="text-xs font-semibold text-primary hover:underline underline-offset-2 flex items-center gap-1"
        >
          View Details <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {balances.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">No balance data.</p>
      ) : (
        <div className="space-y-4">
          {balances.map((bal, idx) => {
            const key = getKey(bal.type);
            const barColor = BAR_COLORS[key];
            const usedPct = bal.total > 0 ? Math.min((bal.used / bal.total) * 100, 100) : 0;
            return (
              <div key={idx}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${barColor}`} />
                    <span className="text-xs font-semibold text-foreground">{bal.type} Leave</span>
                  </div>
                  <span className="text-xs font-bold text-foreground">
                    {bal.available} / {bal.total} Days
                  </span>
                </div>
                {/* Progress bar */}
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                    style={{ width: `${usedPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
