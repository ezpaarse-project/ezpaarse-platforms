/**
 * Utilities for Node scripts
 */
'use strict';

/**
 * Get a module from node_modules
 */
module.exports.lib = function (name) {
  return require(name); // eslint-disable-line global-require
};