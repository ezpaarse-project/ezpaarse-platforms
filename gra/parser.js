#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Global Arbitration Review
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

  if ((match = /^\/[a-z]+\/([a-z-]+)\/[a-z-]+\/download$/i.exec(path)) !== null) {
    // https://globalarbitrationreview.com/guide/the-guide-construction-arbitration/fourth-edition/download
    result.rtype    = 'BOOK';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid = match[1];
  } else if ((match = /^\/search$/i.exec(path)) !== null) {
    // https://globalarbitrationreview.com/search?search=covid
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  
  } else if ((match = /^\/[a-z]+\/([a-z-]+)\/[a-z-]+\/article\/([a-z-]+)$/i.exec(path)) !== null) {
    // https://globalarbitrationreview.com/guide/the-guide-construction-arbitration/fourth-edition/article/the-contract-the-foundation-of-construction-projects
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[2];
  } else if ((match = /^\/([a-z-]+)\/([a-z-]+)$/i.exec(path)) !== null) {
    // https://globalarbitrationreview.com/coronavirus/winds-of-change-latin-americas-shifting-regulatory-landscape
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[2];
  } else if ((match = /^\/([a-z-]+)$/i.exec(path)) !== null) {
    // https://globalarbitrationreview.com/salomon-urges-focus-issues-be-decided
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1];    
  }

  return result;
});
