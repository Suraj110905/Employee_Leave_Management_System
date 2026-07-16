const User = require("../models/User");

/**
 * Repository layer for isolating User-related database operations.
 */
class UserRepository {
  /**
   * Fetch a user profile document by employee ID.
   *
   * @param {string} employeeId - The unique employee ID.
   * @returns {Promise<object|null>} The Mongoose User document or null.
   */
  async findByEmployeeId(employeeId) {
    return User.findOne({ employeeId });
  }

  /**
   * Update allowed profile settings for an employee.
   *
   * @param {string} employeeId - The unique employee ID.
   * @param {object} updateData - Sanatized data fields to update.
   * @returns {Promise<object|null>} The updated Mongoose User document.
   */
  async updateProfile(employeeId, updateData, options = {}) {
    return User.findOneAndUpdate(
      { employeeId },
      { $set: updateData },
      { new: true, runValidators: true, ...options }
    );
  }

  /**
   * Fetch all employees assigned to a specific manager.
   *
   * @param {string} managerId - The manager's employee ID.
   * @param {object} options - Search configurations.
   * @returns {Promise<Array>} List of user profiles.
   */
  async findTeamByManagerId(managerId, options = {}) {
    const { search } = options;
    const query = { managerId, isActive: true };

    if (search && search.trim()) {
      query.name = { $regex: search.trim(), $options: "i" };
    }

    return User.find(query);
  }

  /**
   * Find a user profile record by email address.
   */
  async findByEmail(email) {
    return User.findOne({ email: email.toLowerCase().trim() });
  }

  /**
   * Create a new user profile document.
   */
  async create(userData, options = {}) {
    const doc = new User(userData);
    return doc.save(options);
  }

  /**
   * List paginated user profile records matching query.
   */
  async findPaginated(query, pagination = {}) {
    const { page = 1, limit = 10, sortBy = "employeeId", sortOrder = "asc" } = pagination;
    const total = await User.countDocuments(query);
    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    const items = await User.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      items,
      total,
    };
  }
}

module.exports = new UserRepository();
