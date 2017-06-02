#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform IET.tv
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let param  = parsedUrl.query || {};

  if (param && param.videoid) {
    // https://tv.theiet.org/?videoid=8132
    result.rtype  = 'VIDEO';
    result.mime   = 'HTML';
    result.unitid = param.videoid;
  }

  return result;
});

