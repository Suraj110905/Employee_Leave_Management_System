const managerService = require("../services/managerService");

/**
 * Controller layer directing incoming manager dashboard and approvals requests.
 */
class ManagerController {
  /**
   * Fetch team statistics metrics.
   */
  async getDashboard(req, res, next) {
    try {
      const stats = await managerService.getDashboardStats(req.user.employeeId);
      res.status(200).json({
        success: true,
        message: "Dashboard statistics retrieved successfully.",
        data: stats,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to retrieve dashboard statistics.",
        errors: [error.message],
      });
    }
  }

  /**
   * List leave history requests for the manager's team.
   */
  async getApprovals(req, res, next) {
    try {
      const result = await managerService.getApprovals(req.user.employeeId, req.query);
      res.status(200).json({
        success: true,
        message: "Approvals queue retrieved successfully.",
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to retrieve approvals queue.",
        errors: [error.message],
      });
    }
  }

  /**
   * Fetch detail data for a single team request.
   */
  async getApprovalDetails(req, res, next) {
    try {
      const details = await managerService.getApprovalDetails(req.params.id, req.user.employeeId);
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
   * Approve a pending leave request, update statuses, and deduct available balances.
   */
  async approve(req, res, next) {
    try {
      const result = await managerService.approveLeave(
        req.params.id,
        req.user.employeeId,
        req.body.remarks,
        req.ip,
        req.headers["user-agent"]
      );

      res.status(200).json({
        success: true,
        message: `Leave request ${req.params.id} has been approved successfully.`,
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to approve leave request.",
        errors: [error.message],
      });
    }
  }

  /**
   * Rejects a pending leave request with comments.
   */
  async reject(req, res, next) {
    try {
      const result = await managerService.rejectLeave(
        req.params.id,
        req.user.employeeId,
        req.body.remarks,
        req.ip,
        req.headers["user-agent"]
      );

      res.status(200).json({
        success: true,
        message: `Leave request ${req.params.id} has been rejected.`,
        data: result,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to reject leave request.",
        errors: [error.message],
      });
    }
  }

  /**
   * Fetch team members roster assigned to manager.
   */
  async getTeam(req, res, next) {
    try {
      const team = await managerService.getTeam(req.user.employeeId, req.query);
      res.status(200).json({
        success: true,
        message: "Team roster retrieved successfully.",
        data: team,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to retrieve team roster.",
        errors: [error.message],
      });
    }
  }

  /**
   * List approved team leaves for calendar display.
   */
  async getCalendar(req, res, next) {
    try {
      const events = await managerService.getTeamCalendar(
        req.user.employeeId,
        req.query.startDate,
        req.query.endDate
      );

      res.status(200).json({
        success: true,
        message: "Team calendar events retrieved successfully.",
        data: events,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to retrieve team calendar events.",
        errors: [error.message],
      });
    }
  }
}

module.exports = new ManagerController();
