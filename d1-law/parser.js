#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform D1 Law
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

  if (/^\/dh_g\/jyoubun\.do$/i.test(path) && param.callEnkaku) {
    // https://ghk-jg-d1-law.com/dh_g/jyoubun.do?actionType=init&callEnkaku=1&sikouDate=5040808&houreiCd=436561121183&leftKoubangou=1&searchFileId=resultid20220810045907.821&leftAllCount=&UNIQUE_KEY=1660075148245
    // https://ghk-jg-d1-law.com/dh_g/jyoubun.do?actionType=init&sikouDate=5040808&houreiCd=141808888830&ichiKey=h:bS10:::3:%E5%88%A5%E8%A1%A8%E7%AC%AC%E4%B8%80&UNIQUE_KEY=1660140718477&sedaiNo=&enkakuType=#ID_26-0
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid = param.UNIQUE_KEY;

  } else if (/^\/dh_g\/jyoubun\.do$/i.test(path)) {
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.unitid = param.UNIQUE_KEY;
  } else if (/^\/dh_p\/cross_search\.html$/i.test(path)) {
    // https://d1l-ptl-d1-law.com/dh_p/cross_search.html?conditon=free
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
