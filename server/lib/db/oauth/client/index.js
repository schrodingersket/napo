'use strict';

const Promise = require('bluebird');

const DB = require('../../dao');

module.exports = {

  /**
   * Gets a client provided a particular clientId and clientSecret combination.
   * clientSecret may be undefined, if it's not needed for the chosen auth
   * flow.
   *
   * @param clientId
   * @param clientSecret
   */
  get: (clientId, clientSecret) => {

    let clientQuery = {
      client_id: clientId
    };

    if (clientSecret) {
      clientQuery.client_secret = clientSecret;
    }

    return Promise.all([
      DB.sql('oauth_clients').where(clientQuery),
      DB.sql('oauth_grants').where({
        client_id: clientId
      }),
      DB.sql('oauth_redirect_uris').where({
        client_id: clientId
      })
    ]).then(([clients, grants, redirectUris]) => {

      if (clients[0]) {
        clients[0].grants = grants;
        clients[0].redirectUris = redirectUris;
      }

      return clients[0];
    });
  },
};
