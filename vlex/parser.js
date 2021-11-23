#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');
const URL    = require('url');

/**
 * Recognizes the accesses to the platform vLex
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  const hash = parsedUrl.hash.replace('#', '')
  const hashedUrl = URL.parse(hash, true);
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^search\/([a-z:]+)\/([a-z]+)$/i.exec(hashedUrl.pathname)) !== null) {
    // https://app.vlex.com/#search/jurisdiction:CL/COVID
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    result.search_term = match[2];

  } else if ((match = /([^?]*)\/vid\/([0-9]+)$/i.exec(hashedUrl.pathname)) !== null) {
    // https://app.vlex.com/#/vid/877960841
    // https://app.vlex.com/#WW/vid/877911364
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    if (match[2] !== null) {
      result.unitid = match[2];
    } else {
      result.unitid   = match[1];
    }
  }

  return result;
});
