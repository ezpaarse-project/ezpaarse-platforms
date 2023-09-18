#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform UNEBOOK
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

  if ((match = /^\/viewer\/([0-9]+)\/([0-9]+)$/i.exec(path)) !== null) {
    // https://lectura.unebook.es/viewer/9788491442141/1
    result.rtype    = 'BOOK_PAGE';
    result.mime     = 'HTML';
    result.unitid = match[1];

  } else if (/^\/$/i.test(path)) {
    // https://lectura.unebook.es/
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
