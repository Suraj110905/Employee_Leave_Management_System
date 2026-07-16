const mongoose = require("mongoose");
const logger = require("./logger");

/**
 * Connect to MongoDB Database using Mongoose.
 * Centralizes database lifecycle hooks.
 *
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || "mongodb://localhost:27017/employee-leave-system";
    
    mongoose.connection.on("connecting", () => {
      logger.info("Connecting to database server...");
    });

    mongoose.connection.on("connected", () => {
      logger.info(`MongoDB connected successfully to host: ${mongoose.connection.host}`);
    });

    mongoose.connection.on("error", (err) => {
      logger.error(`Database connection runtime error: ${err.message}`);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("Database connection severed. Reconnection attempts active.");
    });

    await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 5000, // Fail fast if Atlas unreachable
      socketTimeoutMS: 45000,         // Close slow sockets
      maxPoolSize: 10,                // Connection pool size
      family: 4,                      // Force IPv4 (fixes Render/Railway connectivity)
    });
  } catch (error) {
    logger.error(`Failed to connect to database: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
