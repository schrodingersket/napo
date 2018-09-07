'use strict';

/**
 * Adds a `pick` method to all objects, which returns a new object containing
 * the attributes provided to the function.
 */
(() => {
  Object.defineProperty(Object.prototype, 'pick', {

    value: function(...attributes) {
      return attributes.reduce((picked, attribute) => {

        if (this === undefined) {
          return picked;
        }

        if (attribute !== undefined) {

          if (this.hasOwnProperty(attribute)) {
            picked[attribute] = this[attribute];
          } else {
            picked[attribute] = null;
          }
        }

        return picked;
      }, {});
    },

    writable: false
  });

  Object.defineProperty(Object.prototype, 'pickLowerCase', {

    value: function(...attributes) {
      return attributes.reduce((picked, attribute) => {

        if (this === undefined) {
          return picked;
        }

        if (attribute !== undefined) {

          if (this.hasOwnProperty(attribute)) {
            if ('string' === typeof(this[attribute])) {
              picked[attribute] = this[attribute].toLowerCase();
            } else {
              picked[attribute] = this[attribute];
            }
          } else {
            picked[attribute] = null;
          }
        }

        return picked;
      }, {});
    },

    writable: false
  });
})();
