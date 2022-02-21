#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Law Trove
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

  if ((match = /^\/view\/([0-9.]+\/he\/[0-9.]+)\/[0-9a-z-]+$/i.exec(path)) !== null) {
    // https://www.oxfordlawtrove.com/view/10.1093/he/9780198870029.001.0001/he-9780198870029-chapter-22?rskey=yycRBs&result=1
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.unitid = match[1];
    result.doi = match[1];

  } else if (/^\/search$/i.test(path)) {
    // https://www.oxfordlawtrove.com/search?q=test&searchBtn=Search&isQuickSearch=true
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
