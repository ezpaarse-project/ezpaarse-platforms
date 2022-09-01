#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform JIIA
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

  let match;

  if ((match = /^\/result\/index\.html$/i.exec(path)) !== null) {
    // https://www.jiia.or.jp/result/index.html#/?ajaxUrl=%2F%2Fmf2apr01.marsflag.com%2Fjiia_jic__ja_2__ja%2Fx_search.x&ct=&d=&doctype=all&htmlLang=en&imgsize=1&page=1&pagemax=10&q=war&sort=0
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/research\/[0-9]{4}\/[0-9]{2}\/[0-9]{2}\/([0-9a-z]+)\.pdf$/i.exec(path)) !== null) {
    // https://www.jiia.or.jp/research/2022/05/13/2021USMilitaryPower.pdf
    result.rtype    = 'BOOK';
    result.mime     = 'PDF';
    result.unitid   = match[1];
  } else if ((match = /^\/strategic_comment\/([0-9]+)-([0-9]+)\.html$/i.exec(path)) !== null) {
    // https://www.jiia.or.jp/strategic_comment/2022-08.html
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
  } else if ((match = /^\/research-report\/([a-z0-9-]+)\.html$/i.exec(path)) !== null) {
    // https://www.jiia.or.jp/research-report/indo-pacific-fy2021-06.html
    result.rtype    = 'REPORT';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  }

  return result;
});
