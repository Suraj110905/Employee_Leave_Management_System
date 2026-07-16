import apiClient from "@/lib/axios";

export const leaveUtils = {
  calculateLeaveDuration: (startDateStr, endDateStr) => {
    if (!startDateStr || !endDateStr) return 0;
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  },

  calculateWorkingDays: (startDateStr, endDateStr) => {
    if (!startDateStr || !endDateStr) return 0;
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    let count = 0;
    const curDate = new Date(start.getTime());
    while (curDate <= end) {
      const dayOfWeek = curDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        count++;
      }
      curDate.setDate(curDate.getDate() + 1);
    }
    return count;
  },

  validateDates: (startDateStr, endDateStr) => {
    if (!startDateStr || !endDateStr) return "Dates are required.";
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const cutoff = new Date(today.getTime() - 24 * 60 * 60 * 1000);

    if (start < cutoff) {
      return "Start date cannot be in the past.";
    }
    if (end < start) {
      return "End date cannot be before the start date.";
    }
    return null;
  },
};

/**
 * Leave Service API layer.
 */
export const leaveService = {
  /**
   * Fetches leave balances for the authenticated employee.
   */
  getBalances: async (userId) => {
    const response = await apiClient.get("/leaves/balances");
    return response.data.data.map((b) => ({
      type: b.type,
      total: b.total,
      used: b.used,
      available: b.available,
    }));
  },

  /**
   * Submits a new leave request.
   */
  submitLeave: async (userId, leaveData) => {
    const response = await apiClient.post("/leaves", {
      leaveType: leaveData.leaveType,
      startDate: leaveData.startDate,
      endDate: leaveData.endDate,
      reason: leaveData.reason,
    });
    return response.data.data;
  },

  /**
   * Retrieves leave history list for the employee.
   */
  getLeavesHistory: async (userId) => {
    const response = await apiClient.get("/leaves");
    return response.data.data.data || [];
  },
};

export default leaveService;
