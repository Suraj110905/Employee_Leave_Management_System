const logger = require("../config/logger");

/**
 * Centralized error handling middleware.
 * Formats errors and logs them to console & Winston files standard format.
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log raw trace details for inspection
  logger.error(`${err.name || "Error"}: ${err.message} - ${req.method} ${req.originalUrl} - IP: ${req.ip}`);

  // Mongoose validation errors format
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      error: message.join(", "),
    });
  }

  // Mongoose cast errors (invalid ObjectId mapping)
  if (err.name === "CastError") {
    return res.status(404).json({
      success: false,
      error: `Resource not found with identifier id of: ${err.value}`,
    });
  }

  // Mongoose duplicate key error (code 11000)
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      error: "Resource already exists in database with unique attributes.",
    });
  }

  // Default server crash error fallback — mask internals in production
  const isProduction = process.env.NODE_ENV === "production";
  res.status(error.statusCode || 500).json({
    success: false,
    error: isProduction && (!error.statusCode || error.statusCode >= 500)
      ? "An unexpected error occurred. Please try again later."
      : error.message || "Internal server process error occurred.",
  });
};

module.exports = errorHandler;
