#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform ASTM Digital Library
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  //let param  = parsedUrl.query || {};
  let match;

  // use console.error for debuging
  // console.error(parsedUrl);

  if ((match = /^\/books\/book\/chapter-pdf\/([0-9]+)\/([a-zA-Z0-9-_]+)\.pdf$/i.exec(path)) !== null) {
    // /books/book/chapter-pdf/13691/10_1520_mnl12086d.pdf
    // /books/book/chapter-pdf/33286/tr4_1fm.pdf
    // /books/book/chapter-pdf/198088/tr5_1fm.pdf

    result.rtype  = 'BOOK_CHAPTERS_BUNDLE';
    result.mime   = 'PDF';
    result.unitid = match[1];
  } else if ((match = /^\/books\/monograph\/chapter-pdf\/([0-9]+)\/([a-zA-Z0-9-_]+)\.pdf$/i.exec(path)) !== null) {
    // /books/monograph/chapter-pdf/206203/10_1520_mono62014fm.pdf

    result.rtype  = 'BOOK_CHAPTERS_BUNDLE';
    result.mime   = 'PDF';
    result.unitid = `${match[1]}/${match[2]}`;
  } else if ((match = /^\/books\/monograph\/([0-9]+)\/chapter\/[0-9]+\/([a-zA-Z0-9-_]+)/i.exec(path)) !== null) {
    // /books/monograph/1733/chapter/616169/Chapter-3-Xenograft-Use-in-Orthopedic-Surgery

    result.rtype  = 'BOOK_CHAPTERS_BUNDLE';
    result.mime   = 'HTML';
    result.unitid = match[1];
  } else if ((match = /^\/jte\/article-pdf\/doi\/([^/]+\/[^/]+)\/([0-9]+)\/([a-zA-Z0-9-_]+)\.pdf$/i.exec(path)) !== null) {
    // /jte/article-pdf/doi/10.1520/JTE20250226/234638/jte20250226.pdf

    result.doi    = match[1];
    result.unitid = match[2];
    result.rtype  = 'ARTICLE';
    result.mime   = 'PDF';
  } else if ((match = /^\/jte\/article\/doi\/([^/]+\/[^/]+)\/([0-9]+)\/([a-zA-Z0-9-_]+)/i.exec(path)) !== null) {
    // /jte/article/doi/10.1520/JTE20250226/32400/A-Critical-Review-of-Engineering-Properties-of?searchresult=1

    result.doi    = match[1];
    result.unitid = match[2];
    result.rtype  = 'ARTICLE';
    result.mime   = 'HTML';
  } else if (/^\/search-results$/i.test(path)) {
    // /search-results?page=1&q=environmental%20effects

    result.rtype = 'SEARCH';
    result.mime  = 'HTML';
  }

  return result;
});
