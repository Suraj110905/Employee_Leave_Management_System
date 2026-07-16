const express = require("express");
const router = express.Router();
const leaveController = require("../controllers/leaveController");
const { authenticate } = require("../middleware/auth");
const { validateLeave } = require("../validators/leaveValidator");

/**
 * Leave Request Routing.
 * Mounted under /api/v1/leaves
 */

// GET /api/v1/leaves/balances - Fetch limits
router.get("/balances", authenticate, (req, res, next) => leaveController.getBalances(req, res, next));

// GET /api/v1/leaves - Get history list (supports query filters)
router.get("/", authenticate, (req, res, next) => leaveController.getHistory(req, res, next));

// POST /api/v1/leaves - Submit leave application
router.post("/", authenticate, validateLeave, (req, res, next) => leaveController.apply(req, res, next));

// GET /api/v1/leaves/:id - Fetch request details
router.get("/:id", authenticate, (req, res, next) => leaveController.getDetails(req, res, next));

// GET /api/v1/leaves/holidays - Fetch active holiday calendar events
router.get("/holidays/list", authenticate, (req, res, next) => leaveController.getHolidays(req, res, next));

// PATCH /api/v1/leaves/:id/cancel - Withdraw request
router.patch("/:id/cancel", authenticate, (req, res, next) => leaveController.cancel(req, res, next));

module.exports = router;
