import apiClient from "@/lib/axios";

const MOCK_ANNOUNCEMENTS = [
  {
    id: "ann-1",
    title: "Mid-Year Policy Refactoring",
    message: "Starting next month, casual leave requests require 48-hour advanced notice.",
    date: "July 10, 2026",
    urgent: true,
  },
  {
    id: "ann-2",
    title: "System Maintenance Shutdown",
    message: "The leave portal will be offline for routine upgrades on Friday from 10 PM to 12 AM.",
    date: "July 08, 2026",
    urgent: false,
  },
];

/**
 * Service layer for Employee Dashboard data operations.
 * Communicates with backend Axios endpoints.
 */
export const dashboardService = {
  /**
   * Fetches all aggregated employee dashboard data details.
   * @param {string} userId Employee reference ID.
   * @returns {Promise<object>} Dashboard metrics.
   */
  getDashboardData: async (userId) => {
    // Query backend resources concurrently
    const [balancesRes, leavesRes, holidaysRes] = await Promise.all([
      apiClient.get("/leaves/balances"),
      apiClient.get("/leaves?limit=10"),
      apiClient.get("/leaves/holidays/list"),
    ]);

    const balances = balancesRes.data.data;
    const leavesList = leavesRes.data.data.data || [];
    const holidays = holidaysRes.data.data || [];

    const pendingCount = leavesList.filter((l) => l.status === "Pending").length;
    const approvedCount = leavesList.filter((l) => l.status === "Approved").length;
    const rejectedCount = leavesList.filter((l) => l.status === "Rejected").length;

    // Build usage data chart logs dynamically from real leaves list
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const usageMap = {};
    monthNames.forEach((m) => (usageMap[m] = 0));

    leavesList.forEach((leave) => {
      if (leave.status === "Approved") {
        const monthIdx = new Date(leave.startDate).getMonth();
        const monthName = monthNames[monthIdx];
        usageMap[monthName] += leave.workingDays || 0;
      }
    });

    const usageData = monthNames.map((m) => ({
      month: m,
      days: usageMap[m],
    }));

    // Format leaves to match frontend layout keys
    const leaves = leavesList.map((l) => ({
      id: l.id,
      type: l.leaveType,
      start: l.startDate,
      end: l.endDate,
      days: l.workingDays,
      status: l.status,
      manager: l.reviewer || "System",
      reason: l.reason,
    }));

    return {
      balances: balances.map((b) => ({
        type: b.type,
        total: b.total,
        used: b.used,
        available: b.available,
      })),
      leaves,
      announcements: MOCK_ANNOUNCEMENTS,
      holidays: holidays.map((h) => ({
        name: h.name,
        date: h.date,
      })),
      usageData,
      summary: {
        pendingCount,
        approvedCount,
        rejectedCount,
      },
    };
  },

  /**
   * Cancels a pending leave request.
   * @param {string} leaveId Target request ID.
   * @returns {Promise<{success: boolean}>} Outcome confirmation.
   */
  cancelLeaveRequest: async (leaveId) => {
    await apiClient.patch(`/leaves/${leaveId}/cancel`);
    return { success: true };
  },
};

export default dashboardService;
