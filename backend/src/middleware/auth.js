const { verifyToken } = require("../utils/jwt");
const logger = require("../config/logger");

/**
 * Authentication check middleware.
 * Intercepts Bearer header tokens and decodes security claims.
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logger.warn(`Access blocked: Missing auth headers from IP ${req.ip}`);
    return res.status(401).json({
      success: false,
      message: "Access denied. Authentication token missing.",
      errors: ["Missing Authorization header with Bearer token schema."],
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    // Attach user payload claims to request context
    req.user = {
      id: decoded.sub,
      employeeId: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (error) {
    logger.warn(`Access blocked: Expired or corrupt token from IP ${req.ip}. Error: ${error.message}`);
    return res.status(401).json({
      success: false,
      message: "Session expired or invalid token. Please log in again.",
      errors: [error.message],
    });
  }
};

/**
 * Role authorization checks middleware filter.
 * Restricts access to matching permissions.
 *
 * @param {...string} roles - Permitted user security roles list.
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      logger.warn(`Forbidden access attempt: User ${req.user?.id || "unknown"} with role [${req.user?.role || "none"}] accessing route requiring [${roles.join(", ")}]`);
      return res.status(403).json({
        success: false,
        message: "Access forbidden. Insufficient privileges.",
        errors: [`Your role permissions do not allow executing this action. Required: ${roles.join(" or ")}`],
      });
    }
    next();
  };
};

module.exports = {
  authenticate,
  authorize,
};
