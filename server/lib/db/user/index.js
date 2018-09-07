'use strict';

const DB = require('../dao');

module.exports = {

  /**
   * Gets a user by id.
   *
   * @param userId
   * @returns {*}
   */
  get: (userId) => {

    return DB.sql('users')
      .where({
        id: userId
      })
      .then((result) => {
        return result[0];
      });
  },

  /**
   * Gets a user either by their username, or by e-mail address.
   *
   * @param identifier
   * @returns {*}
   */
  getByEmailOrUsername: (identifier) => {

    return DB.sql('users')
      .where({
        email: identifier
      })
      .orWhere({
        username: identifier
      })
      .then((result) => {
        return result[0];
      });
  },

  /**
   * Creates a user.
   *
   * @param userDetails
   * @returns {*}
   */
  add: (userDetails) => {

    return DB.sql('users')
      .insert(userDetails)
      .returning('*')
      .then((result) => {
        return result[0];
      });
  },

  /**
   * Updates a user.
   *
   * @param userId
   * @param userDetails
   * @returns {*}
   */
  update: (userId, userDetails) => {

    return DB.sql('users')
      .update(userDetails)
      .where({
        id: userId
      })
      .returning('*')
      .then((result) => {
        return result[0];
      });
  }
};
