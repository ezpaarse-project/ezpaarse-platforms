#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform BrowZine
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */

module.exports = new Parser(function analysesEC(parsedUrl, ec) {
  let result = {};

  // use console.error for debuging
  // console.error(parsedUrl);

  // https://browzine.com:443/libraries
  result.rtype = 'SEARCH';
  result.mime  = 'HTML';
  return result;
});
