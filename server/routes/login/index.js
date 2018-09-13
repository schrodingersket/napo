'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});

const API = require('../../lib/api');

router.route('/')
  .post(API.oauth.token);

module.exports = router;
