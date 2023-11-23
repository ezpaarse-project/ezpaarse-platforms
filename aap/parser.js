#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform American Academy of Pediatrics
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/[a-z]+\/book\/chapter-pdf\/([0-9]+\/([a-z0-9]+)_[a-z0-9]+_([0-9]+)(_[0-9]+)?_[a-z]+)\.pdf$/i.exec(path)) !== null) {
    // https://publications.aap.org/redbook/book/chapter-pdf/1543750/rbo2021_s4_002_001_en.pdf
    // https://publications.aap.org/redbook/book/chapter-pdf/1540678/rbo2021_s1_001_en.pdf
    result.rtype = 'BOOK_SECTION';
    result.mime = 'PDF';
    result.title_id = match[2];
    result.unitid = match[1];
    result.first_page = match[3];
  } else if ((match = /^\/[a-z]+\/book\/([0-9]+\/chapter\/([0-9]+)\/([a-z-]+))$/i.exec(path)) !== null) {
    // https://publications.aap.org/redbook/book/347/chapter/5748295/Copyright
    // https://publications.aap.org/redbook/book/347/chapter/5748957/Prologue
    // https://publications.aap.org/redbook/book/347/chapter/5758401/Antimicrobial-Resistance
    result.rtype = 'BOOK_SECTION';
    result.mime = 'HTML';
    result.title_id = match[3];
    result.pii = match[2];
    result.unitid = match[1];

  } else if ((match = /^\/[a-z]+\/book\/([0-9]+\/([a-z0-9-]+))$/i.exec(path)) !== null) {
    // https://publications.aap.org/redbook/book/347/Red-Book-2021-2024-Report-of-the-Committee-on
    result.rtype = 'BOOK';
    result.mime = 'HTML';
    result.title_id = match[2];
    result.unitid = match[1];
  } else if ((match = /^\/view-[a-z]+\/figure\/([0-9]+)\/[a-z0-9_]+\.tif$/i.exec(path)) !== null) {
    // https://publications.aap.org/view-large/figure/8232920/pedsinreview_20180330fig4.tif
    result.rtype = 'IMAGE';
    result.mime = 'HTML';
    result.unitid = match[1];
  } else if ((match = /^\/[a-z]+\/article\/[0-9]+\/[0-9]+\/[a-z0-9]+\/([0-9]+)\/[a-z-]+$/i.exec(path)) !== null) {
    // https://publications.aap.org/neoreviews/article/23/7/e472/188384/Prematurity-and-Congenital-Heart-Disease-A
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.unitid = match[1];
  } else if ((match = /^\/[a-z]+\/article-abstract\/[0-9]+\/[0-9]+\/[a-z0-9]+\/([0-9]+)\/[a-z-]+$/i.exec(path)) !== null) {
    // https://publications.aap.org/hospitalpediatrics/article-abstract/12/3/e110/184667/Kawasaki-Disease-Outcomes-It-s-Not-Just-the-Heart?redirectedFrom=fulltext
    result.rtype = 'ABS';
    result.mime = 'HTML';
    result.unitid = match[1];
  } else if (/^\/search-results$/i.test(path)) {
    // https://publications.aap.org/search-results?page=1&q=heart
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  }

  return result;
});
