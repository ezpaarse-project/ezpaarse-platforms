#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Journal of Clinical Epidemiology
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

  if (/^\/action\/doSearchSecure$/i.test(path)) {
    // https://www.jclinepi.com:443/action/doSearchSecure?searchType=quick&searchText=potato&occurrences=all&journalCode=jce&searchScope=fullSite&code=jce-site
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/article\/([A-Z0-9-)(]+)\/([a-z]+)$/i.exec(path)) !== null) {
    // https://www.jclinepi.com:443/article/S0895-4356(17)30015-X/abstract
    if (match[2] === 'abstract') {
      result.rtype = 'ABS';
      result.mime  = 'HTML';
    } else if (match[2] === 'fulltext') {
      result.rtype = 'ARTICLE';
      result.mime  = 'HTML';
    } else if (match[2] === 'pdf') {
      result.rtype = 'ARTICLE';
      result.mime  = 'PDF';
    } else if (match[2] === 'references') {
      result.rtype = 'REF';
      result.mime  = 'HTML';
    }
    result.pii      = match[1];
    result.unitid   = match[1];
  } else if (/^\/action\/showFullTextImages$/i.test(path)) {
    // https://www.jclinepi.com:443/action/showFullTextImages?pii=S0895-4356%2801%2900414-0
    result.rtype    = 'IMAGE';
    result.mime     = 'HTML';
    result.pii      = param.pii;
    result.unitid   = param.pii;
  }

  return result;
});
