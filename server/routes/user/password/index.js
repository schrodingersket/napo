'use strict';

const API = require('../../../lib/api');

const mount = (router) => {
  router.route('/user/:userId/password/reset')
    .post(API.user.resetPassword);

  router.route('/user/:userId/password/update')
    .post(API.user.updatePassword);

};

module.exports = mount;
