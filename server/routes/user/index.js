'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});

const API = require('../../lib/api');
const middleware = require('../../middleware');
const passwordRoutes = require('./password');

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
