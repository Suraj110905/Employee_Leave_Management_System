const express = require("express");
const router = express.Router();
const managerController = require("../controllers/managerController");
const { authenticate, authorize } = require("../middleware/auth");
const { validateApproval, validateRejection, validateCalendar } = require("../validators/managerValidator");

/**
 * Manager Actions Routing.
 * Mounted under /api/v1/manager
 */

// Restrict all routes to manager or hr_admin roles
router.use(authenticate);
router.use(authorize("manager", "hr_admin"));

// GET /api/v1/manager/dashboard - Metrics
router.get("/dashboard", (req, res, next) => managerController.getDashboard(req, res, next));

// GET /api/v1/manager/leave-requests - List team leave history
router.get("/leave-requests", (req, res, next) => managerController.getApprovals(req, res, next));

// GET /api/v1/manager/leave-requests/:id - Fetch details
router.get("/leave-requests/:id", (req, res, next) => managerController.getApprovalDetails(req, res, next));

// PATCH /api/v1/manager/leave-requests/:id/approve - Approve request
router.patch("/leave-requests/:id/approve", validateApproval, (req, res, next) => managerController.approve(req, res, next));

// PATCH /api/v1/manager/leave-requests/:id/reject - Reject request
router.patch("/leave-requests/:id/reject", validateRejection, (req, res, next) => managerController.reject(req, res, next));

// GET /api/v1/manager/team - Fetch direct reports roster
router.get("/team", (req, res, next) => managerController.getTeam(req, res, next));

// GET /api/v1/manager/calendar - Fetch team active calendar
router.get("/calendar", validateCalendar, (req, res, next) => managerController.getCalendar(req, res, next));

module.exports = router;
