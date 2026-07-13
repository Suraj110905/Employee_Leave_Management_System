/**
 * Global Application Configuration.
 * Centralizes build-time properties, URLs, and state flags.
 */
export const APP_CONFIG = {
  appName: "LeavePortal",
  appLongName: "Employee Leave Management System",
  version: "1.0.0",
  apiBaseUrl: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  environment: import.meta.env.MODE || "development",
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};

export default APP_CONFIG;
