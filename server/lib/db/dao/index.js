'use strict';

const knex = require('knex');
const uuid = require('uuid/v1');

const logger = require('../../logger');

/**
 * DB class with support for multiple database connection types.
 */
class DB {

  constructor() {
    this._initialized = false;
  }

  /**
   * As documented as https://knexjs.org/, `cfg` is expected to take the form of
   * the following:
   *
   * {
   *   client: 'pg',
   *   connection: {
   *     host : '127.0.0.1',
   *     user : 'your_database_user',
   *     password : 'your_database_password',
   *     database : 'myapp_test'
   *   }
   * }
   *
   * @param cfg
   */
  init(cfg) {

    if (!this._initialized) {
      this.sql = knex(cfg.sql);
      this._initialized = true;
    } else {
      logger.log('warn', uuid(),
        'Database connection already initialized; skipping.');
    }
  }

}

const dbSingleton = new DB();

module.exports = dbSingleton;
