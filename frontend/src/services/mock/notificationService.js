import apiClient from "@/lib/axios";

/**
 * Service Layer calling Express API Notifications operations.
 */
export const notificationService = {
  /**
   * Fetches unread or all notifications lists for the authenticated user.
   */
  getNotifications: async (options = {}) => {
    const params = {
      page: options.page || 1,
      limit: options.limit || 50,
      status: options.status, // "read" or "unread"
    };

    const response = await apiClient.get("/notifications", { params });
    const result = response.data.data;

    return {
      data: (result.data || []).map((n) => ({
        id: n.id || n._id,
        title: n.title,
        message: n.message,
        type: n.type || "info",
        status: n.status || "unread",
        createdAt: n.createdAt,
      })),
      total: result.total || 0,
      page: result.page || 1,
      limit: result.limit || 50,
      totalPages: result.totalPages || 1,
    };
  },

  /**
   * Marks a specific notification as read.
   */
  markAsRead: async (id) => {
    const response = await apiClient.patch(`/notifications/${id}`);
    return response.data.data;
  },

  /**
   * Marks all notifications as read.
   */
  markAllAsRead: async () => {
    const response = await apiClient.patch("/notifications/mark-all");
    return response.data.data;
  },

  /**
   * Deletes a specific notification.
   */
  deleteNotification: async (id) => {
    await apiClient.delete(`/notifications/${id}`);
    return true;
  },
};

export default notificationService;
