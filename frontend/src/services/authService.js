import apiClient from "@/lib/axios";
import { DUMMY_USERS } from "@/data/dummyUser";

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
    // REAL BACKEND INTEGRATION:
    // const response = await apiClient.post("/auth/login", { email, password });
    // return response.data;

    // Simulate API network latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    const emailLower = email.trim().toLowerCase();
    
    // Quick validation check
    if (!emailLower.includes("@")) {
      throw new Error("Invalid email format.");
    }
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters.");
    }

    // Determine target demo role by checking email keywords
    let targetRole = "employee";
    if (emailLower.includes("admin")) {
      targetRole = "hr_admin";
    } else if (emailLower.includes("manager")) {
      targetRole = "manager";
    }

    const mockProfile = DUMMY_USERS[targetRole];
    
    return {
      user: {
        ...mockProfile,
        email: emailLower,
      },
      accessToken: `mock-jwt-token-for-${targetRole}`,
      refreshToken: `mock-refresh-token-for-${targetRole}`,
    };
  },

  /**
   * Restores user profile session from cached access token.
   * @returns {Promise<{user: object}>} User details response.
   */
  getCurrentUser: async () => {
    // REAL BACKEND INTEGRATION:
    // const response = await apiClient.get("/auth/me");
    // return response.data;

    await new Promise((resolve) => setTimeout(resolve, 300));

    // Safely retrieve token from storage to match dynamic role
    const storedToken =
      localStorage.getItem("access_token") ||
      sessionStorage.getItem("access_token");

    if (!storedToken) {
      throw new Error("No active session token found.");
    }

    let role = "employee";
    if (storedToken.includes("hr_admin")) role = "hr_admin";
    if (storedToken.includes("manager")) role = "manager";

    return {
      user: DUMMY_USERS[role],
    };
  },
};

export default authService;
