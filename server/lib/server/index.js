'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const uuid = require('uuid/v1');

const middleware = require('../../middleware');

const config = require('../config');
const logger = require('../logger');
const disabledOauthPaths = require('./allowed-paths.json').paths;

const apiRoot = '/api/v1';

class Server {

  constructor() {
    this._initialized = false;
  }

  init() {

    // Early return
    //
    if (this._initialized) {
      logger.log('warn', uuid(), 'Server already initialized; skipping');
      return;
    }

    this._app = express();

    // Logger
    //
    this._app.use(morgan('dev'));


    // 3rd party CORS middleware
    this._app.use(cors({
      exposedHeaders: config
    }));

    // Body parsers
    //
    this._app.use(bodyParser.json({
      limit: config.bodyLimit
    }));
    this._app.use(bodyParser.urlencoded({
      extended: false
    }));

    // OAuth
    //
    this._app.use(apiRoot, middleware.unless(disabledOauthPaths,
      middleware.oauth.authenticate));

    // API routes
    //
    this._app.use(apiRoot, require('../../routes'));

    // Error handling
    //
    this._app.use(apiRoot, middleware.error);

    this._initialized = true;
    logger.log('info', 'Server initialized');
  }

  start() {
    // Start listening
    //
    let server = this._app.listen(config.port, () => {
      logger.log('info', `Started on port ${server.address().port}`);
    });
  }

  get app() {
    return this._app;
  }
}

const serverSingleton = new Server();

module.exports = serverSingleton;