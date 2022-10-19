#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform MIT Press Direct
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

  if ((match = /^\/([a-z]+)\/article\/([0-9]+)\/([0-9]+)\/([0-9]+)\/[0-9]+\/([a-z0-9-]+)$/i.exec(path)) !== null) {
    // https://direct.mit.edu/qss/article/1/2/675/96133/Citation-concept-analysis-CCA-of-Robert-K-Merton-s?searchresult=1
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.vol = match[2];
    result.issue = match[3];
    result.spage = match[4];
    result.unitid = match[1] + '-' + match[2] + '-' + match[3] + '-' + match[4];

  } else if  ((match = /^\/([a-z]+)\/article-pdf\/([0-9]+)\/([0-9]+)\/([0-9]+)\/[0-9]+\/(.+)$/i.exec(path)) !== null) {
    // https://direct.mit.edu/qss/article-pdf/1/2/675/1885761/qss_a_00029.pdf&hl=en&sa=T&oi=ucasa&ct=ufr&ei=RCVPY5vmCpCXywTDn5S4DA&scisig=AAGBfm24IIAYBlO-We0ogpow1Ai-IhTG2g
    result.rtype = 'ARTICLE';
    result.mime = 'PDF';
    result.title_id = match[1];
    result.vol = match[2];
    result.issue = match[3];
    result.spage = match[4];
    result.unitid = match[1] + '-' + match[2] + '-' + match[3] + '-' + match[4] + '-pdf';
  } else if ((match = /^\/books\/book\/([0-9]+)\/([0-9a-z-]+)$/i.exec(path)) !== null) {
    // https://direct.mit.edu/books/book/2683/The-Big-Book-of-Concepts
    result.rtype    = 'BOOK';
    result.mime     = 'HTML';
    result.title_id = match[2];
    result.unitid   = match[1];
  } else if ((match = /^\/books\/monograph\/([0-9]+)\/chapter-abstract\/([0-9]+)\/([0-9a-z-]+)$/i.exec(path)) !== null) {
  // https://direct.mit.edu/books/monograph/5359/chapter-abstract/3884051/How-to-Read-This-Book?redirectedFrom=fulltext
    result.rtype    = 'BOOK_CHAPTERS_BUNDLE';
    result.mime     = 'HTML';
    result.title_id = match[2];
    result.unitid   = match[1] + '-' + match[2];
  }

  return result;
});
