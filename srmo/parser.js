#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Sage Research Methods Online
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

  if ((match = /^\/view\/([0-9a-z\-]+)\/([0-9a-z\-]*).xml$/i.exec(path)) !== null) {
    // /view/100-statistical-tests/SAGE.xml?
    // /view/100-statistical-tests/n1.xml
    result.rtype  = 'BOOK_SECTION';
    result.mime   = 'HTML';
    result.unitid = match[1];
    if (match[2] == 'SAGE') {
      result.rtype = 'ABS';
    }
  } else if ((match = /^\/downloadsrmodoc\/([0-9a-z\-]+)\/([0-9a-z\-]*).xml(\/false)?$/i.exec(path)) !== null) {
    //downloadsrmodoc/100-statistical-tests$002fn1.xml/false?nojs=true
    result.rtype  = 'BOOK_SECTION';
    result.mime   = 'PDF';
    result.unitid = match[1];
  }

  return result;
});
