#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Inside Defense
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

  if (/^\/search\/([a-z0-9-]+)$/i.test(path)) {
    // https://insidedefense.com/search/F-22
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if (/^\/([a-z-]+)\/([a-z0-9-]+)$/i.test(path)) {
    // https://insidedefense.com/insider/gatewayone-prototype-facilitates-new-data-paths-loses-connectivity-flight
    // https://insidedefense.com/daily-news/dote-designates-f-35-odin-schedule-high-risk
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
  }

  return result;
});
