/**
 * Manager actions request parameters validator.
 */

/**
 * Validates approval request payload comments.
 */
const validateApproval = (req, res, next) => {
  const { remarks } = req.body;
  const errors = [];

  if (remarks !== undefined) {
    if (typeof remarks !== "string") {
      errors.push("Remarks must be a valid text string.");
    } else if (remarks.length > 200) {
      errors.push("Remarks cannot exceed 200 characters.");
    }
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

/**
 * Validates rejection request payload (remarks is mandatory).
 */
const validateRejection = (req, res, next) => {
  const { remarks } = req.body;
  const errors = [];

  if (!remarks || typeof remarks !== "string" || remarks.trim().length < 10) {
    errors.push("Remarks is mandatory and must be at least 10 characters.");
  } else if (remarks.length > 200) {
    errors.push("Remarks cannot exceed 200 characters.");
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

/**
 * Validates calendar date parameters checks.
 */
const validateCalendar = (req, res, next) => {
  const { startDate, endDate } = req.query;
  const errors = [];
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!startDate) {
    errors.push("Query parameter [startDate] is required.");
  } else if (!dateRegex.test(startDate)) {
    errors.push("Query parameter [startDate] must be in YYYY-MM-DD format.");
  }

  if (!endDate) {
    errors.push("Query parameter [endDate] is required.");
  } else if (!dateRegex.test(endDate)) {
    errors.push("Query parameter [endDate] must be in YYYY-MM-DD format.");
  }

  if (startDate && endDate && startDate > endDate) {
    errors.push("Query parameter [startDate] cannot fall after [endDate].");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Query parameters validation failed.",
      errors,
    });
  }

  next();
};

module.exports = {
  validateApproval,
  validateRejection,
  validateCalendar,
};
