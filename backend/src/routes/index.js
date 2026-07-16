const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const leaveRoutes = require("./leaveRoutes");
const managerRoutes = require("./managerRoutes");
const adminRoutes = require("./adminRoutes");
const searchRoutes = require("./searchRoutes");
const reportRoutes = require("./reportRoutes");
const notificationRoutes = require("./notificationRoutes");

/**
 * Mount sub-routes prefixes.
 */
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/leaves", leaveRoutes);
router.use("/manager", managerRoutes);
router.use("/admin/reports", reportRoutes); // Mounted before /admin to prevent parameter conflict masking
router.use("/admin", adminRoutes);
router.use("/search", searchRoutes);
router.use("/notifications", notificationRoutes);

/**
 * Health check endpoint.
 * Confirms API foundation is active.
 */
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Employee Leave Management System API active",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});


module.exports = router;
