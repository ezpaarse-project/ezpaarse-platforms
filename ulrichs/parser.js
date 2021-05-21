#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Ulrichs Web
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

  if ((match = /^\/search\/(.*)$/i.exec(path)) !== null) {
    // https://ulrichsweb.serialssolutions.com/search/-2026194887
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /^\/title\/(([0-9]+)\/([0-9]+))$/i.exec(path)) !== null) {
    // https://ulrichsweb.serialssolutions.com/title/1619026799638/630448
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  }

  return result;
});
