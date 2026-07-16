const userRepository = require("../repositories/userRepository");
const leaveRequestRepository = require("../repositories/leaveRequestRepository");
const leaveBalanceRepository = require("../repositories/leaveBalanceRepository");
const auditLogRepository = require("../repositories/auditLogRepository");
const notificationRepository = require("../repositories/notificationRepository");

/**
 * Service handling all Manager-specific business logic.
 */
class ManagerService {
  /**
   * Retrieves dashboard statistics counters dynamically for the manager's team.
   *
   * @param {string} managerId - Unique employee ID of the manager.
   * @returns {Promise<object>} Statistics object.
   */
  async getDashboardStats(managerId) {
    // 1. Fetch team members
    const team = await userRepository.findTeamByManagerId(managerId);
    const teamIds = team.map((u) => u.employeeId);

    if (teamIds.length === 0) {
      return {
        pendingCount: 0,
        approvedThisMonth: 0,
        rejectedThisMonth: 0,
        onLeaveTodayCount: 0,
        upcomingLeavesCount: 0,
        teamAvailabilityPercentage: 100,
      };
    }

    const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    // 2. Query team leaves
    // Count pending approvals
    const pendingCount = await leaveRequestRepository.findTeamHistory(teamIds, { status: "Pending", limit: 1000 }).then((r) => r.total);

    // Fetch team requests to count monthly stats
    const allHistory = await leaveRequestRepository.findTeamHistory(teamIds, { limit: 10000 }).then((r) => r.items);

    let approvedThisMonth = 0;
    let rejectedThisMonth = 0;
    let onLeaveTodayCount = 0;
    let upcomingLeavesCount = 0;

    allHistory.forEach((leave) => {
      const isApproved = leave.status === "Approved";
      const isRejected = leave.status === "Rejected";

      // Count monthly stats
      if (leave.reviewedAt && new Date(leave.reviewedAt) >= startOfMonth) {
        if (isApproved) approvedThisMonth++;
        if (isRejected) rejectedThisMonth++;
      }

      if (isApproved) {
        // Count on-leave today
        if (leave.startDate <= todayStr && leave.endDate >= todayStr) {
          onLeaveTodayCount++;
        }
        // Count upcoming
        if (leave.startDate > todayStr) {
          upcomingLeavesCount++;
        }
      }
    });

    const headcount = teamIds.length;
    const teamAvailabilityPercentage = headcount > 0 
      ? Math.round(((headcount - onLeaveTodayCount) / headcount) * 100)
      : 100;

    // Count all leave requests starting this month
    let leavesThisMonth = 0;
    allHistory.forEach((leave) => {
      const start = new Date(leave.startDate);
      if (start >= startOfMonth) {
        leavesThisMonth++;
      }
    });

    return {
      pendingCount,
      approvedThisMonth,
      rejectedThisMonth,
      onLeaveTodayCount,
      upcomingLeavesCount,
      teamAvailabilityPercentage,
      teamMembersCount: headcount,
      leavesThisMonth,
    };
  }

