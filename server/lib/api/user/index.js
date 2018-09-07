'use strict';

const bcrypt = require('bcrypt');

const DB = require('../../db');
const http = require('../../util').http;
const logger = require('../../logger');

const saltRounds = 10;

module.exports = {

  get: (req, res, next) => {

    DB.user.get(req.params['userId'])
      .then((user) => {
        if (user) {
          res.status(http.codes.OK).send(user.pickLowerCase(
            'email',
            'username',
            'id'
          ));
        } else {
          res.status(http.codes.NOT_FOUND).send(http.errorFormatter(
            'That user was not found.'));
        }
      })
      .catch((err) => {

        const correlationId = logger.log('error', err.stack);

        res.status(http.codes.INTERNAL_SERVER_ERROR)
          .send(http.errorFormatter(correlationId,
            'An error occurred looking up this user.'));
      });
  },

  add: (req, res, next) => {

    bcrypt.hash(req.body.password, saltRounds)
      .then((hash) => {

        let userDetails = req.body.pickLowerCase('email', 'username');
        userDetails.password = hash;


        return DB.user.add(userDetails);
      })
      .then((user) => {
        res.status(http.codes.OK).send(user.pickLowerCase(
          'email',
          'username',
          'id'
        ));
      })
      .catch((err) => {

        const correlationId = logger.log('error', err.stack);

        res.status(http.codes.INTERNAL_SERVER_ERROR)
          .send(http.errorFormatter(correlationId,
            'An error occurred creating this user'));
      });
  },

  update: (req, res, next) => {

    let userDetails = req.body.pickLowerCase(
      'email',
      'username'
    );

    DB.user.update(userDetails)
      .then((user) => {
        res.status(http.codes.OK).send(user.pickLowerCase(
          'email',
          'username',
          'id'
        ));
      })
      .catch((err) => {

        const correlationId = logger.log('error', err.stack);

        res.status(http.codes.INTERNAL_SERVER_ERROR)
          .send(http.errorFormatter(correlationId,
            'An error occurred updating this user'));
      });
  },

  updatePassword: (req, res, next) => {
    res.status(http.codes.NOT_IMPLEMENTED).send();
  },

  resetPassword: (req, res, next) => {
    res.status(http.codes.NOT_IMPLEMENTED).send();
  }
};
