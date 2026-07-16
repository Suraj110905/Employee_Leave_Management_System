const authService = require("../services/authService");

/**
 * Authentication Controller Layer.
 * Directs incoming requests to target business services and outputs standardized JSON responses.
 */
class AuthController {
  /**
   * Logs in a user.
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const data = await authService.loginUser(email, password);

      res.status(200).json({
        success: true,
        message: "Login successful.",
        data,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message || "Invalid authentication credentials.",
        errors: [error.message],
      });
    }
  }

  /**
   * Retrieves active authenticated profile details.
   */
  async getMe(req, res, next) {
    try {
      const data = await authService.verifySession(req.user.employeeId);

      res.status(200).json({
        success: true,
        message: "User session details retrieved successfully.",
        data,
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message || "Failed to verify session profile.",
        errors: [error.message],
      });
    }
  }

  /**
   * Validates active session token check.
   */
  async verify(req, res, next) {
    try {
      // Re-verify session matching token payload details
      const data = await authService.verifySession(req.user.employeeId);

      res.status(200).json({
        success: true,
        message: "Session token remains valid.",
        data: {
          valid: true,
          user: data.user,
        },
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "Token verification failed.",
        errors: [error.message],
      });
    }
  }

  /**
   * Log out active session.
   */
  async logout(req, res, next) {
    try {
      // Placeholder for backend blacklist or cookie clearing logs
      res.status(200).json({
        success: true,
        message: "Logout completed successfully. Session cleared.",
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Changes password.
   */
  async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body;
      await authService.changePassword(req.user.employeeId, currentPassword, newPassword);

      res.status(200).json({
        success: true,
        message: "Security password changed successfully.",
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to update security password.",
        errors: [error.message],
      });
    }
  }
}

module.exports = new AuthController();
