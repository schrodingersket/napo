'use strict';

const v = require('../../lib/validation');
const http = require('../../lib/util').http;
const logger = require('../../lib/logger');

const validator = (req, res, next) => {

  const validationResult = v(req);

  if (validationResult.errors.length) {

    const correlationId = logger.log('error', 'Received invalid JSON for ' +
      `path ${req.originalUrl}; JSON body was ${JSON.stringify(req.body)}`);

    res.status(http.codes.BAD_FORMAT)
      .send(http.errorFormatter(correlationId, {
          validationErrors: validationResult.errors
            .map((error) => error.message)
        }));

  } else {
    next();
  }
};

module.exports = validator;