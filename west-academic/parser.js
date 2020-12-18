#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform West Academic
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

  let match;

  if ((match = /^\/search$/i.exec(path)) !== null) {
    // https://subscription.westacademic.com/search?q=LSAT
    // https://subscription.westacademic.com/Search?subjectFilter=2&sort=document-views
    // https://subscription.westacademic.com/Book/Detail/26096?q=Chapter%20Two%20Intestacy%3A%20An%20Estate%20Plan%20by%20Default&sort=best-match
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  } else if ((match = /^\/Book\/Detail\/([0-9]+)$/i.exec(path)) !== null) {
    if (param.q) {
      // https://subscription.westacademic.com/Book/Detail/26096?q=Chapter%20Two%20Intestacy%3A%20An%20Estate%20Plan%20by%20Default&sort=best-match
      result.rtype = 'SEARCH';
      result.mime = 'HTML';
    } else {
      // https://subscription.westacademic.com/Book/Detail/23048
      // https://subscription.westacademic.com/Book/Detail/20346#toc-ta
      result.rtype = 'TOC';
      result.mime = 'HTML';
    }
    result.title_id = match[1];
    result.unitid = match[1];
  } else if ((match = /^\/book\/Preview$/i.exec(path)) !== null) {
    // https://subscription.westacademic.com/book/Preview?chapterUri=%2Fdata%2Fbooks%2F26096%2Fdocbook%2F07_chapter03.xml#ch3
    // https://subscription.westacademic.com/book/Preview?chapterUri=%2Fdata%2Fbooks%2F26096%2Fdocbook%2F13_chapter09.xml
    result.rtype = 'BOOK_SECTION';
    result.mime = 'HTML';
    const chapterMatch = /^\/data\/books\/([0-9]+)\/docbook\/(.+).xml$/i.exec(param.chapterUri);

    if (chapterMatch) {
      result.unitid = chapterMatch[1];
      result.title_id = `${chapterMatch[1]}-${chapterMatch[2]}`;
    }
  }

  return result;
});
