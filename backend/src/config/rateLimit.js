const rateLimit = require("express-rate-limit");
const logger = require("./logger");

const isDev = process.env.NODE_ENV !== "production";

/**
 * Global API rate limiting configuration.
 * Restricts client request speed to defend against DDoS attacks.
 * In development mode, the limiter is disabled to prevent blocking local testing.
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: isDev ? 999999 : 1000,    // High limit in development to prevent blocking
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => isDev || req.ip === "::1" || req.ip === "127.0.0.1" || req.ip.includes("127.0.0.1") || req.ip.includes("::1"),
  message: {
    success: false,
    error: "Too many requests dispatched from this IP address. Please try again after 15 minutes.",
  },
  handler: (req, res, next, options) => {
    logger.warn(`Rate limit triggered: ${req.ip} tried accessing ${req.originalUrl}`);
    res.status(options.statusCode).json(options.message);
  },
});

/**
 * Authentication specific rate limiter.
 * Tighter constraints on credentials checking routes.
 * In development mode, the limiter is disabled to prevent blocking login testing.
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: isDev ? 999999 : 100,     // High limit in development to prevent blocking
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => isDev || req.ip === "::1" || req.ip === "127.0.0.1" || req.ip.includes("127.0.0.1") || req.ip.includes("::1"),
  message: {
    success: false,
    error: "Brute-force safeguard active. Too many login attempts. Please retry after 15 minutes.",
  },
  handler: (req, res, next, options) => {
    logger.warn(`Auth rate limit triggered: ${req.ip} attempting login`);
    res.status(options.statusCode).json(options.message);
  },
});

module.exports = {
  apiLimiter,
  authLimiter,
};
