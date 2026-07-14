import { Card } from "@/components/ui/card";
import { Calendar, Info, ShieldCheck, AlertCircle } from "lucide-react";
import { leaveUtils } from "@/services/mock/leaveService";

/**
 * Presentational LeaveSummaryCard.
 * Displays a live preview summary of the leave request options selected by the user.
 *
 * @component
 */
export default function LeaveSummaryCard({
  leaveType = "Annual",
  startDate = "",
  endDate = "",
  reason = "",
  balances = [],
}) {
  const activeBalance = balances.find(
    (b) => b.type.toLowerCase() === leaveType.toLowerCase()
  ) || { available: 0 };

  const durationDays = leaveUtils.calculateLeaveDuration(startDate, endDate);
  const workingDays = leaveUtils.calculateWorkingDays(startDate, endDate);
  const remainingDays = Math.max(0, activeBalance.available - workingDays);

  const hasDates = startDate && endDate;
  const isOverdrawn = workingDays > activeBalance.available;

  return (
    <Card className="relative overflow-hidden p-6 bg-slate-900 text-slate-100 border border-slate-800 shadow-lg rounded-2xl flex flex-col justify-between text-left h-full select-none">
      {/* Background decoration */}
      <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none transform translate-x-6 translate-y-6">
        <Calendar className="w-48 h-48" />
      </div>

      <div className="space-y-4 relative z-10">
        <div>
          <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider block mb-1">
            Request Preview
          </span>
          <h3 className="text-lg font-bold text-slate-100 leading-snug">
            {leaveType} Leave Summary
          </h3>
        </div>

        {hasDates ? (
          <div className="space-y-3 pt-2 text-xs font-medium text-slate-300">
            {/* Timeline */}
            <div className="flex justify-between items-center py-2 border-b border-slate-800">
              <span className="text-slate-400 font-semibold uppercase text-[9px] tracking-wider">Date Timeline</span>
              <span className="text-slate-200">
                {startDate} to {endDate}
              </span>
            </div>

            {/* Total Duration */}
            <div className="flex justify-between items-center py-2 border-b border-slate-800">
              <span className="text-slate-400 font-semibold uppercase text-[9px] tracking-wider">Calendar Duration</span>
              <span className="text-slate-200 font-bold">{durationDays} calendar days</span>
            </div>

            {/* Working Days */}
            <div className="flex justify-between items-center py-2 border-b border-slate-800">
              <span className="text-slate-400 font-semibold uppercase text-[9px] tracking-wider">Working Days</span>
              <span className="text-slate-200 font-bold">{workingDays} weekdays</span>
            </div>

            {/* Project Balance projection */}
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-400 font-semibold uppercase text-[9px] tracking-wider">Estimated Balance</span>
              <div className="text-right">
                <span className="text-slate-400 line-through mr-1.5">{activeBalance.available}d</span>
                <span className={`font-bold ${isOverdrawn ? "text-rose-400" : "text-emerald-400"}`}>
                  {remainingDays}d remaining
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-slate-500 text-xs font-semibold select-none">
            Fill in the dates to generate a request summary.
          </div>
        )}
      </div>

      {/* Warning Alert inside summary card */}
      {hasDates && isOverdrawn && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-medium leading-relaxed mt-4 relative z-10">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Balance Overdrawn</span>
            You are requesting {workingDays} working days but only have {activeBalance.available} days remaining.
          </div>
        </div>
      )}
    </Card>
  );
}
