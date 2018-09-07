'use strict';

const API = require('../../lib/api');

const mount = (router, auth) => {
  router.route('/user/:userId')
    .get(API.user.get)
    .put(API.user.update);

  router.route('/user')
    .post(API.user.add);

  require('./password')(router);
};

module.exports = mount;
