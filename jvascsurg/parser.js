#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Journal of Vascular Surgery
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

  if (/^\/action\/doSearch/i.test(path)) {
    // https://www.jvascsurg.org:443/action/doSearch?occurrences=all&searchText=rainbow&searchType=quick&searchScope=fullSite&journalCode=ymva
    result.rtype = 'SEARCH';
    result.mime = 'HTML';

  } if ((match = /^\/(issue|content)\/([0-z()-]{21})/i.exec(path)) !== null) {
    // https://www.jvascsurg.org:443/issue/S0741-5214(17)X0013-X
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = match[2];
    result.title_id = match[2];
    result.pii = match[2];

  } if ((match = /^\/(issue|content)\/([0-z()-]+)/i.exec(path)) !== null) {
    // https://www.jvascsurg.org:443/content/SVS2018
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = match[2];
    result.title_id = match[2];

  } if ((match = /^\/(ymva([0-z()_-]+))/i.exec(path)) !== null) {
    // https://www.jvascsurg.org:443/ymva-IssueSummary-2019
    // https://www.jvascsurg.org:443/ymva_vagallery2019
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.unitid = match[1];
    result.title_id = match[1];

  } if ((match = /^\/article\/([0-9S()-]{21})\/abstract$/i.exec(path)) !== null)  {
    // https://www.jvascsurg.org:443/article/S0741-5214(18)32469-8/abstract
    result.rtype = 'ABS';
    result.mime = 'HTML';
    result.unitid = match[1];
    result.title_id = match[1];
    result.pii = match[1];

  } if ((match = /^\/article\/([0-9S()-]{21})\/fulltext$/i.exec(path)) !== null)  {
    // https://www.jvascsurg.org:443/article/S0741-5214(18)32556-4/fulltext
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
    result.unitid = match[1];
    result.title_id = match[1];
    result.pii = match[1];

  } if ((match = /^\/article\/([0-9S()-]{21})\/pdf$/i.exec(path)) !== null) {
    // https://www.jvascsurg.org:443/article/S0741-5214(18)32556-4/pdf
    result.rtype = 'ARTICLE';
    result.mime = 'PDF';
    result.unitid = match[1];
    result.title_id = match[1];
    result.pii = match[1];

  } if ((match = /^\/(ymva_va_([0-9]{2})_([0-9]{1})_([0-9]{1})_full)/i.exec(path)) !== null) {
    // https://www.jvascsurg.org:443/ymva_va_70_1_2_full
    result.rtype = 'IMAGE';
    result.mime = 'MISC';
    result.unitid = match[2] + '_' + match[3] + '_' + match[4];
    result.title_id = match[1];

  } if ((match = /^\/cms\/attachment\/([0-9a-z-]{36})\/mmc1\.mp4/i.exec(path)) !== null) {
    // https://www.jvascsurg.org:443/cms/attachment/d527a335-3b5d-4cee-8baf-95fbec831b83/mmc1.mp4
    result.rtype = 'VIDEO';
    result.mime = 'MISC';
    result.unitid = match[1];
    result.title_id = match[1];

  }

  return result;
});
