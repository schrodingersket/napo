'use strict';

const OAuthServer = require('oauth2-server');
const Request = OAuthServer.Request;
const Response = OAuthServer.Response;

const oauth = require('../server');
const exception = require('../../../exception');
const http = require('../../../util').http;

const token = (req, res, next) => {

  const request = new Request(req);
  const response = new Response(res);

  oauth.token(request, response)
    .then(function (token) {
      res.locals.oauth = {
        token: token
      };

      let now = Date.now();

      res.status(http.codes.OK).send({
        access_token: token.accessToken,
        token_type: 'bearer',
        expires_in: new Date(token.accessTokenExpiresAt).getTime() - now,
        refresh_token: token.refreshToken,
        refresh_token_expires_in: new Date(token.refreshTokenExpiresAt)
          .getTime() - now,
        scope: token.scope
      });
    })
    .catch(function (err) {
      next(new exception.HttpError('Received invalid token.',
        err, err.code || http.codes.INTERNAL_SERVER_ERROR));
    });
};

module.exports = token;