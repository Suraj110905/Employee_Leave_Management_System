import { MOCK_TEAM_MEMBERS, MOCK_APPROVALS, MOCK_NOTIFICATIONS, MOCK_ANALYTICS } from "@/data/managerMock";
import { LEAVE_STATUS } from "@/constants/dashboard";

let localApprovalsDataset = [...MOCK_APPROVALS];
let localNotifications = [...MOCK_NOTIFICATIONS];

/**
 * Helper to simulate network delay (500ms to 900ms).
 *
 * @returns {number} Delay in milliseconds.
 */
const getRandomDelay = () => {
  return Math.floor(Math.random() * (900 - 500 + 1) + 500);
};

/**
 * Service Layer mimicking Express API Manager operations.
 */
export const managerService = {
  /**
   * Retrieves summary KPIs for the manager's dashboard.
   *
   * @param {string} managerId - Manager ID.
   * @returns {Promise<Object>} KPI counters.
   */
  getDashboardStats: async (managerId) => {
    // REAL BACKEND API PATHWAY:
    // GET /api/v1/manager/stats?managerId=...
    await new Promise((resolve) => setTimeout(resolve, getRandomDelay()));

    const pending = localApprovalsDataset.filter((r) => r.status === LEAVE_STATUS.PENDING).length;
    const approved = localApprovalsDataset.filter((r) => r.status === LEAVE_STATUS.APPROVED).length;
    const rejected = localApprovalsDataset.filter((r) => r.status === LEAVE_STATUS.REJECTED).length;

    return {
      pendingCount: pending,
      approvedThisMonth: approved,
      rejectedThisMonth: rejected,
      onLeaveTodayCount: 1,
      upcomingLeavesCount: 2,
      teamAvailabilityPercentage: 88,
    };
  },

  /**
   * Fetches paginated, filtered, and sorted leave approvals.
   *
   * @param {string} managerId - Manager ID.
   * @param {Object} options - Query filters and sorting configurations.
   * @param {number} [options.page=1] - Current page number.
   * @param {number} [options.limit=10] - Items per page.
   * @param {string} [options.sortBy='appliedAt'] - Sort field key.
   * @param {string} [options.sortOrder='desc'] - Sort direction.
   * @param {Object} [options.filters] - Query selectors to restrict match.
   * @param {string} [options.filters.status] - Approval status filter value.
   * @param {string} [options.filters.leaveType] - Leave type filter value.
   * @param {string} [options.filters.search] - Employee name search keyword.
   * @returns {Promise<{data: Array, total: number, page: number, limit: number, totalPages: number}>}
   */
  getApprovals: async (managerId, options = {}) => {
    // REAL BACKEND API PATHWAY:
    // GET /api/v1/manager/approvals
    await new Promise((resolve) => setTimeout(resolve, getRandomDelay()));

    const {
      page = 1,
      limit = 10,
      sortBy = "appliedAt",
      sortOrder = "desc",
      filters = {},
    } = options;

    let items = [...localApprovalsDataset];

    // 1. Filter by status
    if (filters.status) {
      items = items.filter((l) => l.status.toLowerCase() === filters.status.toLowerCase());
    }

    // 2. Filter by type
    if (filters.leaveType) {
      items = items.filter((l) => l.leaveType.toLowerCase() === filters.leaveType.toLowerCase());
    }

    // 3. Filter by search name (case-insensitive)
    if (filters.search) {
      const keyword = filters.search.toLowerCase();
      items = items.filter((l) => l.employeeName?.toLowerCase().includes(keyword));
    }

    // 4. Sort results
    items.sort((a, b) => {
      let valA = a[sortBy] ?? "";
      let valB = b[sortBy] ?? "";

      if (typeof valA === "string") {
        return sortOrder === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      return sortOrder === "asc" ? valA - valB : valB - valA;
    });

    // 5. Paginate results
    const total = items.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const offset = (page - 1) * limit;
    const paginatedItems = items.slice(offset, offset + limit);

    return {
      data: paginatedItems,
      total,
      page,
      limit,
      totalPages,
    };
  },

  /**
   * Approves a pending leave request, handling multi-level validation stages.
   *
   * @param {string} leaveId - Request ID.
   * @param {string} managerId - Reviewer Manager ID.
   * @param {string} remarks - Approval comments remarks.
   * @returns {Promise<Object>} Updated request details.
   */
  approveRequest: async (leaveId, managerId, remarks) => {
    // REAL BACKEND API PATHWAY:
    // POST /api/v1/manager/approvals/:id/approve
    await new Promise((resolve) => setTimeout(resolve, getRandomDelay()));

    const idx = localApprovalsDataset.findIndex((r) => r.id === leaveId);
    if (idx === -1) throw new Error("Leave request not found.");

    const target = localApprovalsDataset[idx];
    if (target.status !== LEAVE_STATUS.PENDING) {
      throw new Error("Only pending requests can be reviewed.");
    }

    // Multi-level approval stage handling
    const nextApprovedBy = [...target.approvedBy, `Sarah Hansen (${managerId})`];
    const isCompleted = target.currentStage === target.totalStages;

    const updated = {
      ...target,
      status: isCompleted ? LEAVE_STATUS.APPROVED : LEAVE_STATUS.PENDING,
      currentStage: isCompleted ? target.currentStage : target.currentStage + 1,
      approvedBy: nextApprovedBy,
      reviewer: `Sarah Hansen (${managerId})`,
      reviewedAt: new Date().toISOString(),
      remarks: remarks || "Approved.",
      updatedAt: new Date().toISOString(),
    };

    localApprovalsDataset = [
      ...localApprovalsDataset.slice(0, idx),
      updated,
      ...localApprovalsDataset.slice(idx + 1),
    ];

    return updated;
  },

  /**
   * Rejects a leave request (mandates remarks).
   *
   * @param {string} leaveId - Request ID.
   * @param {string} managerId - Reviewer Manager ID.
   * @param {string} remarks - Rejection reason remarks.
   * @returns {Promise<Object>} Updated request details.
   */
  rejectRequest: async (leaveId, managerId, remarks) => {
    // REAL BACKEND API PATHWAY:
    // POST /api/v1/manager/approvals/:id/reject
    if (!remarks || remarks.trim().length < 10) {
      throw new Error("Rejection comments must be at least 10 characters.");
    }

    await new Promise((resolve) => setTimeout(resolve, getRandomDelay()));

    const idx = localApprovalsDataset.findIndex((r) => r.id === leaveId);
    if (idx === -1) throw new Error("Leave request not found.");

    const target = localApprovalsDataset[idx];
    if (target.status !== LEAVE_STATUS.PENDING) {
      throw new Error("Only pending requests can be reviewed.");
    }

    const updated = {
      ...target,
      status: LEAVE_STATUS.REJECTED,
      rejectedBy: managerId,
      reviewer: `Sarah Hansen (${managerId})`,
      reviewedAt: new Date().toISOString(),
      remarks: remarks.trim(),
      updatedAt: new Date().toISOString(),
    };

    localApprovalsDataset = [
      ...localApprovalsDataset.slice(0, idx),
      updated,
      ...localApprovalsDataset.slice(idx + 1),
    ];

    return updated;
  },

  /**
   * Retrieves active team profiles roster.
   *
   * @param {string} managerId - Manager ID.
   * @returns {Promise<Array>} Roster array list.
   */
  getTeamRoster: async (managerId) => {
    // REAL BACKEND API PATHWAY:
    // GET /api/v1/manager/team?managerId=...
    await new Promise((resolve) => setTimeout(resolve, getRandomDelay()));
    return MOCK_TEAM_MEMBERS;
  },

  /**
   * Retrieves notification lists alerts.
   *
   * @returns {Promise<Array>} Notifications.
   */
  getNotifications: async () => {
    // REAL BACKEND API PATHWAY:
    // GET /api/v1/manager/notifications
    await new Promise((resolve) => setTimeout(resolve, getRandomDelay()));
    return localNotifications;
  },

  /**
   * Marks a specific notification as read.
   *
   * @param {string} id - Notification ID.
   * @returns {Promise<boolean>}
   */
  markAsRead: async (id) => {
    // REAL BACKEND API PATHWAY:
    // POST /api/v1/manager/notifications/:id/read
    await new Promise((resolve) => setTimeout(resolve, 300));
    localNotifications = localNotifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    return true;
  },

  /**
   * Retrieves analytics data structures.
   *
   * @returns {Promise<Object>} Analytics charts data.
   */
  getAnalyticsMocks: async () => {
    // REAL BACKEND API PATHWAY:
    // GET /api/v1/manager/analytics
    await new Promise((resolve) => setTimeout(resolve, getRandomDelay()));
    return MOCK_ANALYTICS;
  },
};

export default managerService;
