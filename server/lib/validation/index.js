'use strict';
const jsonschema = require('jsonschema');

const v = new jsonschema.Validator();

/**
 * We do some fun trickery here taking advantage of the fact that Node caches
 * an object the first time it's required. Instead of creating a bunch of
 * boilerplate matching request paths, methods, etc., this one dynamically grabs
 * the appropriate schema from the request path. This allows us to delegate all
 * validation to a single middlware bit, so that handlers can handle better.
 *
 * This does require that all schemas follow the same general file location and
 * file name, as seen in the `schema` directory.
 *
 * Returns `true` if valid (or if this function is inapplicable for the provided
 * request), and `false` if not.
 *
 * @param req
 * @param vPath
 */
const validate = (req, vPath) => {

  // First, check that we're dealing with JSON, and that we're not handling
  // anything that shouldn't have a request body (e.g., a GET).
  //
  if (req.get('content-type') !== 'application/json' ||
    ['put', 'post'].indexOf(req.method.toLowerCase()) === -1) {
    return {
      errors: []
    };
  }

  let schema = require('./schema' + vPath + '/' + req.method.toLowerCase() +
    '.json');

  return v.validate(req.body, schema);
};

module.exports = validate;