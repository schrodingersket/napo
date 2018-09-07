/**
 * Disables the provided middleware for any paths in the blockedPaths map, which
 * maps pathed to be blocked to method for which they should be blocked.
 *
 * @param blockedPaths
 * @param middleware
 * @returns {Function}
 */
const unless = (blockedPaths, middleware) => {
  return (req, res, next) => {
    if (blockedPaths[req.path] === req.method) {
      // Skip
      //
      next();
    } else {
      // Pass to the provided middleware
      //
      return middleware(req, res, next);
    }
  }
};

module.exports = unless;