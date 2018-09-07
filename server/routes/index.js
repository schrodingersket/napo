'use strict';

const express = require('express');
const router = express.Router();

/**
 * Mount routes in wrapper function so that we can retain path information.
 *
 * @param router
 */
require('./user')(router);
require('./login')(router);
require('./token')(router);

module.exports = router;
