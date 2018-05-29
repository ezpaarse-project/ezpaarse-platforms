#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform American Journal of Medicine
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

  if ((match = /^\/article\/(.*)\/fulltext$/i.exec(path)) !== null) {
    // https://www.amjmed.com:443/article/S0002-9343(17)30403-5/fulltext
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1];
    result.pii      = match[1].replace(/[-()]/g, '');
  } else if ((match = /^\/article\/(.*)\/pdf$/i.exec(path)) !== null) {
    // https://www.amjmed.com:443/article/S0002-9343(18)30008-1/pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[1];
    result.unitid   = match[1];
    result.pii      = match[1].replace(/[-()]/g, '');
  } else if ((match = /^\/article\/(.*)\/ppt$/i.exec(path)) !== null) {
    // https://www.amjmed.com:443/article/S0002-9343(18)30409-1/ppt
    result.rtype    = 'SUPPL';
    result.mime     = 'MISC';
    result.title_id = match[1];
    result.unitid   = match[1];
    result.pii      = match[1].replace(/[-()]/g, '');
  } else if (/content|current|issue|issues|mmaeducation|supplements/i.test(path)) {
    // https://www.amjmed.com:443/issues
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    if ((match = /^\/issue\/(.*)$/i.exec(path)) !== null) {
      result.title_id = match[1];
      result.unitid   = match[1];
    }
  } else if (/^\/action\/doSearch/i.test(path)) {
    // https://www.amjmed.com:443/action/doSearchSecure?searchType=quick&searchText=ethanol&occurrences=all&journalCode=ajm&searchScope=fullSite&code=ajm-site
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  }

  return result;
});
