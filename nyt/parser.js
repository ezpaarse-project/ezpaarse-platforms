#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform The New York Times
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

  if ((match = /^\/([0-9]{4})\/([0-9]{2})\/([0-9]{2})\/[a-z-]+\/[a-z-]+\/([a-z-]+)\.html$/i.exec(path)) !== null) {
    // https://www.nytimes.com/2021/11/15/world/europe/europe-vaccine.html
    // https://www.nytimes.com/2021/11/09/well/mind/john-sarno-chronic-pain-relief.html
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.publication_date = match[1] + '-' + match[2] + '-' + match[3]
    result.unitid = match[4];

  } else if ((match = /^\/search$/i.exec(path)) !== null) {
    // https://www.nytimes.com/search?query=sports
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    result.search_term = param.query;
  }

  return result;
});
