#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform R2 Library
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

  if ((match = /^\/Search$/i.exec(path)) !== null) {
    // https://www.r2library.com/Search?q=ABC+#include=1
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/Resource\/Title\/([0-9]+)$/i.exec(path)) !== null) {
    // https://www.r2library.com/Resource/Title/0470659629
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.print_identifier = match[1];
    result.unitid   = match[1];

  } else if ((match = /^\/resource\/detail\/([0-9]+)\/([0-9a-z]+)$/i.exec(path)) !== null) {
    // https://www.r2library.com/resource/detail/0470659629/ch0002s0022
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';
    result.print_identifier = match[1];
    result.unitid   = match[1] + '-' + match[2];
  }

  return result;
});
