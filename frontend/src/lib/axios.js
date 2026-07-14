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

// Response Interceptor: Standard error parsing
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
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
