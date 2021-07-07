#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform LexNow
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let hash = parsedUrl.hash;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^#\/o\/book\/detail\/([0-9]+)$/i.exec(hash)) !== null) {
    // https://app-lexnow-lu.proxy.bnl.lu/#/o/book/detail/1763
    result.unitid = match[1];
    result.rtype = 'BOOK_SECTION';
    result.mime = 'PDF';
  }

  return result;
});
