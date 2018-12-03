#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Generalis-Indexpresse
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

  // let match;

  if (/^\/article.asp$/i.test(path)) {
    // /article.asp?type=interne&nodoc=5043618
    // /article.asp?type=interne&nodoc=1637333
    // /article.asp?type=interne&nodoc=2408863
    if (param.nodoc) {
      result.title_id = param.nodoc;
      result.unitid = param.nodoc;
    }
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
  }
  return result;
});
