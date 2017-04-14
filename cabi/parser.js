#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform CAB eBooks
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

  if ((match = /^\/cabebooks\/FullTextPDF\/([0-9]{4})\/(([0-9]+).pdf)$/i.exec(path)) !== null) {
    //http://www.cabi.org/cabebooks/FullTextPDF/2016/20163382836.pdf
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'PDF';
    result.unitid   = match[3];
    result.title_id = match[3];

  } else if ((match = /^\/cabebooks\/ebook\/([0-9]+)$/i.exec(path)) !== null) {
    // http://www.cabi.org/cabebooks/ebook/20163382850
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';
    result.unitid   = match[1];
    result.title_id = match[1];

  }

  return result;
});
