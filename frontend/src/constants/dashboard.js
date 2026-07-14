/**
 * Dashboard Constants.
 * Maps standard leave statuses, colors, and display thresholds.
 */
export const LEAVE_STATUS = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export const LEAVE_COLORS = {
  Annual: {
    bg: "bg-emerald-50 dark:bg-emerald-950/20",
    text: "text-emerald-700 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-900/30",
    primary: "bg-emerald-500",
  },
  Sick: {
    bg: "bg-rose-50 dark:bg-rose-950/20",
    text: "text-rose-700 dark:text-rose-400",
    border: "border-rose-200 dark:border-rose-900/30",
    primary: "bg-rose-500",
  },
  Casual: {
    bg: "bg-amber-50 dark:bg-amber-950/20",
    text: "text-amber-700 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-900/30",
    primary: "bg-amber-500",
  },
  Maternity: {
    bg: "bg-sky-50 dark:bg-sky-950/20",
    text: "text-sky-700 dark:text-sky-400",
    border: "border-sky-200 dark:border-sky-900/30",
    primary: "bg-sky-500",
  },
  Paternity: {
    bg: "bg-sky-50 dark:bg-sky-950/20",
    text: "text-sky-700 dark:text-sky-400",
    border: "border-sky-200 dark:border-sky-900/30",
    primary: "bg-sky-500",
  },
  Default: {
    bg: "bg-slate-50 dark:bg-slate-950/20",
    text: "text-slate-700 dark:text-slate-400",
    border: "border-slate-200 dark:border-slate-900/30",
    primary: "bg-slate-500",
  },
};

export const STATUS_COLORS = {
  [LEAVE_STATUS.APPROVED]: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/25 dark:text-emerald-400 dark:border-emerald-900/40",
  [LEAVE_STATUS.REJECTED]: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/25 dark:text-rose-400 dark:border-rose-900/40",
  [LEAVE_STATUS.PENDING]: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/25 dark:text-amber-400 dark:border-amber-900/40",
};

export default {
  LEAVE_STATUS,
  LEAVE_COLORS,
  STATUS_COLORS,
};
