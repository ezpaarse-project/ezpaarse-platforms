#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Jamas
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

  if (/^\/search\/do\/detail\/sidx\/([0-9]+)$/i.test(path)) {
    // https://search.jamas.or.jp/search/do/detail/sidx/0
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';

  } else if (/^\/link\/bc\/detail\/sidx\/([0-9]+)$/i.test(path)) {
    // https://search.jamas.or.jp/link/bc/detail/sidx/0
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
  } else if (/^\/search\/do(:?\/exec)?$/i.test(path)) {
    // https://search.jamas.or.jp/search/do
    // https://search.jamas.or.jp/search/do/exec?h=1&field=word&query=%238
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
