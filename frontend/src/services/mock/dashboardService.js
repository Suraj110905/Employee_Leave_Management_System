import apiClient from "@/lib/axios";

// Mock Database Records
const MOCK_BALANCES = [
  { type: "Annual", total: 15, used: 3, available: 12 },
  { type: "Sick", total: 10, used: 2, available: 8 },
  { type: "Casual", total: 8, used: 4, available: 4 },
  { type: "Maternity", total: 30, used: 0, available: 30 },
];

const MOCK_LEAVES = [
  {
    id: "LV-102",
    type: "Annual",
    start: "2026-07-15",
    end: "2026-07-20",
    days: 5,
    status: "Pending",
    manager: "Sarah Hansen",
    reason: "Family vacation",
  },
  {
    id: "LV-098",
    type: "Sick",
    start: "2026-06-10",
    end: "2026-06-11",
    days: 1,
    status: "Approved",
    manager: "Sarah Hansen",
    reason: "Medical checkup",
  },
  {
    id: "LV-085",
    type: "Casual",
    start: "2026-05-02",
    end: "2026-05-03",
    days: 2,
    status: "Rejected",
    manager: "Sarah Hansen",
    reason: "Personal errands",
  },
];

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

const MOCK_HOLIDAYS = [
  { name: "Independence Day", date: "2026-07-04" },
  { name: "Labor Day", date: "2026-09-07" },
  { name: "Thanksgiving Day", date: "2026-11-26" },
];

const MOCK_USAGE_DATA = [
  { month: "Jan", days: 1 },
  { month: "Feb", days: 0 },
  { month: "Mar", days: 2 },
  { month: "Apr", days: 3 },
  { month: "May", days: 2 },
  { month: "Jun", days: 1 },
  { month: "Jul", days: 5 },
];

/**
 * Mock Service layer for Employee Dashboard data operations.
 * Easily swappable with backend Axios endpoints.
 */
export const dashboardService = {
  /**
   * Fetches all aggregated employee dashboard data details.
   * @param {string} userId Employee reference ID.
   * @returns {Promise<object>} Dashboard metrics.
   */
  getDashboardData: async (userId) => {
    // REAL BACKEND API PATHWAY:
    // const response = await apiClient.get(`/dashboard/employee/${userId}`);
    // return response.data;

    // Simulate API network latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Optional error simulation: if userId === "error", trigger recovery states
    if (userId === "error") {
      throw new Error("Unable to retrieve dashboard stats. Database connection timeout.");
    }

    const pendingCount = MOCK_LEAVES.filter((l) => l.status === "Pending").length;
    const approvedCount = MOCK_LEAVES.filter((l) => l.status === "Approved").length;
    const rejectedCount = MOCK_LEAVES.filter((l) => l.status === "Rejected").length;

    return {
      balances: MOCK_BALANCES,
      leaves: MOCK_LEAVES,
      announcements: MOCK_ANNOUNCEMENTS,
      holidays: MOCK_HOLIDAYS,
      usageData: MOCK_USAGE_DATA,
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
    // REAL BACKEND API PATHWAY:
    // const response = await apiClient.post(`/leaves/cancel/${leaveId}`);
    // return response.data;

    await new Promise((resolve) => setTimeout(resolve, 500));
    return { success: true };
  },
};

export default dashboardService;
