const express = require("express");
const router = express.Router();
const searchController = require("../controllers/searchController");
const { authenticate } = require("../middleware/auth");
const { validateSearch } = require("../validators/searchValidator");

/**
 * Global Spotlight Search Router.
 * Mounted under /api/v1/search
 */
router.get("/", authenticate, validateSearch, (req, res, next) => searchController.search(req, res, next));

module.exports = router;
