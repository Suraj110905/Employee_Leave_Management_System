const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { authenticate, authorize } = require("../middleware/auth");
const {
  validateEmployee,
  validateDept,
  validateLeaveType,
  validateHoliday,
  validateSettings,
} = require("../validators/adminValidator");

/**
 * HR Administrative Actions Router.
 * Mounted under /api/v1/admin
 */
router.use(authenticate);
router.use(authorize("hr_admin"));

// Statistics KPI Widget Counts
router.get("/stats", (req, res, next) => adminController.getStats(req, res, next));

// Employee Directory CRUD
router.get("/employees", (req, res, next) => adminController.getEmployees(req, res, next));
router.get("/employees/:id", (req, res, next) => adminController.getEmployeeById(req, res, next));
router.post("/employees", validateEmployee, (req, res, next) => adminController.createEmployee(req, res, next));
router.put("/employees/:id", validateEmployee, (req, res, next) => adminController.updateEmployee(req, res, next));
router.delete("/employees/:id", (req, res, next) => adminController.softDeleteEmployee(req, res, next));
router.patch("/employees/:id/restore", (req, res, next) => adminController.restoreEmployee(req, res, next));
router.patch("/employees/:id/role", (req, res, next) => adminController.updateRole(req, res, next));

// Corporate Department CRUD
router.get("/departments", (req, res, next) => adminController.getDepartments(req, res, next));
router.post("/departments", validateDept, (req, res, next) => adminController.createDepartment(req, res, next));
router.put("/departments/:id", validateDept, (req, res, next) => adminController.updateDepartment(req, res, next));
router.delete("/departments/:id", (req, res, next) => adminController.deleteDepartment(req, res, next));

// Policy Leave Types CRUD
router.get("/leave-types", (req, res, next) => adminController.getLeaveTypes(req, res, next));
router.post("/leave-types", validateLeaveType, (req, res, next) => adminController.createLeaveType(req, res, next));
router.put("/leave-types/:id", validateLeaveType, (req, res, next) => adminController.updateLeaveType(req, res, next));
router.delete("/leave-types/:id", (req, res, next) => adminController.deleteLeaveType(req, res, next));

// Holiday Calendar Events CRUD
router.get("/holidays", (req, res, next) => adminController.getHolidays(req, res, next));
router.post("/holidays", validateHoliday, (req, res, next) => adminController.createHoliday(req, res, next));
router.put("/holidays/:id", validateHoliday, (req, res, next) => adminController.updateHoliday(req, res, next));
router.delete("/holidays/:id", (req, res, next) => adminController.deleteHoliday(req, res, next));

// Paginated System Audit Logs
router.get("/audits", (req, res, next) => adminController.getAuditLogs(req, res, next));

// Global Settings configurations
router.get("/settings", (req, res, next) => adminController.getSettings(req, res, next));
router.put("/settings", validateSettings, (req, res, next) => adminController.updateSettings(req, res, next));

module.exports = router;
