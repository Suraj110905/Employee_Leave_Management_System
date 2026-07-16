const { createLogger, format, transports } = require("winston");
const path = require("path");

// Format logger messages for terminal console
const consoleFormat = format.combine(
  format.colorize(),
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level}: ${message}`;
  })
);

// Format logger messages for file storage (structured JSON format)
const fileFormat = format.combine(
  format.timestamp(),
  format.json()
);

const logger = createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  transports: [
    // Standard console transport
    new transports.Console({
      format: consoleFormat,
    }),
    // Error files rotation log
    new transports.File({
      filename: path.join(__dirname, "../../logs/error.log"),
      level: "error",
      format: fileFormat,
    }),
    // Combined system logs
    new transports.File({
      filename: path.join(__dirname, "../../logs/combined.log"),
      format: fileFormat,
    }),
  ],
});

module.exports = logger;
