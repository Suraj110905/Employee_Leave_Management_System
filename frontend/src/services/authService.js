import apiClient from "@/lib/axios";

/**
 * Service handling all authentication requests.
 * Structured cleanly to easily swap simulated mocks with actual Axios backend calls.
 */
export const authService = {
  /**
   * Logs in a user.
   * @param {string} email User email.
   * @param {string} password User password.
   * @returns {Promise<{user: object, accessToken: string, refreshToken: string}>} Response payload.
   */
  login: async (email, password) => {
    const response = await apiClient.post("/auth/login", { email, password });
    return response.data.data;
  },

  /**
   * Restores user profile session from cached access token.
   * @returns {Promise<{user: object}>} User details response.
   */
  getCurrentUser: async () => {
    const response = await apiClient.get("/auth/me");
    return response.data.data;
  },

  /**
   * Update profile fields of the currently logged-in user.
   */
  updateProfile: async (profileData) => {
    const response = await apiClient.put("/users/me", profileData);
    const user = response.data.data;
    const initials = user.name.split(" ").map((n) => n[0]).join("").toUpperCase();
    return {
      user: {
        id: user.employeeId,
        employeeId: user.employeeId,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        designation: user.designation,
        phone: user.phone || "",
        emailAlerts: user.emailAlerts ?? true,
        smsAlerts: user.smsAlerts ?? false,
        pushAlerts: user.pushAlerts ?? true,
        avatar: initials,
      }
    };
  },

  /**
   * Change user security password credentials.
   */
  changePassword: async (currentPassword, newPassword) => {
    const response = await apiClient.post("/auth/change-password", { currentPassword, newPassword });
    return response.data;
  },
};

export default authService;
