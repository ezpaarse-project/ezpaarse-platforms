#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Isho
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

  if ((match = /^\/journal\/detail\/pdf\/(10[.][0-9]{4,}[^\\s"/<>]*\/[^\\s"<>]+)$/i.exec(path)) !== null) {
    // https://webview.isho.jp/journal/detail/pdf/10.11477/mf.1409102550
    // https://webview.isho.jp/journal/detail/pdf/10.11477/mf.1404200677?searched=1
    result.rtype    = 'ISSUE';
    result.mime     = 'PDF';
    result.doi = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/journal\/detail\/abs\/(10[.][0-9]{4,}[^\\s"/<>]*\/[^\\s"<>]+)$/i.exec(path)) !== null) {
    // https://webview.isho.jp/journal/detail/abs/10.11477/mf.1436901442?searched=1
    // https://webview.isho.jp/journal/detail/abs/10.11477/mf.1409102550?searched=1
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.doi = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/journal\/toc\/(([0-9]+)\/([0-9]+)\/([0-9]+))$/i.exec(path)) !== null) {
    // https://webview.isho.jp/journal/toc/03869865/77/10
    // https://webview.isho.jp/journal/toc/18834833/15/3
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[2];
    result.vol = match[3];
    result.issue = match[4];
    result.unitid   = match[1];
  } else if (/^\/search\/result$/i.test(path)) {
    // https://webview.isho.jp/search/result?phrase=heart&target=phrase&contentType=1&range=this&searchType=1
    // https://webview.isho.jp/search/result?phrase=Pharmacy&target=phrase&contentType=1&range=this&searchType=1
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
