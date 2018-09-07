'use strict';

const winston = require('winston');
const uuid = require('uuid/v1');

let initialized = false;
let fileLogger;

/**
 * Provides a wrapper around the Winston logger and automatically adds
 * correlation ids.
 *
 * @type {{init(*): void, log(*, *)}}
 */
const logger = {

  init(logLevel, logFile) {
    if (initialized) {
      fileLogger.log('warn', 'Logger already initialized; skipping second init.');
    } else {

      winston.level = logLevel;
      fileLogger = winston.createLogger({
        transports: [
          new winston.transports.Console(),
          new winston.transports.File({ filename: logFile })
        ]
      })
    }
  },

  log(level, message) {

    const correlationId = uuid();

    fileLogger.log(level, message, {
      correlationId: correlationId
    });

    return correlationId;
  }
};

module.exports = logger;