const Department = require("../models/Department");

/**
 * Repository layer isolating database queries for Departments.
 */
class DepartmentRepository {
  /**
   * Fetch all department documents matching query.
   *
   * @param {object} query - Query parameters.
   * @returns {Promise<Array>} List of Mongoose documents.
   */
  async findAll(query = {}) {
    return Department.find(query);
  }

  /**
   * Fetch a single department record by database ID or custom identifier.
   *
   * @param {string} id - The ID identifier.
   * @returns {Promise<object|null>} The Mongoose Department document.
   */
  async findById(id) {
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      return Department.findById(id);
    }
    return Department.findOne({ name: id });
  }

  /**
   * Fetch a department by its unique name.
   *
   * @param {string} name - Department name.
   * @returns {Promise<object|null>} Mongoose document.
   */
  async findByName(name) {
    return Department.findOne({ name: new RegExp(`^${name.trim()}$`, "i") });
  }

  /**
   * Create a new department document.
   *
   * @param {object} deptData - Department fields.
   * @param {object} [options] - DB options (e.g. session transaction).
   * @returns {Promise<object>} Created document.
   */
  async create(deptData, options = {}) {
    const doc = new Department(deptData);
    return doc.save(options);
  }

  /**
   * Update department document.
   *
   * @param {string} id - Database ObjectId.
   * @param {object} data - Fields to update.
   * @param {object} [options] - DB options.
   * @returns {Promise<object|null>} Updated Mongoose document.
   */
  async update(id, data, options = {}) {
    return Department.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true, ...options }
    );
  }

  /**
   * Delete a department by database ID.
   *
   * @param {string} id - Database ObjectId.
   * @param {object} [options] - DB options.
   * @returns {Promise<object|null>} Deleted Mongoose document.
   */
  async delete(id, options = {}) {
    return Department.findByIdAndDelete(id, options);
  }
}

module.exports = new DepartmentRepository();
