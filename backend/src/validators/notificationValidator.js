/**
 * Notification requests query validator.
 */
const validateNotification = (req, res, next) => {
  const { status } = req.query;
  const errors = [];

  const allowedStatuses = ["read", "unread"];
  if (status && !allowedStatuses.includes(status)) {
    errors.push(`Invalid status filter. Allowed: ${allowedStatuses.join(", ")}`);
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
  validateNotification,
};
