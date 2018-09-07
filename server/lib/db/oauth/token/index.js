'use strict';

const DB = require('../../dao');

module.exports = {

  /**
   * Gets an OAuth token.
   *
   * @param token
   * @returns {*}
   */
  get: (token) => {

    return DB.sql('oauth_tokens')
      .where({
        access_token: token
      })
      .then((result) => {
        return result[0];
      });
  },

  /**
   * Gets an OAuth token for a given user and client.
   *
   * @param userId
   * @param clientId
   * @returns {*}
   */
  getForUserClient: (userId, clientId) => {

    return DB.sql('oauth_tokens')
      .where({
        user_id: userId,
        client_id: clientId
      })
      .then((result) => {
        return result[0];
      });
  },

  /**
   * Creates a new OAuth token.
   *
   * @param accessToken
   * @param client
   * @param user
   * @returns {*}
   */
  add: (accessToken, client, user) => {

    return DB.sql('oauth_tokens')
      .insert({
        access_token: accessToken.accessToken,
        expires_at: accessToken.accessTokenExpiresAt,
        refresh_token: accessToken.refreshToken,
        refresh_token_expires_at: accessToken.refreshTokenExpiresAt,
        scope: accessToken.scope,
        client_id: client.id,
        user_id: user.id,
      })
      .returning('*')
      .then((result) => {
        return result[0];
      });
  },

  /**
   * Updates an existing OAuth token.
   *
   * @param accessToken
   * @param client
   * @param user
   * @returns {*}
   */
  update: (accessToken, client, user) => {

    return DB.sql('oauth_tokens')
      .update({
        access_token: accessToken.token,
        expires_at: accessToken.accessTokenExpiresAt,
        scope: accessToken.scope
      })
      .where({
        user_id: user.id,
        client_id: client.id
      })
      .returning('*')
      .then((result) => {
        return result[0];
      });
  }
};
