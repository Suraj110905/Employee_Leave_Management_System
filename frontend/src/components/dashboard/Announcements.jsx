import { Card } from "@/components/ui/card";
import { AlertCircle, Calendar } from "lucide-react";
import SectionHeader from "./SectionHeader";

/**
 * Team announcements bulletin widget.
 *
 * @component
 */
export default function Announcements({ announcements = [], className = "" }) {
  return (
    <Card className={`p-6 border border-border bg-card text-card-foreground shadow-xs text-left ${className}`}>
      <SectionHeader title="Announcements" subtitle="Company news & updates" />

      {announcements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground select-none">
          <Calendar className="w-8 h-8 text-muted-foreground/30 mb-2" />
          <p className="text-xs font-semibold">No Announcements</p>
          <p className="text-[10px] text-muted-foreground/80 mt-0.5">You are all caught up with company updates.</p>
        </div>
      ) : (
        <div className="space-y-3.5 mt-4">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className={`p-3.5 rounded-xl border transition-all duration-200 ${
                ann.urgent
                  ? "bg-rose-50/40 border-rose-100 dark:bg-rose-950/10 dark:border-rose-900/30"
                  : "bg-accent/20 border-border hover:bg-accent/40"
              }`}
            >
              <div className="flex items-start gap-2 justify-between">
                <h4 className="text-xs font-bold text-foreground leading-snug truncate pr-2">
                  {ann.title}
                </h4>
                {ann.urgent && (
                  <span className="flex items-center gap-1 text-[9px] font-extrabold text-rose-600 bg-rose-50 border border-rose-200 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-900/40 px-1.5 py-0.5 rounded-md shrink-0 uppercase tracking-wider">
                    <AlertCircle className="w-2.5 h-2.5" />
                    Urgent
                  </span>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground font-medium mt-1 leading-normal line-clamp-2">
                {ann.message}
              </p>
              <span className="text-[9px] text-muted-foreground/80 font-bold uppercase tracking-wider block mt-2">
                {ann.date}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
