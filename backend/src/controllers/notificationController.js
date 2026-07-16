const notificationService = require("../services/notificationService");

/**
 * Controller orchestrating generic user alert notifications.
 */
class NotificationController {
  async getNotifications(req, res, next) {
    try {
      const result = await notificationService.getNotifications(req.user.employeeId, req.query);
      res.status(200).json({
        success: true,
        message: "Notifications list fetched successfully.",
        data: result,
      });
    } catch (e) {
      next(e);
    }
  }

  async markRead(req, res, next) {
    try {
      const updated = await notificationService.markRead(req.params.id, req.user.employeeId);
      res.status(200).json({
        success: true,
        message: "Notification marked as read successfully.",
        data: updated,
      });
    } catch (e) {
      res.status(400).json({
        success: false,
        message: e.message,
        errors: [e.message],
      });
    }
  }

  async markAllRead(req, res, next) {
    try {
      await notificationService.markAllRead(req.user.employeeId);
      res.status(200).json({
        success: true,
        message: "All notifications marked as read.",
      });
    } catch (e) {
      next(e);
    }
  }

  async deleteNotification(req, res, next) {
    try {
      await notificationService.deleteNotification(req.params.id, req.user.employeeId);
      res.status(200).json({
        success: true,
        message: "Notification deleted successfully.",
      });
    } catch (e) {
      res.status(400).json({
        success: false,
        message: e.message,
        errors: [e.message],
      });
    }
  }
}

module.exports = new NotificationController();
