#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform KinoDen
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

  if ((match = /^\/aUnivLibrary\/bookdetail\/p\/([a-z0-9]+)$/i.exec(path)) !== null) {
    // https://kinoden.kinokuniya.co.jp/aUnivLibrary/bookdetail/p/KP00062477 - AUDIO/HTML
    // https://kinoden.kinokuniya.co.jp/aUnivLibrary/bookdetail/p/KP00065110 - AUDIO/HTML
    // https://kinoden.kinokuniya.co.jp/aUnivLibrary/bookdetail/p/KP00019593 - ARTICLE/EPUB
    // https://kinoden.kinokuniya.co.jp/aUnivLibrary/bookdetail/p/KP00036445 - ARTICLE/PDF
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/book\/p\/([a-z0-9]+)$/i.exec(path)) !== null) {
    // https://breader.cloud/book/p/KP00054403?code=aUnivLibrary
    // https://breader.cloud/book/p/KP00078057?code=aUnivLibrary
    result.rtype    = 'BOOK';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if (/^\/aUnivLibrary\/search\/[a-z0-9=/]+$/i.test(path)) {
    // https://kinoden.kinokuniya.co.jp/aUnivLibrary/search/eyJkZXRhaWxzIjp7ImZvcm1hdCI6WyI0Il0sInR5cGUiOlsiMSIsIjIiXX0sImlzRGV0YWlsIjp0cnVlLCJvcmRlckJ5U2NvcmUiOjB9/Kg==/MA==
    // https://kinoden.kinokuniya.co.jp/aUnivLibrary/search/eyJkZXRhaWxzIjp7InRpdGxlIjoi6Zu75rCXIiwiZm9ybWF0IjpbIjEiLCIyIiwiMyIsIjQiXSwidHlwZSI6WyIxIiwiMiJdfSwiaXNEZXRhaWwiOnRydWUsImlzTW9iaWxlRmlsdGVyT3BlbiI6ZmFsc2UsIm9yZGVyQnlTY29yZSI6MCwib25seUxpYnJhcnkiOmZhbHNlLCJhdXRob3IiOiIiLCJwdWJsaXNoZXIiOiIiLCJzZXJpZXMiOiIiLCJwdWJZZWFyIjoiIiwibmRjIjoiIiwiZm9ybWF0IjoiMSIsInR5cGUiOiIiLCJ0dHMiOmZhbHNlLCJkb3dubG9hZCI6ZmFsc2V9/Kg==/MA==
    // https://kinoden.kinokuniya.co.jp/aUnivLibrary/search/eyJkZXRhaWxzIjp7ImZvcm1hdCI6WyIzIl0sInR5cGUiOlsiMSIsIjIiXX0sImlzRGV0YWlsIjp0cnVlLCJvcmRlckJ5U2NvcmUiOjB9/Kg==/MA==
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
