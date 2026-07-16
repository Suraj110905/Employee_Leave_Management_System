const Settings = require("../models/Settings");

/**
 * Repository layer isolating database queries for settings configurations.
 */
class SettingsRepository {
  /**
   * Fetch settings configuration document.
   * Automatically initializes defaults if missing.
   *
   * @returns {Promise<object>} Settings Mongoose document.
   */
  async getSettings() {
    let doc = await Settings.findOne({});
    if (!doc) {
      doc = await this.createDefaultSettings();
    }
    return doc;
  }

  /**
   * Initialize default settings in the database.
   *
   * @param {object} [options] - DB options.
   * @returns {Promise<object>} Created document.
   */
  async createDefaultSettings(options = {}) {
    const defaults = {
      companyName: "Acme Corporation Ltd",
      workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      multiLevelApprovals: true,
      emailNotifications: true,
    };
    const doc = new Settings(defaults);
    return doc.save(options);
  }

  /**
   * Update active settings configuration.
   *
   * @param {object} data - Updated settings config fields.
   * @param {object} [options] - DB options.
   * @returns {Promise<object>} Updated settings document.
   */
  async updateSettings(data, options = {}) {
    let doc = await Settings.findOne({});
    if (!doc) {
      doc = new Settings(data);
      return doc.save(options);
    }

    return Settings.findByIdAndUpdate(
      doc._id,
      { $set: data },
      { new: true, runValidators: true, ...options }
    );
  }
}

module.exports = new SettingsRepository();
