'use strict';

const logger = require('../../lib/logger');
const http = require('../../lib/util').http;
const exceptions = require('../../lib/exception');

/**
 * Generic catch-all handler, which hands back status codes with messages
 * and automatic logging.
 *
 * @param err
 * @param req
 * @param res
 * @param next
 */
const errorHandler = (err, req, res, next) => {

  if (err instanceof exceptions.HttpError) {
    const correlationId = logger.log('error', err.original ?
      err.original.stack : err);

    res.status(err.code)
      .send(http.errorFormatter(correlationId, err.message));

  } else {
    next(err);
  }
};

module.exports = errorHandler;


