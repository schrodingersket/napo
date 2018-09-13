'use strict';

const config = require('../../../../lib/config');
const http = require('../../../../lib/util').http;
const exception = require('../../../../lib/exception');

/**
 * This optional middleware verifies that the userId provided in the auth path
 * matches that of the provided OAuth token.
 * @param req
 * @param res
 * @param next
 * @param userId
 */
const authorize = (req, res, next) => {

  if (config.validateUserIdAgainstToken && req.params.userId &&
    req.params.userId !== res.locals.oauth.token.user.id.toString()) {

    console.log(typeof req.params.userId);
    console.log(typeof res.locals.oauth.token.user.id);

    next(new exception.HttpError('You do not have permission to act on ' +
      'behalf of this user.', null, http.codes.FORBIDDEN));
  } else {
    next();
  }
};

module.exports = authorize;