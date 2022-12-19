#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Sankei Shimbun
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

  if (/^\/kijisearch\/detail\.html$/i.test(path)) {
    // https://shimbun-data.denshi.sankei.co.jp/kijisearch/detail.html?DSE202211240001637ef
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid = parsedUrl.search.replace('?', '');

  } else if (/^\/hv\/index_viewer\.html$/i.test(path)) {
    // https://shimbun-data.denshi.sankei.co.jp/hv/index_viewer.html?pkg=jp.co.sankei.denshi.pc&mcd=TSM&npd=20221122&uid=2000000240&tkn=ac4e979f32d5f4865d0bf32c75e4656f0c857459&pn=28&checkidsetup=true&chiiki=no
    result.rtype    = 'IMAGE';
    result.mime     = 'HTML';
  } else if (/^\/kijisearch\/main\.html$/i.test(path)) {
    // https://shimbun-data.denshi.sankei.co.jp/kijisearch/main.html#!keyword=%25E4%25B8%2580%25E5%25B8%25AF%25E4%25B8%2580%25E8%25B7%25AF&page=1&fromDate=1992-09-07&toDate=2022-11-22&sort=dt_d&searchType=0&baitaiCds=TSM%2CDSM%2CTSE%2CDSE
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
