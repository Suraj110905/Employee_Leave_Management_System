const LeaveRequest = require("../models/LeaveRequest");

/**
 * Repository layer for isolating Leave Request database operations.
 */
class LeaveRequestRepository {
  /**
   * Save a new leave request.
   *
   * @param {object} requestData - The leave request attributes payload.
   * @returns {Promise<object>} The created Mongoose LeaveRequest document.
   */
  async create(requestData) {
    return LeaveRequest.create(requestData);
  }

  /**
   * Retrieve a single leave request by its unique custom ID (e.g. 'LV-102').
   *
   * @param {string} id - Unique custom ID.
   * @returns {Promise<object|null>} The Mongoose LeaveRequest document.
   */
  async findById(id) {
    return LeaveRequest.findOne({ id });
  }

  /**
   * Retrieve a single leave request by database ObjectId.
   *
   * @param {string} objId - MongoDB ObjectId string.
   * @returns {Promise<object|null>} The Mongoose LeaveRequest document.
   */
  async findByObjectId(objId) {
    return LeaveRequest.findById(objId);
  }

  /**
   * Check for active leave requests overlapping a specific date range.
   * Active statuses are: "Pending", "Approved".
   * Overlap formula: (startDate <= requestedEndDate) && (endDate >= requestedStartDate).
   *
   * @param {string} employeeId - Unique employee ID.
   * @param {string} startDate - Range start date ('YYYY-MM-DD').
   * @param {string} endDate - Range end date ('YYYY-MM-DD').
   * @returns {Promise<Array>} Array of overlapping leave requests.
   */
  async findActiveOverlaps(employeeId, startDate, endDate) {
    return LeaveRequest.find({
      employeeId,
      status: { $in: ["Pending", "Approved"] },
      startDate: { $lte: endDate },
      endDate: { $gte: startDate },
    });
  }

  /**
   * Check for active leave requests overlapping a specific date range across all employees.
   */
  async findActiveOverlapsGlobal(startDate, endDate) {
    return LeaveRequest.find({
      status: { $in: ["Pending", "Approved"] },
      startDate: { $lte: endDate },
      endDate: { $gte: startDate },
    });
  }

  /**
   * Find paginated leave history across all employees.
   */
  async findHistoryGlobal(options = {}) {
    const {
      page = 1,
      limit = 10,
      status,
      leaveType,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = options;

    const query = {};

    if (status) {
      query.status = new RegExp(`^${status}$`, "i");
    }

    if (leaveType) {
      query.leaveType = new RegExp(`^${leaveType}$`, "i");
    }

    if (search && search.trim()) {
      query.$or = [
        { employeeName: { $regex: search.trim(), $options: "i" } },
        { reason: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const total = await LeaveRequest.countDocuments(query);
    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    const items = await LeaveRequest.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      items,
      total,
    };
  }

  /**
   * Retrieve paginated, filtered, and sorted leave history for an employee.
   *
   * @param {string} employeeId - Employee ID.
   * @param {object} options - Query filters and sorting configurations.
   * @returns {Promise<{items: Array, total: number}>} Paginated results array and total count.
   */
  async findHistory(employeeId, options = {}) {
    const {
      page = 1,
      limit = 10,
      status,
      leaveType,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = options;

    const query = { employeeId };

    // Apply status filter
    if (status) {
      // Normalize case match mapping
      query.status = new RegExp(`^${status}$`, "i");
    }

    // Apply leaveType filter
    if (leaveType) {
      query.leaveType = new RegExp(`^${leaveType}$`, "i");
    }

    // Apply search filter (match keywords inside reason)
    if (search && search.trim()) {
      query.reason = { $regex: search.trim(), $options: "i" };
    }

    const total = await LeaveRequest.countDocuments(query);
    
    // Set up sorting criteria
    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    const items = await LeaveRequest.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      items,
      total,
    };
  }

  /**
   * Update the status of a specific leave request.
   *
   * @param {string} id - Unique custom ID.
   * @param {string} status - Target status enum.
   * @param {object} metadata - Reviewer comments, reviewedAt, reviewer details.
   * @returns {Promise<object|null>} The updated Mongoose LeaveRequest document.
   */
  async updateStatus(id, status, metadata = {}) {
    return LeaveRequest.findOneAndUpdate(
      { id },
      {
        $set: {
          status,
          ...metadata,
        },
      },
      { new: true }
    );
  }

  /**
   * Retrieve paginated, filtered, and sorted leave history for all team members.
   *
   * @param {Array<string>} employeeIds - List of team employee IDs.
   * @param {object} options - Query filters and sorting configurations.
   * @returns {Promise<{items: Array, total: number}>} Paginated results array and total count.
   */
  async findTeamHistory(employeeIds, options = {}) {
    const {
      page = 1,
      limit = 10,
      status,
      leaveType,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = options;

    const query = { employeeId: { $in: employeeIds } };

    // Apply status filter
    if (status) {
      query.status = new RegExp(`^${status}$`, "i");
    }

    // Apply leaveType filter
    if (leaveType) {
      query.leaveType = new RegExp(`^${leaveType}$`, "i");
    }

    // Apply search filter (match keywords inside reason or employeeName)
    if (search && search.trim()) {
      query.$or = [
        { reason: { $regex: search.trim(), $options: "i" } },
        { employeeName: { $regex: search.trim(), $options: "i" } },
      ];
    }

    const total = await LeaveRequest.countDocuments(query);
    
    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    const items = await LeaveRequest.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      items,
      total,
    };
  }

  /**
   * Find active team leaves within a specific date range.
   * Active statuses are: "Approved".
   *
   * @param {Array<string>} employeeIds - List of team employee IDs.
   * @param {string} start - Range start date ('YYYY-MM-DD').
   * @param {string} end - Range end date ('YYYY-MM-DD').
   * @returns {Promise<Array>} List of approved team leave requests.
   */
  async findActiveLeavesForCalendar(employeeIds, start, end) {
    return LeaveRequest.find({
      employeeId: { $in: employeeIds },
      status: "Approved",
      startDate: { $lte: end },
      endDate: { $gte: start },
    });
  }
}

module.exports = new LeaveRequestRepository();
