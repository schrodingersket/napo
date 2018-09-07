'use strict';

const API = require('../../lib/api');

const mount = (router) => {
  router.route('/token')
    .post(API.oauth.token);
};

module.exports = mount;
