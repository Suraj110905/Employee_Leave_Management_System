const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticate } = require("../middleware/auth");
const { validateProfile } = require("../validators/userValidator");

/**
 * User Profile Routing.
 * Mounted under /api/v1/users
 */

// GET /api/v1/users/me - Fetch profile
router.get("/me", authenticate, (req, res, next) => userController.getMe(req, res, next));

// PUT /api/v1/users/me - Update settings
router.put("/me", authenticate, validateProfile, (req, res, next) => userController.updateMe(req, res, next));

module.exports = router;
