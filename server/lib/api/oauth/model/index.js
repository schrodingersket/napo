'use strict';
const bcrypt = require('bcrypt');
const Promise = require('bluebird');

const DB = require('../../../db');
const logger = require('../../../logger');

/**
 * We refrain from using the application's usual HTTP exceptions, since our
 * Node OAuth library handles responses.
 */
module.exports = {

  /**
   * https://oauth2-server.readthedocs.io/en/latest/model/spec.html#getaccesstoken-accesstoken-callback
   *
   * @param accessToken
   */
  getAccessToken(accessToken) {

    return new Promise((resolve) => {
      return DB.oauth.token.get(accessToken)
        .then((token) => {

          return Promise.all([
            DB.user.get(token.user_id),
            DB.oauth.client.get(token.client_id),
            Promise.resolve(token)
          ])
        })
        .then(([user, client, token]) => {

          client.id = client.client_id; // because spec conformance is good.

          resolve({
            accessToken: token.access_token,
            accessTokenExpiresAt: token.expires_at,
            scope: token.scope,
            client: client,
            user: user.pick(
              'id',
              'email',
              'username')
          });
        })
        .catch((err) => {

          logger.log('error', err.stack);
          resolve(false);
        });
    });
  },

  /**
   * https://oauth2-server.readthedocs.io/en/latest/model/spec.html#savetoken-token-client-user-callback
   *
   * @param token
   * @param client
   * @param user
   */
  saveToken(token, client, user) {

    return new Promise((resolve) => {
      return DB.oauth.token.getForUserClient(user.id, client.id)
        .then((maybeToken) => {

          // Code golf!
          //
          return DB.oauth.token[maybeToken ? 'update' : 'add'](token, client,
            user);
        })
        .then((accessToken) => {

          resolve({
            accessToken: accessToken.access_token,
            accessTokenExpiresAt: accessToken.expires_at,
            refreshToken: accessToken.refresh_token,
            refreshTokenExpiresAt: accessToken.refresh_token_expires_at,
            scope: accessToken.scope,
            client: {
              id: client.id
            },
            user: {
              id: user.id
            }
          });
        })
        .catch((err) => {

          logger.log('error', err.stack);
          resolve(false);
        });
    });
  },

  /**
   * https://oauth2-server.readthedocs.io/en/latest/model/spec.html#getauthorizationcode-authorizationcode-callback
   *
   * @param accessCode
   */
  getAccessCode(accessCode) {

    return new Promise((resolve) => {
        return DB.oauth.code.get(accessCode)
          .then((code) => {

            return Promise.all([
              DB.user.get(code.user_id),
              DB.oauth.client.get(code.client_id)
            ])
          })
          .then(([user, client]) => {

            client.id = client.client_id; // because spec conformance is good.

            resolve({
              code: code.access_code,
              expiresAt: code.expires_at,
              scope: code.scope,
              redirectUri: code.redirect_uri,
              client: client,
              user: user.pick('user_id', 'email')
            });
          })
          .catch((err) => {

            logger.log('error', err.stack);
            resolve(false);
          });
      }
    )
      ;
  },

  /**
   * https://oauth2-server.readthedocs.io/en/latest/model/spec.html#saveauthorizationcode-code-client-user-callback
   *
   * @param code
   * @param client
   * @param user
   */
  saveAuthorizationCode(code, client, user) {

    return new Promise((resolve) => {
      return DB.oauth.code.getForUserClient(user.id, client.id)
        .then((maybeCode) => {

          // Code golf!
          //
          return DB.oauth.code[maybeCode ? 'update' : 'add'](code, client, user);
        })
        .then((authorizationCode) => {

          resolve({
            authorizationCode: authorizationCode.authorization_code,
            expiresAt: authorizationCode.expires_at,
            redirectUri: authorizationCode.redirect_uri,
            scope: authorizationCode.scope,
            client: {
              id: client.client_id
            },
            user: {
              id: user.id
            }
          });
        })
        .catch((err) => {

          logger.log('error', err.stack);
          resolve(false);
        });
    });
  }
  ,

  /**
   * https://oauth2-server.readthedocs.io/en/latest/model/spec.html#getuser-username-password-callback
   *
   * @param username
   * @param password
   */
  getUser: (username, password) => {

    // This should resolve falsey if no user was found. We're explicitly
    // managing this here so that we have some measure of control over logging
    // errors.
    //
    return new Promise((resolve) => {

      DB.user.getByEmailOrUsername(username.toLowerCase())
        .then((user) => {

          // Throw new error and resolve false
          //
          if (!user) {
            logger.log('error', `No user '${username}' could be found.`);
            resolve(false);
          }

          // Check password hash
          //
          return Promise.all([
            bcrypt.compare(password, user.password),
            user
          ]);
        })
        .then((result) => {
          resolve(result[0] ? result[1] : false);
        })
        .catch((err) => {

          logger.log('error', err.stack);
          resolve(false);
        });
    });
  },

  /**
   * https://oauth2-server.readthedocs.io/en/latest/model/spec.html#getclient-clientid-clientsecret-callback
   *
   * @param clientId
   * @param clientSecret
   */
  getClient(clientId, clientSecret) {
    return new Promise((resolve) => {

      DB.oauth.client.get(clientId, clientSecret)
        .then((client) => {

          // Throw new error and resolve false
          //
          if (!client) {
            logger.log('error', `No client '${clientId}' could be found.`);
            resolve(false);
          }

          // `redirect_uris` and `grants` are optional.
          //
          resolve({
            id: client.client_id,
            redirectUris: client.redirectUris
              .map((redirectUri) => redirectUri.redirect_uri),
            grants: client.grants.map((grant) => grant.grant_name)
          });
        })
        .catch((err) => {

          logger.log('error', err.stack);
          resolve(false);
        })
    });
  }
};
