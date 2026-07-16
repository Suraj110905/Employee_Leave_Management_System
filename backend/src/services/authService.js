const bcrypt = require("bcryptjs");
const authRepository = require("../repositories/authRepository");
const { generateToken, generateRefreshToken, expiresInStr } = require("../utils/jwt");

/**
 * Authentication Business Logic Service Layer.
 */
class AuthService {
  /**
   * Log in user credentials.
   * Matches credentials and returns access tokens and user details.
   *
   * @param {string} email - Login email.
   * @param {string} password - Login password.
   * @returns {Promise<object>} Auth payload containing tokens and user data.
   */
  async loginUser(email, password) {
    const user = await authRepository.findByEmail(email);

    if (!user) {
      throw new Error("Invalid email or password credentials.");
    }

    if (!user.isActive) {
      throw new Error("Your account is currently disabled. Please contact HR.");
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new Error("Invalid email or password credentials.");
    }

    // Sign payload claims
    const tokenPayload = {
      sub: user.employeeId,
      email: user.email,
      role: user.role,
    };

    const accessToken = generateToken(tokenPayload);
    const refreshToken = generateRefreshToken({ sub: user.employeeId });

    const initials = user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

    return {
      accessToken,
      refreshToken, // Future refresh token mapping
      expiresIn: expiresInStr,
      tokenType: "Bearer",
      user: {
        id: user.employeeId,
        employeeId: user.employeeId,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        designation: user.designation,
        avatar: initials,
      },
    };
  }

  /**
   * Verify session token and retrieve user profile metadata.
   *
   * @param {string} employeeId - Active employee identification.
   * @returns {Promise<object>} Clean user details payload.
   */
  async verifySession(employeeId) {
    const user = await authRepository.findByEmployeeId(employeeId);

    if (!user || !user.isActive) {
      throw new Error("Active session invalid. User profile not found.");
    }

    const initials = user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

    return {
      user: {
        id: user.employeeId,
        employeeId: user.employeeId,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        designation: user.designation,
        avatar: initials,
      },
    };
  }

  /**
   * Update account security password.
   *
   * @param {string} employeeId - Active employee identification.
   * @param {string} currentPassword - Current password.
   * @param {string} newPassword - New password.
   * @returns {Promise<void>}
   */
  async changePassword(employeeId, currentPassword, newPassword) {
    const user = await authRepository.findByEmployeeId(employeeId);

    if (!user) {
      throw new Error("User profile not found.");
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      throw new Error("Current password entered is incorrect.");
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.passwordHash = hashed;
    await user.save();
  }
}

module.exports = new AuthService();
