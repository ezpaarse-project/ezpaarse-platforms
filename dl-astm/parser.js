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
    result.rtype  = 'BOOK_CHAPTERS_BUNDLE';
    result.mime   = 'PDF';
    result.unitid = match[1];

  } else if ((match = /^\/books\/monograph\/chapter-pdf\/([0-9]+)\/([a-zA-Z0-9-_]+)\.pdf$/i.exec(path)) !== null) {
    result.rtype  = 'BOOK_CHAPTERS_BUNDLE';
    result.mime   = 'PDF';
    result.unitid = `${match[1]}/${match[2]}`;

  } else if ((match = /^\/books\/monograph\/([0-9]+)\/chapter\/[0-9]+\/([a-zA-Z0-9-_]+)/i.exec(path)) !== null) {
    result.rtype  = 'BOOK_CHAPTERS_BUNDLE';
    result.mime   = 'HTML';
    result.unitid = match[1];

  } else if ((match = /^\/jte\/article-pdf\/doi\/([^/]+\/[^/]+)\/([0-9]+)\/([a-zA-Z0-9-_]+)\.pdf$/i.exec(path)) !== null) {
    result.doi    = match[1];
    result.unitid = match[2];
    result.rtype  = 'ARTICLE';
    result.mime   = 'PDF';

  } else if ((match = /^\/jte\/article\/doi\/([^/]+\/[^/]+)\/([0-9]+)\/([a-zA-Z0-9-_]+)/i.exec(path)) !== null) {
    result.doi    = match[1];
    result.unitid = match[2];
    result.rtype  = 'ARTICLE';
    result.mime   = 'HTML';

  } else if (/^\/search-results$/i.test(path)) {
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';
  }

  return result;
});
