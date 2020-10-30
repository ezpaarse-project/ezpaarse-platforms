#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Aspen Law
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

  if ((match = /^\/searchresults$/i.exec(path)) !== null) {
    // https://ebooks.aspenlaw.com/searchresults?option=catalog_shelf&searchinType=all&keyword=tort&type=allBooks
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/product\/([a-z-]+)$/i.exec(path)) !== null) {
    // https://ebooks.aspenlaw.com/product/inside-torts-what-matters
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if ((match = /^\/pdfreader\/([a-z-]+)$/i.exec(path)) !== null) {
    // https://ebooks.aspenlaw.com/pdfreader/inside-torts-what-matters
    result.rtype    = 'BOOK';
    result.mime     = 'PDF';
    result.unitid   = match[1];
  }

  return result;
});
