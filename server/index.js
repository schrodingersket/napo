'use strict';

const config = require('./lib/config');
const DB = require('./lib/db');
const logger = require('./lib/logger');
const server = require('./lib/server');
require('./lib/util/pick');

// Initialize logger
//
logger.init(config.logLevel, config.logFile);
logger.log('info', 'Logger initialized.');

// Initialize database connection
//
DB.dao.init({
  sql: config.sql.fromEnv()
});
logger.log('info', 'Database initialized.');

// Initialize server
//
server.init();

// Start server
//
server.start();
