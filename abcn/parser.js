#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Ancient Books
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

  if (/^\/docShike\/shikeSearchResult\.jspx$/i.test(path)) {
    // http://inscription.ancientbooks.cn/docShike/shikeSearchResult.jspx?column=txt&value=%E6%9D%B1%E6%BC%A2&libId=4
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if (/^\/docShike\/shikeRead\.jspx$/i.test(path)) {
    // http://inscription.ancientbooks.cn/docShike/shikeRead.jspx?id=1466812&searchValue=%E6%9D%B1%E6%BC%A2&libId=4
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.unitid   = param.id;
  } else if (/^\/docShike\/shikeNewsView\.jspx$/i.test(path)) {
    // http://inscription.ancientbooks.cn/docShike/shikeNewsView.jspx?id=1441252
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = param.id;
  }

  return result;
});
