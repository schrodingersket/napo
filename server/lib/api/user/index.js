'use strict';

const bcrypt = require('bcrypt');

const DB = require('../../db');
const http = require('../../util').http;
const exception = require('../../exception');

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
          next(new exception.HttpError('That user was not found.',
            null, http.codes.NOT_FOUND));
        }
      })
      .catch((err) => {
        next(new exception.HttpError('An error occurred finding this user',
          err, http.codes.INTERNAL_SERVER_ERROR));
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
        next(new exception.HttpError('An error occurred updating this user',
          err, http.codes.INTERNAL_SERVER_ERROR));
      });
  },

  update: (req, res, next) => {

    let userDetails = req.body.pickLowerCase(
      'email',
      'username'
    );

    DB.user.update(req.params.userId, userDetails)
      .then((user) => {
        res.status(http.codes.OK).send(user.pickLowerCase(
          'email',
          'username',
          'id'
        ));
      })
      .catch((err) => {
        next(new exception.HttpError('An error occurred updating this user',
          err, http.codes.INTERNAL_SERVER_ERROR));
      });
  },

  updatePassword: (req, res, next) => {

    const bodyData = req.body.pick('oldPassword', 'newPassword');

    if (bodyData.oldPassword === bodyData.newPassword) {
      next(new exception.HttpError('Old and new passwords must not match.',
        null, http.codes.BAD_FORMAT));
    }

    DB.user.get(req.params.userId)
      .then((user) => {
        if (user) {
          return bcrypt.compare(bodyData.oldPassword, user.password)
            .then((equal) => {

              if (equal) {
                return bcrypt.hash(bodyData.newPassword, saltRounds);
              } else {
                next(new exception.HttpError('Invalid password.',
                  null, http.codes.BAD_FORMAT));
              }
            })
            .then((newHash) => {
              user.password = newHash;
              return DB.user.update(req.params.userId, user);
            })
            .then((updatedUser) => {
              res.status(http.codes.OK).send(updatedUser.pickLowerCase(
                'email',
                'username',
                'id'
              ));
            });

        } else {
          next(new exception.HttpError('This user was not found.',
            null, http.codes.NOT_FOUND));
        }
      }) .catch((err) => {
        next(new exception.HttpError('This user was not found.',
          err, http.codes.NOT_FOUND));
      });
  },

  resetPassword: (req, res, next) => {
    res.status(http.codes.NOT_IMPLEMENTED).send();
  }
};
