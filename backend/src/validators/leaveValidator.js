/**
 * Leave application requests payload validator.
 */
const validateLeave = (req, res, next) => {
  const { leaveType, startDate, endDate, reason } = req.body;
  const errors = [];

  const allowedTypes = ["Annual", "Sick", "Casual", "Maternity", "Paternity"];
  if (!leaveType) {
    errors.push("Leave type is required.");
  } else if (!allowedTypes.includes(leaveType)) {
    errors.push(`Invalid leave type. Allowed: ${allowedTypes.join(", ")}`);
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!startDate) {
    errors.push("Start date is required.");
  } else if (!dateRegex.test(startDate)) {
    errors.push("Start date must be in YYYY-MM-DD format.");
  }

  if (!endDate) {
    errors.push("End date is required.");
  } else if (!dateRegex.test(endDate)) {
    errors.push("End date must be in YYYY-MM-DD format.");
  }

  if (!reason || reason.trim().length < 10) {
    errors.push("Reason is required and must be at least 10 characters.");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Request validation failed.",
      errors,
    });
  }

  next();
};

module.exports = {
  validateLeave,
};
