import axios from "axios";
import { APP_CONFIG } from "@/config/app.config";
import { getAccessToken } from "@/utils/token";

/**
 * Standard Axios Client Instance configured with API Base URLs.
 */
const apiClient = axios.create({
  baseURL: APP_CONFIG.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// Request Interceptor: Inject JWT token on all outgoing calls
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Standard error parsing & auto logout on 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear corrupt or expired tokens
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("refresh_token");
      
      // Trigger a global custom event to notify AuthContext to clear active session state
      window.dispatchEvent(new CustomEvent("auth-expired"));
    }
    
    // Normalise error outputs for simple components mapping
    const customError = {
      message: error.response?.data?.message || error.message || "An unexpected error occurred",
      status: error.response?.status,
      data: error.response?.data,
    };
    return Promise.reject(customError);
  }
);

export default apiClient;
