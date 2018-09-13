'use strict';

const OAuthServer = require('oauth2-server');
const Request = OAuthServer.Request;
const Response = OAuthServer.Response;

const API = require('../../../lib/api');
const http = require('../../../lib/util').http;
const exception = require('../../../lib/exception');

const authenticate = (req, res, next) => {

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
      next(new exception.HttpError('Unable to authenticate.', err,
        err.code || http.codes.INTERNAL_SERVER_ERROR));
    });
};

module.exports = authenticate;