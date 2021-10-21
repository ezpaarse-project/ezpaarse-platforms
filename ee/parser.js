#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Exact Editions
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

  if ((match = /^\/issues\/([0-9]+)\/[a-z]+\/([0-9]+)$/i.exec(path)) !== null) {
    // https://reader.exacteditions.com/issues/95099/spread/15
    result.rtype    = 'ISSUE';
    result.mime     = 'HTML';
    result.unitid = match[2];
    result.issue = match[1];

  } else if (/^\/magazines\/([0-9]+)\/search$/i.test(path)) {
    // https://reader.exacteditions.com/magazines/546/search?public=0&pt=a&ts=&from=&to=&stack=&q=Monk
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
