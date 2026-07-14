import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "@/services/authService";
import { getAccessToken, setTokens, clearTokens } from "@/utils/token";

const AuthContext = createContext(null);

/**
 * Custom hook to consume authentication contexts anywhere in the DOM tree.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be consumed within an AuthProvider");
  }
  return context;
};

/**
 * Context Provider wrapping the App layout and managing active user sessions.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize: restore cached sessions on page reloads/initial loads
  useEffect(() => {
    const initializeAuth = async () => {
      const token = getAccessToken();
      if (token) {
        try {
          const data = await authService.getCurrentUser();
          setUser(data.user);
        } catch (err) {
          // Clear corrupt or expired tokens
          clearTokens();
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  /**
   * Performs user login verification.
   * @param {string} email User email.
   * @param {string} password User password.
   * @param {boolean} [rememberMe=false] persist tokens or session-only.
   * @returns {Promise<object>} Authenticated user profile.
   */
  const login = async (email, password, rememberMe = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(email, password);
      // Persist access & refresh tokens mapping Storage Spaces
      setTokens(data.accessToken, data.refreshToken, rememberMe);
      setUser(data.user);
      setLoading(false);
      return data.user;
    } catch (err) {
      const errMsg = err?.message || "Failed to log in. Please check credentials.";
      setError(errMsg);
      setLoading(false);
      throw new Error(errMsg);
    }
  };

  /**
   * Resets session state variables and clears tokens.
   */
  const logout = () => {
    clearTokens();
    setUser(null);
    setError(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
