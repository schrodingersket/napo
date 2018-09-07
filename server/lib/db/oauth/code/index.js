'use strict';

const DB = require('../../dao');

module.exports = {

  /**
   * Gets an OAuth code for a given user and client.
   *
   * @param code
   * @returns {*}
   */
  get: (code) => {

    return DB.sql('oauth_codes')
      .where({
        access_code: code
      })
      .then((result) => {
        return result[0];
      });
  },

  /**
   * Gets an OAuth code for a given user and client.
   *
   * @param userId
   * @param clientId
   * @returns {*}
   */
  getForUserClient: (userId, clientId) => {

    return DB.sql('oauth_codes')
      .where({
        user_id: userId,
        client_id: clientId
      })
      .then((result) => {
        return result[0];
      });
  },

  /**
   * Adds a new OAuth code
   *
   * @param accessCode
   * @param client
   * @param user
   * @returns {*}
   */
  add: (accessCode, client, user) => {

    return DB.sql('oauth_codes')
      .insert({
        access_code: accessCode.code,
        expires_at: accessCode.expiresAt,
        scope: accessCode.scope,
        redirect_uri: accessCode.redirectUri,
        client_id: client.id,
        user_id: user.id,
      })
      .returning('*')
      .then((result) => {
        return result[0];
      });
  },

  /**
   * Updates an existing OAuth code.
   *
   * @param accessCode
   * @param client
   * @param user
   * @returns {*}
   */
  update: (accessCode, client, user) => {

    return DB.sql('oauth_codes')
      .update({
        access_code: accessCode.code,
        expires_at: accessCode.expiresAt,
        scope: accessCode.scope,
        redirect_uri: accessCode.redirectUri,
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
