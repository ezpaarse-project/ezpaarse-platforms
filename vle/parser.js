#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform VLeBooks
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

  if (/^\/Vleweb\/Search\/Keyword$/i.test(path)) {
    // https://www.vlebooks.com/Vleweb/Search/Keyword?keyword=fiction
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/Vleweb\/Product\/Index\/([0-9]+)$/i.exec(path)) !== null) {
    // https://www.vlebooks.com/Vleweb/Product/Index/2048734
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if (/^\/vleweb\/Product\/DownloadCitations$/i.test(path)) {
    // https://www.vlebooks.com/vleweb/Product/DownloadCitations?ean=9780429666001
    result.rtype    = 'RECORD_VIEW';
    result.mime     = 'HTML';
    result.print_identifier = param.ean;
    result.unitid = param.ean;
  }

  return result;
});
