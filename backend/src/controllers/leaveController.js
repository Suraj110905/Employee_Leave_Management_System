const leaveService = require("../services/leaveService");
const holidayRepository = require("../repositories/holidayRepository");

/**
 * Controller layer directing leave history and requests.
 */
class LeaveController {
  /**
   * Retrieves active leave balances logs.
   */
  async getBalances(req, res, next) {
    try {
      const balances = await leaveService.getBalances(req.user.employeeId);
      res.status(200).json({
        success: true,
        message: "Leave balances retrieved successfully.",
        data: balances,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to retrieve leave balances.",
        errors: [error.message],
      });
    }
  }

  /**
   * Fetch paginated history logs list.
   */
  async getHistory(req, res, next) {
    try {
      const result = await leaveService.getHistory(req.user.employeeId, req.query);
      res.status(200).json({
        success: true,
        message: "Leave history logs retrieved successfully.",
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to retrieve leave history logs.",
        errors: [error.message],
      });
    }
  }

  /**
   * Retrieves detail data for a single leave log by ID.
   */
  async getDetails(req, res, next) {
    try {
      const details = await leaveService.getLeaveDetails(req.params.id, req.user.employeeId);
      res.status(200).json({
        success: true,
        message: "Leave request details retrieved successfully.",
        data: details,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message || "Failed to retrieve leave request details.",
        errors: [error.message],
      });
    }
  }

  /**
   * Submit a new leave request.
   */
  async apply(req, res, next) {
    try {
      const result = await leaveService.applyLeave(req.user.employeeId, req.body);
      res.status(201).json({
        success: true,
        message: "Leave request submitted successfully.",
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to submit leave request.",
        errors: [error.message],
      });
    }
  }

  /**
   * Cancel a pending leave request.
   */
  async cancel(req, res, next) {
    try {
      const updated = await leaveService.cancelLeave(req.params.id, req.user.employeeId);
      res.status(200).json({
        success: true,
        message: `Leave request ${req.params.id} cancelled successfully.`,
        data: {
          id: updated.id,
          employeeId: updated.employeeId,
          employeeName: updated.employeeName,
          leaveType: updated.leaveType,
          startDate: updated.startDate,
          endDate: updated.endDate,
          workingDays: updated.workingDays,
          status: updated.status,
          reason: updated.reason,
          remarks: updated.remarks || "",
          reviewer: updated.reviewer || "",
          appliedAt: updated.createdAt,
        },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to cancel leave request.",
        errors: [error.message],
      });
    }
  }

  /**
   * Fetch all calendar holidays.
   */
  async getHolidays(req, res, next) {
    try {
      const holidays = await holidayRepository.findAll({});
      res.status(200).json({
        success: true,
        message: "Holidays list retrieved successfully.",
        data: holidays,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to retrieve holidays.",
        errors: [error.message],
      });
    }
  }
}

module.exports = new LeaveController();
