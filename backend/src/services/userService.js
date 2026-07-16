const userRepository = require("../repositories/userRepository");

/**
 * Service handling all employee profile business logic.
 */
class UserService {
  /**
   * Fetch active employee details profile.
   *
   * @param {string} employeeId - Unique employee ID.
   * @returns {Promise<object>} Filtered user details payload.
   */
  async getProfile(employeeId) {
    const user = await userRepository.findByEmployeeId(employeeId);
    if (!user) {
      throw new Error("Employee profile not found.");
    }

    const initials = user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

    // Restrict exposed credentials fields
    return {
      id: user.employeeId,
      employeeId: user.employeeId,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      designation: user.designation,
      phone: user.phone || "",
      emailAlerts: user.emailAlerts ?? true,
      smsAlerts: user.smsAlerts ?? false,
      pushAlerts: user.pushAlerts ?? false,
      avatar: initials,
    };
  }

  /**
   * Update active employee profile settings.
   *
   * @param {string} employeeId - Unique employee ID.
   * @param {object} profileData - Raw parameters update object.
   * @returns {Promise<object>} Filtered updated user settings.
   */
  async updateProfile(employeeId, profileData) {
    const user = await userRepository.findByEmployeeId(employeeId);
    if (!user) {
      throw new Error("Employee profile not found.");
    }

    // Strict validation of allowed keys. Filter roles, designation, managerId.
    const allowedUpdates = {};
    if (profileData.name !== undefined) allowedUpdates.name = profileData.name;
    if (profileData.phone !== undefined) allowedUpdates.phone = profileData.phone;
    if (profileData.emailAlerts !== undefined) allowedUpdates.emailAlerts = !!profileData.emailAlerts;
    if (profileData.smsAlerts !== undefined) allowedUpdates.smsAlerts = !!profileData.smsAlerts;
    if (profileData.pushAlerts !== undefined) allowedUpdates.pushAlerts = !!profileData.pushAlerts;

    const updatedUser = await userRepository.updateProfile(employeeId, allowedUpdates);

    const initials = updatedUser.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

    return {
      id: updatedUser.employeeId,
      employeeId: updatedUser.employeeId,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      department: updatedUser.department,
      designation: updatedUser.designation,
      phone: updatedUser.phone || "",
      emailAlerts: updatedUser.emailAlerts ?? true,
      smsAlerts: updatedUser.smsAlerts ?? false,
      pushAlerts: updatedUser.pushAlerts ?? false,
      avatar: initials,
    };
  }
}

module.exports = new UserService();
