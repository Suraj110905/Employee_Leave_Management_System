const Holiday = require("../models/Holiday");

/**
 * Repository layer isolating database queries for Holiday calendars.
 */
class HolidayRepository {
  /**
   * Fetch all holidays matching query.
   *
   * @param {object} query - Query parameters.
   * @returns {Promise<Array>} List of Mongoose documents.
   */
  async findAll(query = {}) {
    return Holiday.find(query).sort({ date: 1 });
  }

  /**
   * Fetch a single holiday record by database ID.
   *
   * @param {string} id - Database ObjectId.
   * @returns {Promise<object|null>} The Mongoose Holiday document.
   */
  async findById(id) {
    return Holiday.findById(id);
  }

  /**
   * Fetch a holiday by its date string.
   *
   * @param {string} date - Date string ('YYYY-MM-DD').
   * @returns {Promise<object|null>} Mongoose document.
   */
  async findByDate(date) {
    return Holiday.findOne({ date });
  }

  /**
   * Create a new holiday calendar event.
   *
   * @param {object} data - Holiday attributes.
   * @param {object} [options] - DB options.
   * @returns {Promise<object>} Created document.
   */
  async create(data, options = {}) {
    const doc = new Holiday(data);
    return doc.save(options);
  }

  /**
   * Update holiday document.
   *
   * @param {string} id - Database ObjectId.
   * @param {object} data - Fields to update.
   * @param {object} [options] - DB options.
   * @returns {Promise<object|null>} Updated Mongoose document.
   */
  async update(id, data, options = {}) {
    return Holiday.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true, ...options }
    );
  }

  /**
   * Delete a holiday by database ID.
   *
   * @param {string} id - Database ObjectId.
   * @param {object} [options] - DB options.
   * @returns {Promise<object|null>} Deleted Mongoose document.
   */
  async delete(id, options = {}) {
    return Holiday.findByIdAndDelete(id, options);
  }
}

module.exports = new HolidayRepository();
