const reportService = require("../services/reportService");

/**
 * Controller orchestrating HR utilization reporting statistics.
 */
class ReportController {
  async getLeavesReport(req, res, next) {
    try {
      const data = await reportService.getLeavesReport(req.query);
      res.status(200).json({
        success: true,
        message: "Leaves utilization report compiled.",
        data,
      });
    } catch (e) {
      next(e);
    }
  }

  async getEmployeesReport(req, res, next) {
    try {
      const data = await reportService.getEmployeesReport(req.query);
      res.status(200).json({
        success: true,
        message: "Employee utilization report compiled.",
        data,
      });
    } catch (e) {
      next(e);
    }
  }

  async getDepartmentsReport(req, res, next) {
    try {
      const data = await reportService.getDepartmentsReport(req.query);
      res.status(200).json({
        success: true,
        message: "Department utilization report compiled.",
        data,
      });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new ReportController();
