#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Magazine Plus
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

  if (/^\/nos\/nweb\/magazine\/search\/$/i.test(path)) {
    // https://web.nichigai.jp/nos/nweb/magazine/search/?lang=0&amode=2&smode=1&appname=Netscape&version=5&kywd=anime&sort_exp=2&disp_exp=20
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if (/^\/nos\/nweb\/magazine\/detail\/$/i.test(path)) {
    // https://web.nichigai.jp/nos/nweb/magazine/detail/?lang=0&reqCode=fromlist&amode=11&smode=1&id=Z032042390&opkey=M165048755017423&start=1&totalnum=465&listnum=0&list_disp=20&list_sort=2&chk_st=0&check=00000000000000000000
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.unitid   = param.id;
  } else if (/^\/nos\/nweb\/magazine\/detail_vol\/$/i.test(path)) {
    // https://web.nichigai.jp/nos/nweb/magazine/detail_vol/?lang=0&reqCode=fromdetail&amode=12&smode=1&id=000007517079&cls_exp=ZS00375109&opkey=M165089523326985&start=1
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = param.id;
  }

  return result;
});
