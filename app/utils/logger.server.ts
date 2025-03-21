import pino from "pino";

let transport;
if (process.env.NODE_ENV !== "production") {
  try {
    transport = {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "yyyy-mm-dd HH:MM:ss",
        ignore: "pid,hostname",
      },
    };
  } catch (error) {
    console.error("Failed to load pino-pretty:", error);
  }
}

// Create a Pino logger instance
const logger = pino({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  transport,
});

export default logger;
