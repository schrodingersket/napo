'use strict';

const OAuthServer = require('oauth2-server');

const model = require('../model');
const config = require('../../../config');

const oauthServer = new OAuthServer({
  model: model,
  accessTokenLifetime: config.accessTokenLifetime, // never expire
  requireClientAuthentication: {
    password: false
  }
});

module.exports = oauthServer;
