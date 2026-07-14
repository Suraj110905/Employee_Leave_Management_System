import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Eye, Ban, ArrowRight } from "lucide-react";
import { LEAVE_STATUS } from "@/constants/dashboard";
import SectionHeader from "./SectionHeader";

/** Status badge pill matching design board */
function StatusBadge({ status = "" }) {
  const map = {
    Approved:  "badge badge-approved",
    Pending:   "badge badge-pending",
    Rejected:  "badge badge-rejected",
    Cancelled: "badge badge-cancelled",
  };
  return <span className={map[status] ?? "badge badge-cancelled"}>{status}</span>;
}

/** Leave type color dot */
function TypeDot({ type = "" }) {
  const colors = {
    Annual:  "bg-green-500",
    Sick:    "bg-blue-500",
    Casual:  "bg-amber-500",
    Medical: "bg-purple-500",
  };
  const key = Object.keys(colors).find((k) => type.includes(k)) ?? "Annual";
  return <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${colors[key]}`} />;
}

/**
 * Tabbed requests panel matching the employee dashboard design board.
 * Shows My Recent Leave Requests table with status badges and action icons.
 *
 * @component
 */
export default function RequestsTabs({ leaves = [], onCancelLeave = null }) {
  const TABS = ["All", ...Object.values(LEAVE_STATUS)];
  const [activeTab, setActiveTab] = useState("All");

  const filteredLeaves =
    activeTab === "All" ? leaves : leaves.filter((l) => l.status === activeTab);

  const tabCount = (tab) =>
    tab === "All" ? leaves.length : leaves.filter((l) => l.status === tab).length;

  return (
    <Card className="border border-border bg-card shadow-xs text-left">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-border flex items-center justify-between">
        <SectionHeader title="My Recent Leave Requests" compact />
        <a
          href="#"
          className="text-xs font-semibold text-primary hover:underline underline-offset-2 flex items-center gap-1"
        >
          View all <ArrowRight className="w-3 h-3" />
        </a>
      </div>

      {/* Tab bar */}
      <div className="px-6 pt-3 flex gap-0.5">
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          const count = tabCount(tab);
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-[11px] font-semibold rounded-t-lg transition-all cursor-pointer border-b-2 ${
                isActive
                  ? "text-primary border-primary bg-primary/5"
                  : "text-muted-foreground border-transparent hover:text-foreground"
              }`}
            >
              {tab}
              <span
                className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                  isActive ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      {filteredLeaves.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-14 text-center px-6">
          <p className="text-sm font-semibold text-muted-foreground">No {activeTab} requests</p>
          <p className="text-xs text-muted-foreground/70 mt-1">You have no leave requests in this category.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                <th className="px-6 py-3">Leave Type</th>
                <th className="px-4 py-3">From</th>
                <th className="px-4 py-3">To</th>
                <th className="px-4 py-3">Days</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredLeaves.map((leave) => (
                <tr key={leave.id} className="hover:bg-accent/20 transition-colors">
                  <td className="px-6 py-3.5 font-semibold text-foreground">
                    <TypeDot type={leave.type} />
                    {leave.type}
                  </td>
                  <td className="px-4 py-3.5 text-muted-foreground">{leave.start}</td>
                  <td className="px-4 py-3.5 text-muted-foreground">{leave.end}</td>
                  <td className="px-4 py-3.5 font-bold text-foreground">{leave.days}</td>
                  <td className="px-4 py-3.5 text-muted-foreground max-w-[140px] truncate" title={leave.reason}>
                    {leave.reason || "—"}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={leave.status} />
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                        title="View details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      {leave.status === "Pending" && onCancelLeave && (
                        <button
                          onClick={() => onCancelLeave(leave.id)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                          title="Cancel"
                        >
                          <Ban className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
