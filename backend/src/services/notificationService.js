const Notification = require("../models/Notification");

/**
 * Service orchestrating user alert notifications operations.
 */
class NotificationService {
  /**
   * Retrieves paginated notifications matching employee ID and status filter.
   */
  async getNotifications(employeeId, options = {}) {
    const page = parseInt(options.page, 10) || 1;
    const limit = parseInt(options.limit, 10) || 10;
    const status = options.status; // 'read', 'unread'

    const query = { employeeId };
    if (status === "unread") {
      query.isRead = false;
    } else if (status === "read") {
      query.isRead = true;
    }

    const total = await Notification.countDocuments(query);
    const items = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
      data: items.map((n) => ({
        id: n._id,
        title: n.title,
        message: n.message,
        isRead: n.isRead,
        type: n.type,
        createdAt: n.createdAt,
      })),
      total,
      page,
      limit,
      totalPages,
    };
  }

  /**
   * Mark a single notification alert as read.
   */
  async markRead(id, employeeId) {
    const notification = await Notification.findById(id);
    if (!notification) {
      throw new Error("Notification not found.");
    }

    if (notification.employeeId !== employeeId) {
      throw new Error("Access denied. You do not own this notification.");
    }

    notification.isRead = true;
    return notification.save();
  }

  /**
   * Mark all unread notifications of the employee as read.
   */
  async markAllRead(employeeId) {
    return Notification.updateMany(
      { employeeId, isRead: false },
      { $set: { isRead: true } }
    );
  }

  /**
   * Delete a single notification.
   */
  async deleteNotification(id, employeeId) {
    const notification = await Notification.findById(id);
    if (!notification) {
      throw new Error("Notification not found.");
    }

    if (notification.employeeId !== employeeId) {
      throw new Error("Access denied. You do not own this notification.");
    }

    return Notification.findByIdAndDelete(id);
  }
}

module.exports = new NotificationService();
