#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Journal of the American Academy of Child and Adolescent Psychiatry
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

  if (/^\/action\/doSearch$/i.test(path)) {
    // https://www.jaacap.org:443/action/doSearch?occurrences=all&searchText=rainbow&searchType=quick&searchScope=fullSite&journalCode=jaac
    result.rtype = 'SEARCH';
    result.mime = 'HTML';

  } else if ((match = /^\/(master_clinician_reviews|current|commentary|issue)($|\/([0-z-()]+))$/i.exec(path)) !== null) {
    // https://www.jaacap.org:443/issue/S0890-8567(17)X0002-6
    // https://www.jaacap.org:443/master_clinician_reviews
    // https://www.jaacap.org:443/commentary
    result.rtype = 'TOC';
    result.mime = 'HTML';
    if (match[1] === 'issue') {
      result.unitid = match[3];
      result.pii = match[3];
    } else {
      result.title_id = match[1];
    }

  } else if ((match = /^\/content\/([a-z]+)$/i.exec(path)) !== null) {
    // https://www.jaacap.org:443/content/ednotes
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = match[1];
    result.title_id = match[1];

  } else if ((match = /^\/content\/([0-z()-_]{13,14})$/i.exec(path)) !== null) {
    // https://www.jaacap.org:443/content/jaac_otc_50_10
    result.rtype = 'REF';
    result.mime = 'HTML';
    result.unitid = match[1];
    result.title_id = match[1];

  } else if ((match = /^\/article\/([0-z()-]+)\/references$/i.exec(path)) !== null) {
    // https://www.jaacap.org:443/article/S0890-8567(18)32061-6/references
    result.rtype = 'REF';
    result.mime = 'HTML';
    result.unitid = match[1];
    result.pii = match[1];

  } else if (/^\/action\/showCitFormats$/i.test(path)) {
    // https://www.jaacap.org:443/action/showCitFormats?pii=S0890-8567%2816%2931569-6&doi=10.1016%2Fj.jaac.2016.09.340
    result.rtype = 'REF';
    result.mime = 'HTML';
    result.unitid = param.pii;
    result.pii = param.pii;
    result.doi = param.doi;

  } else if ((match = /^\/article\/([0-z()-]+)\/abstract$/i.exec(path)) !== null) {
    // https://www.jaacap.org:443/article/S0890-8567(19)30117-0/abstract
    // https://www.jaacap.org:443/article/S0890-8567(19)30002-4/abstract
    result.rtype = 'ABS';
    result.mime = 'HTML';
    result.unitid = match[1];
    result.pii = match[1];

  } else if ((match = /^\/article\/([0-z()-]+)\/fulltext$/i.exec(path)) !== null) {
    // https://www.jaacap.org:443/article/S0890-8567(19)30173-X/fulltext
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.unitid = match[1];
    result.pii = match[1];

  } else if ((match = /^\/article\/([0-z()-]+)\/pdf$/i.exec(path)) !== null) {
    // https://www.jaacap.org:443/article/S0890-8567(19)30173-X/pdf
    // https://www.jaacap.org:443/article/S0890-8567(19)30117-0/pdf
    result.rtype = 'ARTICLE';
    result.mime = 'PDF';
    result.unitid = match[1];
    result.pii = match[1];

  } else if (/^\/action\/showFullTextImages$/i.test(path)) {
    // https://www.jaacap.org:443/action/showFullTextImages?pii=S0890-8567%2818%2932061-6
    // https://www.jaacap.org:443/action/showFullTextImages?pii=S0890-8567%2818%2931967-1
    result.rtype = 'IMAGE';
    result.mime = 'JPEG';
    result.unitid = param.pii;
    result.pii = param.pii;

  } else if ((match = /^\/pb\/assets\/raw\/Health%20Advance\/journals\/jaac\/jaac_pc_([0-9-_]{19})\.mp3$/i.exec(path)) !== null) {
    // https://www.jaacap.org:443/pb/assets/raw/Health%20Advance/journals/jaac/jaac_pc_58_06-1558713372970.mp3
    // https://www.jaacap.org:443/pb/assets/raw/Health%20Advance/journals/jaac/jaac_pc_58_03-1551734789133.mp3
    result.rtype = 'AUDIO';
    result.mime = 'MISC';
    result.unitid = match[1];
    result.title_id = match[1];

  } else if ((match = /^\/(article)\/([0-9S()-]{21})\/ppt$/i.exec(path)) !== null) {
    // https://www.jaacap.org:443/article/S0890-8567(18)31967-1/ppt
    // https://www.jaacap.org:443/article/S0890-8567(18)31967-1/ppt
    result.rtype = 'IMAGE';
    result.mime = 'MISC';
    result.unitid = match[2];
    result.pii = match[2];
  }

  return result;
});
