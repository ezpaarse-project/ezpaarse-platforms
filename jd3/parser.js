#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform J Dream 3
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

  //let match;

  if (/^\/jds\/dj\/HighpriceCheckDownload([0-9]+)$/i.test(path)) {
    // https://dbs.g-search.or.jp/jds/dj/HighpriceCheckDownload003?ssid=&fromNumber=1&toNumber=20&screenID=STM_SRC_103&lnumber=L1
    result.rtype    = 'RECORD_BUNDLE';
    result.mime     = 'PDF';
  } else if (/^\/jds\/dj\/quick-search-init$/i.test(path)) {
    // https://dbs.g-search.or.jp/jds/dj/quick-search-init?ssid=&screenID=STM_SRC_002
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if (/^\/jds\/dj\/AnswerDownload([0-9]+)$/i.test(path)) {
    // https://dbs.g-search.or.jp/jds/dj/AnswerDownload003?ssid=
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
