#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform EOL
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

  // let match;

  if (/^\/EolDb\/(FullTextSearch|CompanySearch|ScreeningSummaryHistorical|ContentsSearch).php$/i.test(path)) {
    // https://ssl.eoldb.jp/EolDb/FullTextSearch.php?search_case_id=300
    // https://ssl.eoldb.jp/EolDb/CompanySearch.php?search_case_id=5
    // https://ssl.eoldb.jp/EolDb/ScreeningSummaryHistorical.php?search_case_id=6
    // https://ssl.eoldb.jp/EolDb/ScreeningSummaryHistorical.php?search_case_id=7
    // https://ssl.eoldb.jp/EolDb/ContentsSearch.php?search_case_id=17
    // https://ssl.eoldb.jp/EolDb/ContentsSearch.php?search_case_id=18
    // https://ssl.eoldb.jp/EolDb/FullTextSearch.php?search_case_id=244
    // https://ssl.eoldb.jp/EolDb/FullTextSearch.php?search_case_id=245
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if (/^\/EolDb\/DocumentWindowSearchHistory.php$/i.test(path) && param.EDINET_CODE !== undefined && param.SID !== undefined && param.high_light !== undefined) {
    // https://ssl.eoldb.jp/EolDb/DocumentWindowSearchHistory.php?EDINET_CODE=E31306&document_type_code=100&SID=20675802&blank=1&high_light=%E5%B0%91%E5%AD%90%E5%8C%96&high_light_key=b6579b39d321c499e7a54f2796ffbb70
    // https://ssl.eoldb.jp/EolDb/DocumentWindowSearchHistory.php?EDINET_CODE=E00189&document_type_code=100&SID=20383286&blank=1&high_light=%E5%B0%91%E5%AD%90%E5%8C%96&high_light_key=b6579b39d321c499e7a54f2796ffbb70
    result.rtype    = 'REPORT';
    result.mime     = 'HTML';
    result.title_id = param.EDINET_CODE;
    result.unitid   = param.SID;

  } else if (/^\/EolDb\/DocumentWindowSearchHistory.php$/i.test(path) && param.EDINET_CODE !== undefined && param.SID !== undefined) {
    // https://ssl.eoldb.jp/EolDb/DocumentWindowSearchHistory.php?EDINET_CODE=E02166&document_type_code=6&SID=2390921&blank=1
    // https://ssl.eoldb.jp/EolDb/DocumentWindowSearchHistory.php?EDINET_CODE=E04492&document_type_code=6&SID=1023079&blank=1
    result.rtype    = 'REPORT';
    result.mime     = 'PDF';
    result.title_id = param.EDINET_CODE;
    result.unitid   = param.SID;
  }

  return result;
});
