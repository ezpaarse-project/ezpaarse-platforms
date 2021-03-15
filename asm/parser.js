#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform American Society of Metals
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

  if ((match = /^\/([a-z-]+)\/search-results$/i.exec(path)) !== null) {
    // https://dl.asminternational.org/handbooks/search-results?page=1&q=alloy&fl_SiteID=1000003
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/([a-z-]+)\/article\/([0-9]+)\/([0-9]+)\/([0-9a-z-]+)\/([0-9]+)\/([a-z0-9-]+)$/i.exec(path)) !== null) {
    // https://dl.asminternational.org/alloy-digest/article/41/1/Ni-400/5523/TOPHEL-ALLOY-NIAL-ALLOY-NICROSIL-NISIL-ALLOYS-20?searchresult=1
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
  } else if ((match = /^\/([a-z-]+)\/book\/([0-9]+)\/([0-9a-z-]+)$/i.exec(path)) !== null) {
    // https://dl.asminternational.org/handbooks/book/36/Alloy-Phase-Diagrams
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[3];
  } else if ((match = /^\/([a-z-]+)\/book\/([0-9]+)\/chapter\/([0-9]+)\/([0-9a-z-]+)$/i.exec(path)) !== null) {
    // https://dl.asminternational.org/handbooks/book/36/chapter/474152/Introduction-to-Phase-Diagrams-1
    // https://dl.asminternational.org/failure-analysis/book/84/chapter/1868788/Explosion-of-the-Terra-Ammonium-Nitrate-Plant-Port
    result.rtype    = 'BOOK_SECTION';
    result.mime     = 'HTML';
  }

  return result;
});
