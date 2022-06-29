#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Japan Knowledge
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if (/^\/lib\/search\/basic\/index\.html$/i.test(path)) {
    // https://japanknowledge.com/lib/search/basic/index.html?q1=money&r1=1&phrase=0&sort=1&rows=20&pageno=1&s=s
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if (/^\/lib\/display\/$/i.test(path)) {
    // ENCYCLOPAEDIA_ENTRY
    // https://japanknowledge.com/lib/display/?lid=10800EC100710
    // https://japanknowledge.com/lib/display/?lid=40110C042900
    // BOOK_PAGE
    // https://japanknowledge.com/lib/display/?lid=80110V00120108

    result.unitid   = param.lid;
    match = /^([0-9]+)([a-z]+)[0-9]+$/i.exec(param.lid);
    if (match[2] == 'V') {
      result.rtype    = 'BOOK_PAGE';
      result.mime     = 'HTML';
      result.title_id = match[1];
    } else {
      result.rtype    = 'ENCYCLOPAEDIA_ENTRY';
      result.mime     = 'HTML';
      result.db_id = match[1];
    }
  } else if ((match = /^\/lib\/shelf\/([a-z]+)\/$/i.exec(path)) !== null) {
    // https://japanknowledge.com/lib/shelf/economist/
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  }

  return result;
});
