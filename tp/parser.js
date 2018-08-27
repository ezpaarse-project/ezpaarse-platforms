#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Transplantation Proceedings
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
  let pii;

  if (/^\/action\/doSearchSecure$/i.test(path)) {
    // https://www.transplantation-proceedings.org:443/action/doSearchSecure?searchType=quick&searchText=brain&occurrences=all&journalCode=tps&searchScope=fullSite&code=tps-site
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
  } else if ((match = /^\/article\/(.*)\/fulltext$/i.exec(path)) !== null) {
    // https://www.transplantation-proceedings.org:443/article/S0041-1345(12)00993-1/fulltext
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    pii             = match[1].replace(/[-()]/g, '');
    result.pii      = pii;
    result.unitid   = pii;
  } else if ((match = /^\/article\/(.*)\/pdf$/i.exec(path)) !== null) {
    // https://www.transplantation-proceedings.org:443/article/S0041-1345(12)00993-1/fulltext
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    pii             = match[1].replace(/[-()]/g, '');
    result.pii      = pii;
    result.unitid   = pii;
  } else if ((match = /^\/article\/(.*)\/ppt$/i.exec(path)) !== null) {
    // https://www.transplantation-proceedings.org:443/article/S0041-1345(16)00084-1/ppt
    result.rtype    = 'SUPPL';
    result.mime     = 'MISC';
    pii             = match[1].replace(/[-()]/g, '');
    result.pii      = pii;
    result.unitid   = pii;
  } else if (/^\/current$/i.test(path)) {
    // https://www.transplantation-proceedings.org:443/current
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = 'current';
  } else if ((match = /^\/issue\/(.*)$/i.exec(path)) !== null) {
    // https://www.transplantation-proceedings.org:443/issue/S0041-1345(16)X0014-0
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    pii             = match[1].replace(/[-()]/g, '');
    result.unitid   = pii;
  } else if (/^\/issues$/i.test(path)) {
    // https://www-transplantation-proceedings-org.proxy.library.emory.edu/issues
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
  }

  return result;
});
