#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Books in Print
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param = parsedUrl.query || {};

  if (/^\/Search\/Results$/i.test(path)) {
    // /Search/Results?q=quicksearch-title%3A%5Byoga%5D&op=1&qs=1
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  } else if (/^\/TitleDetail\/DetailedView$/i.test(path)) {
    // /TitleDetail/DetailedView?hreciid=|16211233|7177059&mc=ZAF
    result.rtype = 'RECORD_VIEW';
    result.mime = 'HTML';
    result.unitid = param.hreciid;
  }

  return result;
});
