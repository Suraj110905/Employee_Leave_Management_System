import apiClient from "@/lib/axios";

/**
 * Service Layer calling Express API Manager operations.
 */
export const managerService = {
  /**
   * Retrieves summary KPIs for the manager's dashboard.
   */
  getDashboardStats: async (managerId) => {
    const response = await apiClient.get("/manager/dashboard");
    return response.data.data;
  },

  /**
   * Fetches paginated, filtered, and sorted leave approvals.
   */
  getApprovals: async (managerId, options = {}) => {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
      filters = {},
    } = options;

    const params = {
      page,
      limit,
      sortBy,
      sortOrder,
      status: filters.status,
      leaveType: filters.leaveType,
      search: filters.search,
    };

    const response = await apiClient.get("/manager/leave-requests", { params });
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
        appliedAt: l.createdAt,
        remarks: l.remarks || "",
        reviewer: l.reviewer || "",
        reviewedAt: l.reviewedAt || null,
        currentStage: l.currentStage || 1,
        totalStages: l.totalStages || 1,
        approvedBy: l.approvedBy || [],
        rejectedBy: l.rejectedBy || null,
      })),
      total: result.total || 0,
      page: result.page || page,
      limit: result.limit || limit,
      totalPages: result.totalPages || 1,
    };
  },

  /**
   * Approves a pending leave request.
   */
  approveRequest: async (leaveId, managerId, remarks) => {
    const response = await apiClient.patch(`/manager/leave-requests/${leaveId}/approve`, { remarks });
    return response.data.data;
  },

  /**
   * Rejects a leave request.
   */
  rejectRequest: async (leaveId, managerId, remarks) => {
    const response = await apiClient.patch(`/manager/leave-requests/${leaveId}/reject`, { remarks });
    return response.data.data;
  },

  /**
   * Retrieves active team profiles roster and embeds their active calendar leaves.
   */
  getTeamRoster: async (managerId) => {
    const [rosterRes, calendarRes] = await Promise.all([
      apiClient.get("/manager/team"),
      // Query calendar for a broad range around current months (e.g. June to August 2026)
      apiClient.get("/manager/calendar?startDate=2026-06-01&endDate=2026-08-30"),
    ]);

    const roster = rosterRes.data.data.data || [];
    const events = calendarRes.data.data || [];

    return roster.map((member) => {
      const memberLeaves = events
        .filter((ev) => ev.employeeId === member.employeeId)
        .map((ev) => ({
          start: ev.startDate,
          end: ev.endDate,
          status: ev.status,
          type: ev.leaveType,
        }));

      return {
        id: member.employeeId,
        employeeId: member.employeeId,
        name: member.name,
        email: member.email,
        role: member.role,
        department: member.department,
        designation: member.designation,
        phone: member.phone || "",
        avatar: member.avatar,
        activeLeaves: memberLeaves,
      };
    });
  },

  /**
   * Retrieves notification list alerts.
   */
  getNotifications: async () => {
    const response = await apiClient.get("/notifications?status=unread");
    return response.data.data.data || [];
  },

  /**
   * Marks a specific notification as read.
   */
  markAsRead: async (id) => {
    await apiClient.patch(`/notifications/${id}`);
    return true;
  },

  /**
   * Retrieves analytics data structures.
   */
  getAnalyticsMocks: async () => {
    // Return matching layout schema for dashboard charts
    return {
      monthlyTrends: [
        { month: "Jan", approved: 2, rejected: 1 },
        { month: "Feb", approved: 1, rejected: 0 },
        { month: "Mar", approved: 3, rejected: 1 },
        { month: "Apr", approved: 2, rejected: 2 },
        { month: "May", approved: 4, rejected: 0 },
        { month: "Jun", approved: 3, rejected: 1 },
        { month: "Jul", approved: 5, rejected: 0 },
      ],
      distribution: [
        { name: "Annual", value: 45 },
        { name: "Sick", value: 25 },
        { name: "Casual", value: 20 },
        { name: "Maternity", value: 10 },
      ],
      departmentLeaveRate: [
        { name: "Engineering", rate: 12 },
        { name: "Product Design", rate: 8 },
        { name: "Operations", rate: 15 },
        { name: "Human Resources", rate: 5 },
      ],
    };
  },
};

export default managerService;
