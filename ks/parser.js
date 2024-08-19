#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Kyobo Scholar
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

  if ((match = /^\/volume\/detail\/([0-9]+)$/i.exec(path)) !== null) {
    // https://scholar.kyobobook.co.kr/volume/detail/158200
    // https://scholar.kyobobook.co.kr/volume/detail/137447
    result.rtype    = 'ISSUE';
    result.mime     = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/academy\/detail\/([0-9]+)$/i.exec(path)) !== null) {
    // https://scholar.kyobobook.co.kr/academy/detail/20290
    // https://scholar.kyobobook.co.kr/academy/detail/20285
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if ((match = /^\/journal\/detail\/([0-9]+)$/i.exec(path)) !== null) {
    // https://scholar.kyobobook.co.kr/journal/detail/2091
    // https://scholar.kyobobook.co.kr/journal/detail/3143
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if ((match = /^\/pdfViewer\/([a-zA-Z0-9-=_]+)$/i.exec(path)) !== null) {
    // https://wviewer.kyobobook.co.kr/pdfViewer/MjMxOTJlZmYwZWJiNGZhNTJiMDU5ZDlkMDAyM2I1ODQyMjg5Nzg2ZTczMzc1NWRiYmI1ZWQ0ZjAzODc0ODZkYg==
    // https://wviewer.kyobobook.co.kr/pdfViewer/YjRiYTcyN2RmZmNkMTNhMTU2Y2E1ZDQ0ZjA2YzlmMDRlZGE5ODA1OWI1MjJlMzUzY2NiNDUyNmIxZGNjNTQxYQ==
    result.rtype    = 'BOOK';
    result.mime     = 'PDF';
    result.unitid   = match[1];

  } else if (/^\/search\/article\/total$/i.test(path)) {
    // https://scholar.kyobobook.co.kr/search/article/total?keyword=culture
    // https://scholar.kyobobook.co.kr/search/article/total?keyword=metaverse
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/article\/detail\/([0-9]+)$/i.exec(path)) !== null) {
    // https://scholar.kyobobook-co.kr/article/detail/4010068538557
    // https://scholar.kyobobook.co.kr/article/detail/4010023232997
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  }

  return result;
});
