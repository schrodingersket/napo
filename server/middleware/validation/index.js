'use strict';

const v = require('../../lib/validation');
const http = require('../../lib/util').http;
const logger = require('../../lib/logger');
const exception = require('../../lib/exception');

const validator = (path) => {
  return (req, res, next) => {

    const validationResult = v(req, path);

    if (validationResult.errors.length) {

      logger.log('error', 'Received invalid JSON for ' +
        `path ${req.originalUrl}; JSON body was ${JSON.stringify(req.body)}`);

      next(new exception.HttpError({
        validationErrors: validationResult.errors.map((error) => {
          return error.message;
        })
      }, null, http.codes.BAD_FORMAT))

    } else {
      next();
    }

  }
};

module.exports = validator;