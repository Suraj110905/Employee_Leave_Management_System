const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const dotenv = require("dotenv");
const path = require("path");

// Load environment configurations from .env
dotenv.config();

const logger = require("./config/logger");
const { apiLimiter } = require("./config/rateLimit");
const errorHandler = require("./middleware/error");
const routes = require("./routes");

const app = express();

// Secure Express headers
app.use(helmet());

// Enable Gzip compression on JSON payloads
app.use(compression());

// Handle Cross-Origin resource requests
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
app.use(
  cors({
    origin: clientUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body Parser middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP logging streams integrated with Winston transports
const morganFormat = process.env.NODE_ENV === "production" ? "combined" : "dev";
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

// General requests rate limiting parameters configuration
app.use("/api", apiLimiter);

// Bind main routing points
app.use("/api/v1", routes);

// 404 handler for unmatched routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: `Invalid resource destination mapping - Endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized error mapping catch-all
app.use(errorHandler);

module.exports = app;
