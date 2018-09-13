'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});

const API = require('../../../lib/api');
const middleware = require('../../../middleware');

router.route('/reset')
  .post(
    middleware.validation('/user/password/reset'),
    API.user.resetPassword
  );

router.route('/update')
  .post(
    middleware.validation('/user/password/update'),
    API.user.updatePassword
  );

module.exports = router;
