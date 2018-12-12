#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform American Psychological Association
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

  if (/^\/api\/request\/abstract/i.test(path)) {
    // http://psycnet.apa.org:80/api/request/abstract.get
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
  } else if ((match = /^\/record\/([0-9-]+)$/i.exec(path)) !== null) {
    // http://psycnet.apa.org/record/1991-01082-001
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/PsycBOOKS\/toc\/([0-9]+)$/i.exec(path)) !== null) {
    // http://psycnet.apa.org:80/PsycBOOKS/toc/11855
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if (/^\/api\/request\/browse/i.test(path)) {
    // http://psycnet.apa.org:80/api/request/browsePB.getBooksByTitle
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if (/^\/api\/request\/search/i.test(path)) {
    // http://psycnet.apa.org:80/api/request/browsePB.getBooksByTitle
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/search\/display$/i.exec(path)) !== null) {
    // http://psycnet.apa.org:80/search/display?id=78828c75-855f-6e08-3b54-0f429d4988f8&recordId=1&tab=all&page=1&display=25&sort=PublicationYearMSSort%20desc,AuthorSort%20asc&sr=1
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';
    result.title_id = param.recordId;
    result.unitid   = param.recordId;
  } else if ((match = /^\/fulltext\/([0-9-]+).pdf/i.exec(path)) !== null) {
    // http://psycnet.apa.org:80/fulltext/2017-09577-010.pdf?dl=true
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid   = match[1];
  }

  return result;
});
