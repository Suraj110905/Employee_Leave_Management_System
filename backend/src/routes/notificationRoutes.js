const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const { authenticate } = require("../middleware/auth");
const { validateNotification } = require("../validators/notificationValidator");

/**
 * Generic User Notification Center Routing.
 * Mounted under /api/v1/notifications
 */
router.use(authenticate);

// GET /api/v1/notifications - Fetch unread/read alerts list
router.get("/", validateNotification, (req, res, next) => notificationController.getNotifications(req, res, next));

// PATCH /api/v1/notifications/mark-all - Mark all alerts as read
router.patch("/mark-all", (req, res, next) => notificationController.markAllRead(req, res, next));

// PATCH /api/v1/notifications/:id - Mark single alert as read
router.patch("/:id", (req, res, next) => notificationController.markRead(req, res, next));

// DELETE /api/v1/notifications/:id - Delete single alert
router.delete("/:id", (req, res, next) => notificationController.deleteNotification(req, res, next));

module.exports = router;
