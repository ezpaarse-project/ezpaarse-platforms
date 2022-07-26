#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Maruzen
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

  if ((match = /^\/elib\/html\/SeriesDetail\/Id\/([0-9]+)$/i.exec(path)) !== null) {
    // https://elib.maruzen.co.jp/elib/html/SeriesDetail/Id/3000074092?22
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/elib\/html\/Viewer\/Id\/([0-9]+)(?:\/Page\/([0-9]+))?$/i.exec(path)) !== null) {
    // https://elib.maruzen.co.jp/elib/html/Viewer/Id/3000053006?7
    // https://elib.maruzen.co.jp/elib/html/Viewer/Id/3000053006/Page/16?2
    result.rtype    = 'BOOK';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if (/^\/elib\/html\/BookListDetail\/search\/true$/i.test(path)) {
    // https://elib.maruzen.co.jp/elib/html/BookListDetail/search/true?14
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
