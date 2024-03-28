import winston from "winston";

const options = {
  file: {
    filename: `backend.log`,
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: true,
    timestamp: true,
  },
  console: {
    handleExceptions: true,
    colorize: true,
    timestamp: true,
  },
};

// This method set the current severity based on
// the current NODE_ENV: show all the log levels
// if the server was run in debug mode; otherwise,
// if it was run in production, show only warn and error messages.
const level = () => {
  const env = process.env.NODE_ENV || "debug";
  const isDevelopment = env === "debug";
  return isDevelopment ? "debug" : "warn";
};

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

winston.addColors(colors);

const logFormat = winston.format.combine(
  // Add the message timestamp with the preferred format
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss: A" }),
  // Tell Winston that the logs must be colored
  winston.format.colorize({ all: true }),
  // Define the format of the message showing the timestamp, the level and the message
  winston.format.printf((info) =>
    JSON.stringify(`${info.timestamp} ${info.level}: ${info.message}`)
  )
);

// Define which transports the logger must use to print out messages.
// In this example, we are using three different transports
const transports = [
  new winston.transports.File(options.file),
];

const logger = winston.createLogger({
  level: level(),
  levels,
  format: logFormat,
  transports,
});

export default logger;

/*

HOW TO USE:
import logger from '../../utils/logger.js';

logger.info('This is an information log');
logger.warn('This is a warning log');
logger.error('This is an error log');

LIMITATIONS:
currently not able to parse JSON object passed in message

*/
