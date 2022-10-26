#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Newslink
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
  if (/^\/user\/UserESearch\.action$/i.test(path)) {
    // https://www.newslink.sg/user/UserESearch.action?queryCriteria.digitalType=all
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if (/^\/user\/OrderArticleRequest\.action$/i.test(path)) {
    // https://www.newslink.sg/user/OrderArticleRequest.action?order=&month=03&year=2022&date=17&docLanguage=en&documentId=nica_ST_2022_doc7k5ki29i9xl1ly1p5r5
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = param.documentId;
  }

  return result;
});
