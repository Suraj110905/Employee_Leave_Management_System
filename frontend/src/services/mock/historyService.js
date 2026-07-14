import { MOCK_LEAVE_HISTORY } from "@/data/leaveHistoryMock";
import { LEAVE_STATUS } from "@/constants/dashboard";

// Local dataset reference to simulate session modifications in memory
let localHistoryDataset = [...MOCK_LEAVE_HISTORY];

/**
 * Generates a random delay timer representation (500ms to 900ms).
 *
 * @returns {number} Delay in milliseconds.
 */
const getRandomDelay = () => {
  return Math.floor(Math.random() * (900 - 500 + 1) + 500);
};

/**
 * Service Layer mimicking Express API leave records operations.
 */
export const historyService = {
  /**
   * Fetches paginated, filtered, and sorted leave history for an employee.
   *
   * @param {string} employeeId - Employee ID.
   * @param {Object} options - Query filters and sorting configurations.
   * @param {number} [options.page=1] - Current active page index.
   * @param {number} [options.limit=10] - Number of items per page.
   * @param {string} [options.sortBy='appliedAt'] - Data field key to sort by.
   * @param {string} [options.sortOrder='desc'] - Sort order directions ('asc' | 'desc').
   * @param {Object} [options.filters] - Query selectors to restrict match.
   * @param {string} [options.filters.status] - Match specific status level.
   * @param {string} [options.filters.leaveType] - Match specific leave category.
   * @param {string} [options.filters.startDate] - Matches ranges where start date >= filter start.
   * @param {string} [options.filters.endDate] - Matches ranges where end date <= filter end.
   * @param {string} [options.filters.search] - Case-insensitive match on reasons.
   * @returns {Promise<{data: Array, total: number, page: number, limit: number, totalPages: number}>}
   */
  getHistory: async (employeeId, options = {}) => {
    // REAL BACKEND API PATHWAY:
    // const response = await apiClient.get(`/leaves/history`, { params: { employeeId, ...options } });
    // return response.data;

    await new Promise((resolve) => setTimeout(resolve, getRandomDelay()));

    const {
      page = 1,
      limit = 10,
      sortBy = "appliedAt",
      sortOrder = "desc",
      filters = {},
    } = options;

    // 1. Filter dataset by Employee Reference
    let items = localHistoryDataset.filter((l) => l.employeeId === employeeId);

    // 2. Filter by status
    if (filters.status) {
      items = items.filter((l) => l.status.toLowerCase() === filters.status.toLowerCase());
    }

    // 3. Filter by type
    if (filters.leaveType) {
      items = items.filter((l) => l.leaveType.toLowerCase() === filters.leaveType.toLowerCase());
    }

    // 4. Filter by Date range
    if (filters.startDate) {
      items = items.filter((l) => l.startDate >= filters.startDate);
    }
    if (filters.endDate) {
      items = items.filter((l) => l.endDate <= filters.endDate);
    }

    // 5. Search reason keywords (case-insensitive)
    if (filters.search) {
      const keyword = filters.search.toLowerCase();
      items = items.filter((l) => l.reason?.toLowerCase().includes(keyword));
    }

    // 6. Sort results
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

    // 7. Paginate results
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
   * Cancels a pending leave request immutably.
   *
   * @param {string} leaveId - Leave ID.
   * @returns {Promise<Object>} The updated leave object.
   */
  cancelLeave: async (leaveId) => {
    // REAL BACKEND API PATHWAY:
    // const response = await apiClient.post(`/leaves/cancel/${leaveId}`);
    // return response.data;

    await new Promise((resolve) => setTimeout(resolve, getRandomDelay()));

    const index = localHistoryDataset.findIndex((l) => l.id === leaveId);
    if (index === -1) {
      throw new Error(`Request not found: ${leaveId}`);
    }

    const target = localHistoryDataset[index];
    if (target.status !== LEAVE_STATUS.PENDING) {
      throw new Error("Only pending requests can be cancelled.");
    }

    // Immutable state update
    const updatedRequest = {
      ...target,
      status: "Cancelled",
      updatedAt: new Date().toISOString(),
      remarks: "Cancelled by employee.",
    };

    localHistoryDataset = [
      ...localHistoryDataset.slice(0, index),
      updatedRequest,
      ...localHistoryDataset.slice(index + 1),
    ];

    return updatedRequest;
  },

  /**
   * Retrieves single leave log details.
   *
   * @param {string} leaveId - Leave ID.
   * @returns {Promise<Object>}
   */
  getLeaveById: async (leaveId) => {
    // REAL BACKEND API PATHWAY:
    // const response = await apiClient.get(`/leaves/${leaveId}`);
    // return response.data;

    await new Promise((resolve) => setTimeout(resolve, getRandomDelay()));

    const record = localHistoryDataset.find((l) => l.id === leaveId);
    if (!record) {
      throw new Error("Leave record not found.");
    }
    return record;
  },
};

export default historyService;
