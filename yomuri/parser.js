#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Yomuri
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

  if (/^\/rekishikan\/viewerMtsStart\.action$/i.test(path)) {
    // https://database.yomiuri.co.jp/rekishikan/viewerMtsStart.action?objectId=vcGrhq%2FZi%2FSAaLwEkC3ksUSrlyVxucvRop89%2FUQgIzQ%3D
    result.rtype    = 'ISSUE';
    result.mime     = 'HTML';
    result.unitid = param.objectId;

  }

  return result;
});
