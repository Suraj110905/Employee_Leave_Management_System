const userService = require("../services/userService");

/**
 * Controller layer directing incoming profile requests.
 */
class UserController {
  /**
   * Retrieves active authenticated profile details.
   */
  async getMe(req, res, next) {
    try {
      const profile = await userService.getProfile(req.user.employeeId);
      res.status(200).json({
        success: true,
        message: "Profile details retrieved successfully.",
        data: profile,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message || "Failed to retrieve profile details.",
        errors: [error.message],
      });
    }
  }

  /**
   * Updates allowed settings of the active user profile.
   */
  async updateMe(req, res, next) {
    try {
      const updated = await userService.updateProfile(req.user.employeeId, req.body);
      res.status(200).json({
        success: true,
        message: "Profile details updated successfully.",
        data: updated,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to update profile details.",
        errors: [error.message],
      });
    }
  }
}

module.exports = new UserController();
