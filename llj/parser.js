#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Law Library Japan
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

  if (/^\/syoseki\/SearchList\.aspx$/i.test(path)) {
    // https://ls.lawlibrary.jp/syoseki/SearchList.aspx?jc=4800&st=2&lpn=0
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    result.db_id = param.jc;

  } else if (/^\/syoseki\/LinkHonbunPDF\.aspx$/i.test(path)) {
    // https://ls.lawlibrary.jp/syoseki/LinkHonbunPDF.aspx?jc=4800&st=2&bi=z18817009-00-081492160
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = param.bi;
    result.db_id = param.jc;
  } else if (/^\/syoseki\/Syoshi\.aspx$/i.test(path)) {
    // https://ls.lawlibrary.jp/syoseki/Syoshi.aspx?jc=4800&st=2&lpn=0&bi=z18817009-00-022252151
    result.rtype    = 'RECORD_VIEW';
    result.mime     = 'HTML';
    result.unitid   = param.bi;
    result.db_id = param.jc;
  } else if (/^\/syoseki\/Honbun\.aspx$/i.test(path)) {
    // https://ls.lawlibrary.jp/syoseki/Honbun.aspx?jc=4800&st=2&lpn=0&bi=z18817009-00-071682047
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = param.bi;
    result.db_id = param.jc;
  }

  return result;
});
