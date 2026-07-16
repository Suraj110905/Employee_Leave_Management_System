/**
 * Spotlight global search validators.
 */
const validateSearch = (req, res, next) => {
  const { q } = req.query;
  const errors = [];

  if (!q || q.trim().length < 2) {
    errors.push("Search query must be at least 2 characters long.");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Query validation failed.",
      errors,
    });
  }

  next();
};

module.exports = {
  validateSearch,
};
