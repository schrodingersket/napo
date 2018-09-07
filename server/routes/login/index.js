'use strict';

const API = require('../../lib/api');

const mount = (router) => {
  router.route('/login')
    .post(API.oauth.token);
};

module.exports = mount;
