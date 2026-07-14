const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

/**
 * Reads the current access token from either localStorage or sessionStorage.
 * @returns {string|null} Access token if present, otherwise null.
 */
export const getAccessToken = () => {
  return (
    localStorage.getItem(ACCESS_TOKEN_KEY) ||
    sessionStorage.getItem(ACCESS_TOKEN_KEY)
  );
};

/**
 * Reads the current refresh token from either localStorage or sessionStorage.
 * @returns {string|null} Refresh token if present, otherwise null.
 */
export const getRefreshToken = () => {
  return (
    localStorage.getItem(REFRESH_TOKEN_KEY) ||
    sessionStorage.getItem(REFRESH_TOKEN_KEY)
  );
};

/**
 * Saves both tokens. Respects the rememberMe toggle to choose localStorage vs sessionStorage.
 * @param {string} accessToken Access token.
 * @param {string} [refreshToken] Optional refresh token.
 * @param {boolean} [rememberMe=false] If true, persists session across browser closing.
 */
export const setTokens = (accessToken, refreshToken = "", rememberMe = false) => {
  // Always clear previous locations to avoid duplicate stale tokens
  clearTokens();

  const storage = rememberMe ? localStorage : sessionStorage;
  
  if (accessToken) {
    storage.setItem(ACCESS_TOKEN_KEY, accessToken);
  }
  if (refreshToken) {
    storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

/**
 * Removes all authentication tokens from both localStorage and sessionStorage.
 */
export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
};
