#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Kluwer Law Online
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

  if (/^\/SearchContent\/query=$/i.test(path)) {
    // https://kluwerlawonline.com/SearchContent/query=?searchText=capital&publication=Business%20Law%20Review
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/JournalArticle\/([a-z+]+)\/([0-9.]+)\/(([a-z]+)(\d{4})([0-9]+))$/i.exec(path)) !== null) {
    // https://kluwerlawonline.com/JournalArticle/ASA+Bulletin/24.4/ASAB2006074
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.pii = match[1];
    result.publication_date   = match[5];
    result.title_id = match[4];
    result.vol = match[2].split('.')[0];
    result.issue = match[2].split('.')[1];
    result.unitid = match[3];
  } else if (/^\/api\/Product\/CitationPDFURL$/i.test(path)) {
    // https://kluwerlawonline.com/api/Product/CitationPDFURL?file=Journals\ASAB\ASAB2006074.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    let filePartMatch;
    if ((filePartMatch = /^Journals\\([a-z+]+)\\(([a-z]+)(\d{4})([0-9]+))\.pdf$/i.exec(param.file)) !== null) {
      result.publication_date = filePartMatch[4];
      result.title_id = filePartMatch[1];
      result.unitid = filePartMatch[2];
    }
  } else if ((match = /^\/Journals\/([a-z+]+)\/([0-9]+)$/i.exec(path)) !== null) {
    // https://kluwerlawonline.com/Journals/Business+Law+Review/1
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.pii   = match[1];
  }

  return result;
});
