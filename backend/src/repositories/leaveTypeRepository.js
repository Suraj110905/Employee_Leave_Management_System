const LeaveType = require("../models/LeaveType");

/**
 * Repository layer isolating database queries for Leave Types.
 */
class LeaveTypeRepository {
  /**
   * Fetch all leave types matching query.
   *
   * @param {object} query - Query parameters.
   * @returns {Promise<Array>} List of Mongoose documents.
   */
  async findAll(query = {}) {
    return LeaveType.find(query);
  }

  /**
   * Fetch a single leave type record by database ID.
   *
   * @param {string} id - Database ObjectId.
   * @returns {Promise<object|null>} The Mongoose LeaveType document.
   */
  async findById(id) {
    return LeaveType.findById(id);
  }

  /**
   * Fetch a leave type by its type name.
   *
   * @param {string} type - Policy category name.
   * @returns {Promise<object|null>} Mongoose document.
   */
  async findByType(type) {
    return LeaveType.findOne({ type: new RegExp(`^${type.trim()}$`, "i") });
  }

  /**
   * Create a new leave type policy.
   *
   * @param {object} data - Policy parameters.
   * @param {object} [options] - DB options.
   * @returns {Promise<object>} Created document.
   */
  async create(data, options = {}) {
    const doc = new LeaveType(data);
    return doc.save(options);
  }

  /**
   * Update leave type policy document.
   *
   * @param {string} id - Database ObjectId.
   * @param {object} data - Fields to update.
   * @param {object} [options] - DB options.
   * @returns {Promise<object|null>} Updated Mongoose document.
   */
  async update(id, data, options = {}) {
    return LeaveType.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true, ...options }
    );
  }

  /**
   * Delete leave type by database ID.
   *
   * @param {string} id - Database ObjectId.
   * @param {object} [options] - DB options.
   * @returns {Promise<object|null>} Deleted Mongoose document.
   */
  async delete(id, options = {}) {
    return LeaveType.findByIdAndDelete(id, options);
  }
}

module.exports = new LeaveTypeRepository();
