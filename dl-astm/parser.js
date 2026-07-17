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
  let match;

  // use console.error for debuging
  // console.error(parsedUrl);

  if ((match = /\/books\/monograph\/chapter-pdf\/(\d+)\/([^/]+)\.pdf$/.exec(path))) {
    result.unitid = match[1] + '/' + match[2];
    result.rtype  = 'BOOK';
    result.mime   = 'PDF';
  } else if ((match = /\/books\/book\/chapter-pdf\/(\d+)/.exec(path))) {
    result.unitid = match[1];
    result.rtype  = 'BOOK';
    result.mime   = 'PDF';
  } else if ((match = /\/books\/monograph\/(\d+)\/chapter/.exec(path))) {
    result.unitid = match[1];
    result.rtype  = 'ARTICLE';
    result.mime   = 'HTML';
  } else if ((match = /\/article-pdf\/doi\/(.+)\.pdf$/.exec(path))) {
    result.unitid = match[1];
    result.rtype  = 'ARTICLE';
    result.mime   = 'PDF';
  } else if ((match = /\/article\/doi\/([^/]+\/[^/]+\/\d+)/.exec(path))) {
    result.unitid = match[1];
    result.rtype  = 'ARTICLE';
    result.mime   = 'HTML';
  } else if (/\/search-results/.test(path)) {
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';
  }

  return result;
});
