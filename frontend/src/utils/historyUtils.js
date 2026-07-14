import { STATUS_COLORS, LEAVE_STATUS } from "@/constants/dashboard";

/**
 * Formats a leave request status for user-friendly UI presentation.
 *
 * @param {string} status - Raw status code (e.g. "Pending", "Approved").
 * @returns {string} User-facing description.
 */
export const formatStatus = (status) => {
  if (!status) return "N/A";
  switch (status) {
    case LEAVE_STATUS.PENDING:
      return "Pending Review";
    case LEAVE_STATUS.APPROVED:
      return "Approved by Manager";
    case LEAVE_STATUS.REJECTED:
      return "Rejected by Manager";
    default:
      return status;
  }
};

/**
 * Appends standard leave label format suffix.
 *
 * @param {string} type - Raw type (e.g. "Annual").
 * @returns {string} Standard formatted title.
 */
export const formatLeaveType = (type) => {
  if (!type) return "Leave";
  if (type.toLowerCase().includes("leave")) return type;
  return `${type} Leave`;
};

/**
 * Formats date ranges nicely (e.g., "15 Jul 2026 to 20 Jul 2026").
 *
 * @param {string} startDateStr - ISO format date string.
 * @param {string} endDateStr - ISO format date string.
 * @returns {string} Formatted range string.
 */
export const formatDateRange = (startDateStr, endDateStr) => {
  if (!startDateStr || !endDateStr) return "N/A";

  const options = { day: "numeric", month: "short", year: "numeric" };
  const start = new Date(startDateStr).toLocaleDateString("en-US", options);
  const end = new Date(endDateStr).toLocaleDateString("en-US", options);
  
  return `${start} to ${end}`;
};

/**
 * Returns Tailwind color style declarations matching active status.
 *
 * @param {string} status - Leave request status code.
 * @returns {string} CSS classes string.
 */
export const getStatusColor = (status) => {
  return STATUS_COLORS[status] || "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-950/20 dark:text-slate-400 dark:border-slate-900/40";
};

/**
 * Calculates date range duration in absolute calendar days.
 *
 * @param {string} startDateStr - ISO start date.
 * @param {string} endDateStr - ISO end date.
 * @returns {number} Calculated duration in days.
 */
export const calculateDuration = (startDateStr, endDateStr) => {
  if (!startDateStr || !endDateStr) return 0;
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

export default {
  formatStatus,
  formatLeaveType,
  formatDateRange,
  getStatusColor,
  calculateDuration,
};
