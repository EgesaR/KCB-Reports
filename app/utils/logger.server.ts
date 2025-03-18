import pino from "pino";

// Create a Pino logger instance
const logger = pino({
  level: process.env.NODE_ENV === "production" ? "info" : "debug", // Log level
  transport: {
    target: "pino-pretty", // Pretty print logs in development
    options: {
      colorize: true, // Add colors to logs
      translateTime: "yyyy-mm-dd HH:MM:ss", // Format timestamps
      ignore: "pid,hostname", // Hide unnecessary fields
    },
  },
});

export default logger;
