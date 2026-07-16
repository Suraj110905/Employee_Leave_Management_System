const User = require("../models/User");

/**
 * Repository layer for Authentication Database accesses.
 * Isolates Mongoose queries.
 */
class AuthRepository {
  /**
   * Find user document in database by email address.
   *
   * @param {string} email - Email query.
   * @returns {Promise<object|null>} Mongoose User document or null.
   */
  async findByEmail(email) {
    return User.findOne({ email: email.toLowerCase().trim() });
  }

  /**
   * Find user profile record by employee identifier.
   *
   * @param {string} employeeId - Employee ID.
   * @returns {Promise<object|null>} Mongoose User document or null.
   */
  async findByEmployeeId(employeeId) {
    return User.findOne({ employeeId: employeeId.trim() });
  }
}

module.exports = new AuthRepository();
