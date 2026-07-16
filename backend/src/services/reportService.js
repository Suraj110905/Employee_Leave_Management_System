const LeaveRequest = require("../models/LeaveRequest");
const User = require("../models/User");
const Department = require("../models/Department");
const LeaveBalance = require("../models/LeaveBalance");

/**
 * Service orchestrating utilization reporting datasets.
 */
class ReportService {
  /**
   * Compiles leave request history reports data.
   */
  async getLeavesReport(options = {}) {
    const page = parseInt(options.page, 10) || 1;
    const limit = parseInt(options.limit, 10) || 10;
    const query = {};

    if (options.status) {
      query.status = new RegExp(`^${options.status.trim()}$`, "i");
    }

    const total = await LeaveRequest.countDocuments(query);
    const items = await LeaveRequest.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
      data: items.map((l) => ({
        id: l.id,
        employeeName: l.employeeName,
        leaveType: l.leaveType,
        startDate: l.startDate,
        endDate: l.endDate,
        workingDays: l.workingDays,
        status: l.status,
        reviewer: l.reviewer || "N/A",
        reviewedAt: l.reviewedAt || null,
        remarks: l.remarks || "",
        appliedAt: l.createdAt,
      })),
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Compiles employee directory leave balances utilization reports.
   */
  async getEmployeesReport(options = {}) {
    const page = parseInt(options.page, 10) || 1;
    const limit = parseInt(options.limit, 10) || 10;

    const total = await User.countDocuments({ isActive: true });
    const employees = await User.find({ isActive: true })
      .skip((page - 1) * limit)
      .limit(limit);

    const employeeIds = employees.map((e) => e.employeeId);
    const balances = await LeaveBalance.find({ employeeId: { $in: employeeIds } });

    const data = employees.map((e) => {
      const balanceRecord = balances.find((b) => b.employeeId === e.employeeId);
      
      const annualBal = balanceRecord?.balances.find((b) => b.type === "Annual") || { total: 0, used: 0, available: 0 };
      const sickBal = balanceRecord?.balances.find((b) => b.type === "Sick") || { total: 0, used: 0, available: 0 };

      return {
        employeeId: e.employeeId,
        name: e.name,
        email: e.email,
        department: e.department,
        designation: e.designation,
        annualTotal: annualBal.total,
        annualAvailable: annualBal.available,
        annualUsed: annualBal.used,
        sickTotal: sickBal.total,
        sickAvailable: sickBal.available,
        sickUsed: sickBal.used,
      };
    });

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Compiles department utilization and headcount logs.
   */
  async getDepartmentsReport(options = {}) {
    const page = parseInt(options.page, 10) || 1;
    const limit = parseInt(options.limit, 10) || 10;

    const total = await Department.countDocuments({});
    const items = await Department.find({})
      .skip((page - 1) * limit)
      .limit(limit);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
      data: items.map((d) => ({
        id: d._id,
        name: d.name,
        managerId: d.managerId || "Unassigned",
        headcount: d.headcount || 0,
      })),
      total,
      page,
      limit,
      totalPages,
    };
  }
}

module.exports = new ReportService();
