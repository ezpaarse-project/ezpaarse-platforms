#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform HyRead ebook
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

  //let match;

  if (/^\/bookDetail.jsp$/i.test(path)) {
    // http://ntust.ebook.hyread.com.tw/bookDetail.jsp?id=177049
    // http://ntust.ebook.hyread.com.tw/bookDetail.jsp?id=203257
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.unitid = param.id;

  }
  return result;
});
