'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});

/**
 * Mount routes in wrapper function so that we can retain path information.
 *
 * @param router
 */

router.use('/user', require('./user'));
router.use('/login', require('./login'));

module.exports = router;
