'use strict';

/**
 * Custom error type, in which `extra` has the following format:
 *
 * {
 *   code: <http code to return>,
 *   err: <original error thrown, if applicable>,
 * }
 *
 * @param message A message to go with the error.
 * @param original The original exception thrown.
 * @param code The HTTP code to send to the client.
 */
module.exports = function HttpError(message, original, code) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.original = original;
  this.code = code;
};