#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Inside Cybersecurity
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

  if (/^\/search\/.+$/i.exec(path)) {
    // https://insidecybersecurity.com/search/open%2Bsource
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if (/^\/daily-news\/.+$/i.exec(path)) {
    // https://insidecybersecurity.com/daily-news/industry-offers-backing-%E2%80%98unifying-approach%E2%80%99-trump-%E2%80%98critical-technology%E2%80%99-strategy
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
  }

  return result;
});
