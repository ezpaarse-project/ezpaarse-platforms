#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Aviation Week
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

  if (/^\/awin\/search\/articles$/i.test(path)) {
    // https://aviationweek.com/awin/search/articles?q=%20F-22&all=&exact=&any=&not=&sort_by=created     
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if (/^\/([a-z-]+)\/([a-z-]+)\/([a-z0-9-]+)$/i.test(path)) {
    // https://aviationweek.com/air-transport/airports-routes/france-tightens-covid-19-travel-restrictions
    // https://aviationweek.com/awin/program/611#
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
  }

  return result;
});
