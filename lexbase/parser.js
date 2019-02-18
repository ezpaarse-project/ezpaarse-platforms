#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Lexbase
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

if  (param.json) {

  if ((match = /^\/search\/reviews\/(\d+)$/i.exec(path)) !== null) {
    // http://www.lexbase.fr/search/reviews/36632541?json=1
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if ((match = /^\/search\/sources\/(\d+)$/i.exec(path)) !== null) {
    // http://www.lexbase.fr/search/sources/43129652?json=1
    result.rtype    = 'CODE_JURIDIQUE';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if ((match = /^\/search\/encyclopedia\/(\d+)$/i.exec(path)) !== null) {
    // http://www.lexbase.fr/search/encyclopedia/36753798?json=1
    result.rtype    = 'ENCYCLOPAEDIA_ENTRY';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  }

}

  return result;
});
