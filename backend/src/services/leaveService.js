const leaveBalanceRepository = require("../repositories/leaveBalanceRepository");
const leaveRequestRepository = require("../repositories/leaveRequestRepository");
const userRepository = require("../repositories/userRepository");
const notificationRepository = require("../repositories/notificationRepository");

/**
 * Service managing Leave approvals, validations and durations calculations.
 */
class LeaveService {
  /**
   * Fetches active leave balances for an employee.
   *
   * @param {string} employeeId - Unique employee ID.
   * @returns {Promise<Array>} Balances array.
   */
  async getBalances(employeeId) {
    const record = await leaveBalanceRepository.findByEmployeeId(employeeId);
    if (!record) {
      return [];
    }
    return record.balances.map((b) => ({
      type: b.type,
      total: b.total,
      used: b.used,
      available: b.available,
    }));
  }

  /**
   * Fetch paginated chronological leave request history list.
   *
   * @param {string} employeeId - Unique employee ID.
   * @param {object} queryOptions - Page, filters parameters.
   * @returns {Promise<object>} Standard pagination payload.
   */
  async getHistory(employeeId, queryOptions = {}) {
    const page = parseInt(queryOptions.page, 10) || 1;
    const limit = parseInt(queryOptions.limit, 10) || 10;
    const status = queryOptions.status;
    const leaveType = queryOptions.type;
    const search = queryOptions.search;
    
    // Sort option maps
    let sortBy = "createdAt";
    if (queryOptions.sort === "startDate") sortBy = "startDate";
    if (queryOptions.sort === "endDate") sortBy = "endDate";

    const { items, total } = await leaveRequestRepository.findHistory(employeeId, {
      page,
      limit,
      status,
      leaveType,
      search,
      sortBy,
      sortOrder: "desc",
    });

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
      data: items.map((l) => ({
        id: l.id,
        employeeId: l.employeeId,
        employeeName: l.employeeName,
        leaveType: l.leaveType,
        startDate: l.startDate,
        endDate: l.endDate,
        totalDays: l.totalDays,
        workingDays: l.workingDays,
        reason: l.reason,
        status: l.status,
        attachment: l.attachment,
        reviewer: l.reviewer,
        reviewedAt: l.reviewedAt,
        remarks: l.remarks,
        createdAt: l.createdAt,
      })),
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Retrieve single leave details.
   *
   * @param {string} id - Leave unique ID.
   * @param {string} employeeId - Requesting employee identifier.
   * @returns {Promise<object>} Details payload.
   */
  async getLeaveDetails(id, employeeId) {
    const leave = await leaveRequestRepository.findById(id);
    if (!leave) {
      throw new Error("Leave record not found.");
    }

    if (leave.employeeId !== employeeId) {
      throw new Error("Access denied. You are not authorized to view this leave record.");
    }

    return leave;
  }

  /**
   * Submit a new leave request.
   * Performs date verification, working days count, overlaps check, and balance validation.
   *
   * @param {string} employeeId - Requesting employee ID.
   * @param {object} leaveData - Leave form attributes (leaveType, startDate, endDate, reason).
   * @returns {Promise<object>} Created request statistics.
   */
  async applyLeave(employeeId, leaveData) {
    const { leaveType, startDate, endDate, reason } = leaveData;

    // 1. Retrieve user details
    const user = await userRepository.findByEmployeeId(employeeId);
    if (!user) {
      throw new Error("Employee profile not found.");
    }

    // 2. Validate dates with a 24-hour timezone buffer cutoff
    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const cutoff = new Date(today.getTime() - 24 * 60 * 60 * 1000);

    if (start < cutoff) {
      throw new Error("Start date cannot be in the past.");
    }
    if (end < start) {
      throw new Error("End date cannot be before the start date.");
    }

    // 3. Calculate Calendar Days & Working Days (Excluding Sat/Sun)
    const diffTime = Math.abs(end - start);
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    let workingDays = 0;
    const curDate = new Date(start.getTime());
    while (curDate <= end) {
      const day = curDate.getDay();
      if (day !== 0 && day !== 6) { // 0 = Sunday, 6 = Saturday
        workingDays++;
      }
      curDate.setDate(curDate.getDate() + 1);
    }

    if (workingDays === 0) {
      throw new Error("Leave request contains zero working days.");
    }

    // 4. Overlaps Check (queries active Pending/Approved leaves)
    const overlaps = await leaveRequestRepository.findActiveOverlaps(employeeId, startDate, endDate);
    if (overlaps && overlaps.length > 0) {
      throw new Error("A leave request already overlaps with these selected dates.");
    }

    // 5. Balance Validation
    const balanceRecord = await leaveBalanceRepository.findByEmployeeId(employeeId);
    if (!balanceRecord) {
      throw new Error("Leave balance ledger not found.");
    }

    const balance = balanceRecord.balances.find(
      (b) => b.type.toLowerCase() === leaveType.toLowerCase()
    );

    if (!balance) {
      throw new Error(`Leave policy category [${leaveType}] does not exist for this user.`);
    }

    if (workingDays > balance.available) {
      throw new Error(`Insufficient leave balance. Requested: ${workingDays} days, Available: ${balance.available} days.`);
    }

    // 6. Save Leave request as Pending (No balance deduction occurs at this stage!)
    const customId = `LV-${Math.floor(100 + Math.random() * 900)}`;

    const newRequest = {
      id: customId,
      employeeId,
      employeeName: user.name,
      leaveType,
      startDate,
      endDate,
      totalDays,
      workingDays,
      reason,
      status: "Pending",
      attachment: null,
      reviewer: null,
      reviewedAt: null,
      remarks: null,
    };

    const created = await leaveRequestRepository.create(newRequest);

    if (user.managerId) {
      await notificationRepository.createNotification({
        employeeId: user.managerId,
        title: "New Leave Application",
        message: `${user.name} has applied for ${workingDays} day(s) of ${leaveType} leave starting on ${startDate}.`,
        type: "LeaveRequest",
      });
    }

    return {
      id: created.id,
      status: created.status,
      workingDays: created.workingDays,
      appliedAt: created.createdAt,
    };
  }

  /**
   * Cancel a pending leave request.
   *
   * @param {string} id - Unique leave ID.
   * @param {string} employeeId - Requesting employee ID.
   * @returns {Promise<void>}
   */
  async cancelLeave(id, employeeId) {
    const leave = await leaveRequestRepository.findById(id);
    if (!leave) {
      throw new Error("Leave record not found.");
    }

    if (leave.employeeId !== employeeId) {
      throw new Error("Access denied. You are not authorized to cancel this leave record.");
    }

    if (leave.status !== "Pending") {
      throw new Error("Only pending leave requests can be cancelled.");
    }

    // Cancel request (No balance restoration is needed since balance was not deducted on submission)
    return await leaveRequestRepository.updateStatus(id, "Cancelled", {
      remarks: "Cancelled by employee.",
      reviewedAt: new Date(),
    });
  }
}

module.exports = new LeaveService();
