const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticate } = require("../middleware/auth");
const { validateLogin, validateChangePassword } = require("../validators/authValidator");
const { authLimiter } = require("../config/rateLimit");

/**
 * Authentication Endpoints Routing.
 * Mounted under /api/v1/auth
 */

// POST /api/v1/auth/login - Credentials validation login
router.post("/login", authLimiter, validateLogin, (req, res, next) => authController.login(req, res, next));

// GET /api/v1/auth/me - Retrieve current profile
router.get("/me", authenticate, (req, res, next) => authController.getMe(req, res, next));

// GET /api/v1/auth/verify - Verify session token validity
router.get("/verify", authenticate, (req, res, next) => authController.verify(req, res, next));

// POST /api/v1/auth/logout - Clear user session
router.post("/logout", authenticate, (req, res, next) => authController.logout(req, res, next));

// POST /api/v1/auth/change-password - Update password credentials
router.post("/change-password", authenticate, validateChangePassword, (req, res, next) => authController.changePassword(req, res, next));

module.exports = router;