  /**
   * Fetch team members list assigned to manager.
   *
   * @param {string} managerId - Manager ID.
   * @param {object} options - Page/limit/search filters.
   * @returns {Promise<object>} Paginated team profiles.
   */
  async getTeam(managerId, options = {}) {
    const page = parseInt(options.page, 10) || 1;
    const limit = parseInt(options.limit, 10) || 10;
    const search = options.search;

    const team = await userRepository.findTeamByManagerId(managerId, { search });
    
    // Manual pagination on matched database records
    const total = team.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const offset = (page - 1) * limit;
    const paginated = team.slice(offset, offset + limit);

    return {
      data: paginated.map((u) => ({
        id: u.employeeId,
        employeeId: u.employeeId,
        name: u.name,
        email: u.email,
        role: u.role,
        department: u.department,
        designation: u.designation,
        phone: u.phone || "",
        avatar: u.name.split(" ").map((n) => n[0]).join("").toUpperCase(),
      })),
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Fetch paginated approvals request history queue.
   */
  async getApprovals(managerId, options = {}) {
    const team = await userRepository.findTeamByManagerId(managerId);
    const teamIds = team.map((u) => u.employeeId);

    if (teamIds.length === 0) {
      return { data: [], total: 0, page: 1, limit: 10, totalPages: 1 };
    }

    const page = parseInt(options.page, 10) || 1;
    const limit = parseInt(options.limit, 10) || 10;
    
    const { items, total } = await leaveRequestRepository.findTeamHistory(teamIds, {
      page,
      limit,
      status: options.status,
      leaveType: options.leaveType,
      search: options.search,
      sortBy: "createdAt",
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
        workingDays: l.workingDays,
        status: l.status,
        reason: l.reason,
        createdAt: l.createdAt,
      })),
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Get single approval details.
   */
  async getApprovalDetails(leaveId, managerId) {
    const leave = await leaveRequestRepository.findById(leaveId);
    if (!leave) {
      throw new Error("Leave request not found.");
    }

    const employee = await userRepository.findByEmployeeId(leave.employeeId);
    if (!employee || employee.managerId !== managerId) {
      throw new Error("Access denied. Employee is not in your direct reports.");
    }

    return leave;
  }

  /**
   * Approve a pending leave request, deducting balances, writing audits, and alerts.
   */
  async approveLeave(leaveId, managerId, remarks, ipAddress = null, userAgent = null) {
    const leave = await leaveRequestRepository.findById(leaveId);
    if (!leave) {
      throw new Error("Leave request not found.");
    }

    // 1. Verify direct report ownership
    const employee = await userRepository.findByEmployeeId(leave.employeeId);
    if (!employee || employee.managerId !== managerId) {
      throw new Error("Access denied. This request does not belong to your team.");
    }

    // 2. Validate pending status
    if (leave.status !== "Pending") {
      throw new Error(`Cannot approve request. Current status is already: ${leave.status}`);
    }

    // 3. Validate available leave balance details
    const balanceRecord = await leaveBalanceRepository.findByEmployeeId(leave.employeeId);
    if (!balanceRecord) {
      throw new Error("Employee leave balance ledger not found.");
    }

    const balance = balanceRecord.balances.find(
      (b) => b.type.toLowerCase() === leave.leaveType.toLowerCase()
    );

    if (!balance) {
      throw new Error(`Leave policy [${leave.leaveType}] is not registered for this employee.`);
    }

    if (leave.workingDays > balance.available) {
      throw new Error(`Insufficient leave balance. Requested: ${leave.workingDays} days, Available: ${balance.available} days.`);
    }

    // 4. Update request status to Approved
    const updated = await leaveRequestRepository.updateStatus(leaveId, "Approved", {
      reviewer: managerId,
      reviewedAt: new Date(),
      remarks: remarks || "Approved. Project milestones covered.",
    });

    // 5. Deduct leave balance ledger available amount
    balance.available -= leave.workingDays;
    balance.used += leave.workingDays;
    await leaveBalanceRepository.save(balanceRecord);

    // 6. Write system AuditLog record
    await auditLogRepository.createLog({
      performedBy: managerId,
      role: "manager",
      action: "LEAVE_APPROVED",
      details: `Approved Leave request ${leaveId} for employee ${leave.employeeId} (${leave.workingDays} working days)`,
      ipAddress,
      userAgent,
    });

    // 7. Create notification alert for employee
    await notificationRepository.createNotification({
      employeeId: leave.employeeId,
      title: "Leave Request Approved",
      message: `Your leave request from ${leave.startDate} to ${leave.endDate} was approved by your manager.`,
      type: "LeaveApproval",
    });

    return updated;
  }

  /**
   * Rejects a pending leave request with mandatory comments.
   */
  async rejectLeave(leaveId, managerId, remarks, ipAddress = null, userAgent = null) {
    if (!remarks || remarks.trim().length < 10) {
      throw new Error("Rejection remarks are mandatory and must be at least 10 characters long.");
    }

    const leave = await leaveRequestRepository.findById(leaveId);
    if (!leave) {
      throw new Error("Leave request not found.");
    }

    // 1. Verify team ownership
    const employee = await userRepository.findByEmployeeId(leave.employeeId);
    if (!employee || employee.managerId !== managerId) {
      throw new Error("Access denied. This request does not belong to your team.");
    }

    // 2. Validate pending status
    if (leave.status !== "Pending") {
      throw new Error(`Cannot reject request. Current status is: ${leave.status}`);
    }

    // 3. Update status to Rejected (Store remarks. NO balance deduction occurs!)
    const updated = await leaveRequestRepository.updateStatus(leaveId, "Rejected", {
      reviewer: managerId,
      reviewedAt: new Date(),
      remarks,
    });

    // 4. Create Audit Log
    await auditLogRepository.createLog({
      performedBy: managerId,
      role: "manager",
      action: "LEAVE_REJECTED",
      details: `Rejected Leave request ${leaveId} for employee ${leave.employeeId}. Reason: ${remarks}`,
      ipAddress,
      userAgent,
    });

    // 5. Create Alert Notification
    await notificationRepository.createNotification({
      employeeId: leave.employeeId,
      title: "Leave Request Rejected",
      message: `Your leave request from ${leave.startDate} to ${leave.endDate} was rejected. Remarks: ${remarks}`,
      type: "LeaveApproval",
    });

    return updated;
  }

  /**
   * Retrieves active team leaves within calendar dates range.
   */
  async getTeamCalendar(managerId, start, end) {
    const team = await userRepository.findTeamByManagerId(managerId);
    const teamIds = team.map((u) => u.employeeId);

    if (teamIds.length === 0) {
      return [];
    }

    const leaves = await leaveRequestRepository.findActiveLeavesForCalendar(teamIds, start, end);
    return leaves.map((l) => ({
      id: l.id,
      employeeId: l.employeeId,
      employeeName: l.employeeName,
      leaveType: l.leaveType,
      startDate: l.startDate,
      endDate: l.endDate,
      workingDays: l.workingDays,
      status: l.status,
    }));
  }
}

module.exports = new ManagerService();
