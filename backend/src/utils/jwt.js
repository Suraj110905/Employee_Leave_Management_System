const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwtsecretkeychangeinproduction123!";
const JWT_EXPIRE = process.env.JWT_EXPIRE || "15m";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "supersecretjwtrefreshsecretkeychangeinproduction123!";
const JWT_REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE || "7d";

/**
 * Signs access token containing user metadata details.
 *
 * @param {object} payload - Token user fields claims mapping.
 * @returns {string} Signed JWT.
 */
const generateToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
};

/**
 * Decodes and verifies token authentication signature.
 *
 * @param {string} token - Signed token from client headers.
 * @returns {object} Decoded claims object.
 */
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

/**
 * Placeholder for future Refresh Token generation.
 *
 * @param {object} payload - Token claims.
 * @returns {string} Signed refresh token.
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRE,
  });
};

/**
 * Placeholder for future Refresh Token verification.
 *
 * @param {string} token - Refresh token.
 * @returns {object} Decoded claims.
 */
const verifyRefreshToken = (token) => {
  return jwt.verify(token, JWT_REFRESH_SECRET);
};

module.exports = {
  generateToken,
  verifyToken,
  generateRefreshToken,
  verifyRefreshToken,
  expiresInStr: JWT_EXPIRE,
  refreshExpiresInStr: JWT_REFRESH_EXPIRE,
};
