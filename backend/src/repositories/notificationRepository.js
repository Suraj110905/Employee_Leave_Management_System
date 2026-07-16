const Notification = require("../models/Notification");

/**
 * Repository layer isolating database operations for user alert notifications.
 */
class NotificationRepository {
  /**
   * Create a new user alert notification.
   *
   * @param {object} data - Notification fields payload (employeeId, title, message, type).
   * @returns {Promise<object>} Created Notification Mongoose document.
   */
  async createNotification(data) {
    return Notification.create(data);
  }
}

module.exports = new NotificationRepository();
