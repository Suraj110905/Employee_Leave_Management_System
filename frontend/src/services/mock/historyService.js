import apiClient from "@/lib/axios";

/**
 * Service Layer calling Express API leave records operations.
 */
export const historyService = {
  /**
   * Fetches paginated, filtered, and sorted leave history for an employee.
   *
   * @param {string} employeeId - Employee ID.
   * @param {Object} options - Query filters and sorting configurations.
   * @returns {Promise<{data: Array, total: number, page: number, limit: number, totalPages: number}>}
   */
  getHistory: async (employeeId, options = {}) => {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      filters = {},
    } = options;

    // Flatten parameters for backend query
    const params = {
      page,
      limit,
      sortBy,
      sortOrder,
      status: filters.status,
      leaveType: filters.leaveType,
      search: filters.search,
    };

    const response = await apiClient.get("/leaves", { params });
    const result = response.data.data;

    return {
      data: (result.data || []).map((l) => ({
        id: l.id,
        employeeId: l.employeeId,
        employeeName: l.employeeName || "",
        leaveType: l.leaveType,
        startDate: l.startDate,
        endDate: l.endDate,
        workingDays: l.workingDays,
        status: l.status,
        reason: l.reason,
        remarks: l.remarks || "",
        reviewer: l.reviewer || "",
        appliedAt: l.createdAt,
      })),
      total: result.total || 0,
      page: result.page || page,
      limit: result.limit || limit,
      totalPages: result.totalPages || 1,
    };
  },

  /**
   * Cancels a pending leave request.
   *
   * @param {string} leaveId - Leave ID.
   * @returns {Promise<Object>} The updated leave object.
   */
  cancelLeave: async (leaveId) => {
    const response = await apiClient.patch(`/leaves/${leaveId}/cancel`);
    return response.data.data;
  },

  /**
   * Retrieves single leave log details.
   *
   * @param {string} leaveId - Leave ID.
   * @returns {Promise<Object>}
   */
  getLeaveById: async (leaveId) => {
    const response = await apiClient.get(`/leaves/${leaveId}`);
    const l = response.data.data;
    
    return {
      id: l.id,
      employeeId: l.employeeId,
      employeeName: l.employeeName || "",
      leaveType: l.leaveType,
      startDate: l.startDate,
      endDate: l.endDate,
      workingDays: l.workingDays,
      status: l.status,
      reason: l.reason,
      remarks: l.remarks || "",
      reviewer: l.reviewer || "",
      appliedAt: l.createdAt,
    };
  },
};

export default historyService;
