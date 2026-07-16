const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const { authenticate, authorize } = require("../middleware/auth");

/**
 * HR Admin Reports compiler router.
 * Mounted under /api/v1/admin/reports
 */
router.use(authenticate);
router.use(authorize("hr_admin"));

router.get("/leaves", (req, res, next) => reportController.getLeavesReport(req, res, next));
router.get("/employees", (req, res, next) => reportController.getEmployeesReport(req, res, next));
router.get("/departments", (req, res, next) => reportController.getDepartmentsReport(req, res, next));

module.exports = router;
