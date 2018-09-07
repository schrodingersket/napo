'use strict';

const OAuthServer = require('oauth2-server');
const Request = OAuthServer.Request;
const Response = OAuthServer.Response;

const API = require('../../../lib/api');
const logger = require('../../../lib/logger');
const http = require('../../../lib/util').http;

const authorize = (req, res, next) => {

  const request = new Request(req);
  const response = new Response(res);

  API.oauth.server.authenticate(request, response)
    .then(function (token) {
      res.locals.oauth = {
        token: token
      };
      next();
    })
    .catch(function (err) {

      const correlationId = logger.log('error', err.stack);

      res.status(err.code || http.codes.INTERNAL_SERVER_ERROR)
        .send(http.errorFormatter(correlationId,
          'Received invalid token.'));
    });
};

module.exports = authorize;