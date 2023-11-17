#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');
const URL = require('url');

/**
 * Recognizes the accesses to the platform Webpat
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

  const hash = parsedUrl.hash.replace('#', '');
  const hashedUrl = URL.parse(hash, true);
  const hashPath = hashedUrl.pathname;
  let hashParam = hashedUrl.query || {};

  // use console.error for debuging
  //console.error(parsedUrl);


  if (/^\/Home\/Detail$/i.test(path)) {
    // https://webpat.tw/Home/Detail#patent-info?esId=tw_I230535_0093104381&indexName=pat_tw_2005_v15&database=TW&rowIndex=0&storageId=resultStorage_invention%20plant%20reissue%20sir%20defensive_1698072438661&highlightStorgeId=&displayType=
    // https://webpat.tw/Home/Detail#patent-info?esId=us_06742910_10279921&indexName=pat_us_2005_v5&database=US&rowIndex=2&storageId=resultStorage_invention%20reissue%20sir%20defensive%20plant_1698081439771&highlightStorgeId=TempHighlight-1698081388850&displayType=
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.unitid = hashParam.esId;

  } else if (/^\/$/i.test(path) && hashPath == '/search-result') {
    // https://webpat.tw/#/search-result
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
