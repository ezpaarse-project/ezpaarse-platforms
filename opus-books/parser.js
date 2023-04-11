#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Opus
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/catalog\/book\/([0-9a-z-]+)$/i.exec(path)) !== null) {
    // /catalog/book/quatre-atlas-de-myologie-de-van-horne-et-sagemolen
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.publication_title = match[1];
    result.unitid = match[1];

  } else if ((match = /^\/catalog\/view\/([0-9a-z-]+)\/(1|2)\/([0-9]+)$/i.exec(path)) !== null) {
    // /catalog/view/quatre-atlas-de-myologie-de-van-horne-et-sagemolen/1/355
    result.rtype = 'BOOK_SECTION';
    result.mime = match[2] === '1' ? 'HTML' : 'PDF';
    result.unitid = match[3];
    result.publication_title = match[1];

  }

  return result;
});
