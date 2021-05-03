#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Indiana Memory
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if (/^\/Search\/Results$/i.test(path)) {
    // https://digital.library.in.gov/Search/Results?lookfor=Coal+Miners&submit=
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/Record\/([a-z0-9-_]+)$/i.exec(path)) !== null) {
    // https://digital.library.in.gov/Record/WV3_ctm-512
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.unitid  = match[1];
  }

  return result;
});
