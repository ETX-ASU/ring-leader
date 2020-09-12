import winston from "winston";

const MAXIMUM_LOG_FILE_SIZE = 1000000 * 10; // (10mb)

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "server.log",
      maxsize: MAXIMUM_LOG_FILE_SIZE
    })
  ]
});

export default logger;
