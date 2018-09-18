#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Journal of Urology
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

  if ((match = /^\/action\/doSearchSecure$/i.exec(path)) !== null) {
    // https://www.jurology.com:443/action/doSearchSecure?searchType=quick&searchText=freud&occurrences=all&journalCode=juro&searchScope=fullSite&code=juro-site
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/article\/([A-Z0-9-()]+)\/([a-z]+)$/i.exec(path)) !== null) {
    // https://www.jurology.com:443/article/S0022-5347(18)43403-9/fulltext
    result.rtype    = 'ARTICLE';
    result.pii      = match[1];
    result.unitid   = match[1] + '/' + match[2];
    switch (match[2]) {
    case 'fulltext':
      result.mime = 'HTML';
      break;
    case 'pdf':
      result.mime = 'PDF';
      break;
    case 'ppt':
      result.mime = 'MISC';
      break;
    }
  } else if (/^\/current|issues|inpress|supplements|content/i.test(path)) {
    // https://www.jurology.com:443/current
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
  } else if ((match = /^\/issue\/([A-Z0-9()-]+)$/i.exec(path)) !== null) {
    // https://www.jurology.com:443/issue/S0022-5347(18)X0002-0
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.pii      = match[1];
  }

  return result;
});
