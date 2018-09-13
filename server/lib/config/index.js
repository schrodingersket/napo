'use strict';
const configFile = require('../../config.json');

const config = {
  sql: {
    fromEnv() {
      return {
        client: process.env['SQL_CLIENT_TYPE'],
        connection: {
          host: process.env['SQL_HOST'],
          user: process.env['SQL_USER'],
          password: process.env['SQL_PASSWORD'],
          database: process.env['SQL_DB']
        }

      }

    },

    /**
     *
     * @param filePath Path to JSON config.
     */
    fromJson(filePath) {
      return require(filePath);
    }
  },

  get tokenTimeout() {
    return process.env['TOKEN_TIMEOUT'] || configFile.tokenTimeout;
  },

  get logLevel() {
    return process.env['LOG_LEVEL'] || configFile.logLevel;
  },

  get logFile() {
    return process.env['LOG_FILE'] || configFile.logFile;
  },

  get port() {
    return process.env['NODE_LISTEN_PORT'] || configFile.port;
  },

  get accessTokenLifetime() {
    return process.env['ACCESS_TOKEN_LIFETIME'] ||
      configFile.accessTokenLifetime;
  },

  get validateUserIdAgainstToken() {
    return process.env['VALIDATE_USER_ID_WITH_TOKEN'] ||
      configFile.validateUserIdAgainstToken;
  }
};

module.exports = config;