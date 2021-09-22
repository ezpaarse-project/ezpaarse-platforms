#!/usr/bin/env node

'use strict';
let Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Le Robert
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param  = parsedUrl.query || {};

  if (/^\/robertArticle.asp$/i.test(path)) {
    // http://pr.bvdep.com/robertArticle.asp
    result.rtype = 'ENCYCLOPAEDIA_ENTRY';
    result.mime = 'HTML';
    if (param.id) {
      result.unitid = param.id;
    }
  } else if (/^\/robertSearch.asp$/i.test(path)) {
    // /robertSearch.asp?q=grenouille&d=1&type=ext&version=4
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  }

  return result;
});

