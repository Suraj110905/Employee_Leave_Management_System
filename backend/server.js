const app = require("./src/app");
const connectDB = require("./src/config/db");
const logger = require("./src/config/logger");

const PORT = process.env.PORT || 5000;

// Initialize Database connection
connectDB();

// Bind port and start listening
const server = app.listen(PORT, () => {
  logger.info(`Server launched successfully in ${process.env.NODE_ENV || "development"} mode on port: ${PORT}`);
});

// Safeguard against unhandled Promise rejections
process.on("unhandledRejection", (err) => {
  logger.error(`CRITICAL: Unhandled Promise Rejection: ${err.message}`);
  if (err.stack) {
    logger.error(err.stack);
  }
  // Graceful shutdown on database or connection failures
  server.close(() => {
    process.exit(1);
  });
});

// Safeguard against uncaught runtime exceptions
process.on("uncaughtException", (err) => {
  logger.error(`CRITICAL: Uncaught Runtime Exception: ${err.message}`);
  if (err.stack) {
    logger.error(err.stack);
  }
  // Immediately crash to let cluster managers orchestrate restarts
  process.exit(1);
});

// Graceful shutdown on SIGTERM (sent by Render/Railway on deploy)
process.on("SIGTERM", () => {
  logger.info("SIGTERM signal received. Gracefully shutting down...");
  server.close(() => {
    logger.info("HTTP server closed. Exiting process.");
    process.exit(0);
  });
});
