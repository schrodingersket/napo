'use strict';

const httpCodes = {
  OK: 200,
  BAD_FORMAT: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501
};


const errorFormatter = (correlationId, message) => {
  return {
    correlationId: correlationId,
    message: message
  }
};

module.exports = {
  codes: httpCodes,
  errorFormatter: errorFormatter
};

