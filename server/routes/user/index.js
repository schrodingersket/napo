'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});

const API = require('../../lib/api');
const middleware = require('../../middleware');
const passwordRoutes = require('./password');
const disabledOauthPaths = require('../../lib/server/allowed-paths');

// User authorization for user paths; verifies that the id of the provided
// token matches that of the :userId route param.
//
router.param('userId', middleware.unless(disabledOauthPaths,
  middleware.oauth.authorize.user));

router.use('/:userId/password', passwordRoutes);

// Add validation to all routes here
//
router.use(middleware.validation('/user'));

router.route('/:userId')
  .get(API.user.get)
  .put(API.user.update);

router.route('/')
  .post(API.user.add);

module.exports = router;
