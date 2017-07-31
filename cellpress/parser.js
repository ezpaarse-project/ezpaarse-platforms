#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Cell Press
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let match;

  if ((match = /^\/action\/doSearch/.exec(path)) !== null) {
    // http://www.cell.com/action/doSearch?journalCode=&searchText1=car&occurrences1=all&op1=and&searchText2=&occurrences2=all&searchScope=fullSite&date=range&dateRange=&searchAttempt=&searchType=advanced&doSearch=Search
    // http://www.cell.com/action/doSearch?searchType=quick&searchText=car&occurrences=all&journalCode=&searchScope=fullSite
    // http://www.cell.com/action/doSearch?journalCode=&searchText1=car&occurrences1=all&op1=and&searchText2=&occurrences2=all&searchScope=fullSite&date=range&dateRange=&searchAttempt=&searchType=advanced&doSearch=Search&startPage=6#navigation
    // http://www.cell.com/action/doSearch?searchType=quick&searchText=car&occurrences=all&journalCode=&searchScope=fullSite&startPage=6#navigation
    result.rtype    = 'SEARCH';
    result.mime     = 'MISC';

  } else if ((match = /^(\/[a-zA-Z-]+)*\/(fulltext|abstract|references|comments|pdf|pdfExtended|ppt)\/([0-9a-zA-Z-()]+)(\.(pdf|ppt))*$/.exec(path)) !== null) {
    // http://www.cell.com/trends/cancer/fulltext/S2405-8033(16)30122-4
    // http://www.cell.com/immunity/pdf/S1074-7613(16)00030-3.pdf
    // http://www.cell.com/immunity/pdfExtended/S1074-7613(16)00030-3
    // http://www.cell.com/immunity/ppt/S1074-7613(16)00030-3.ppt
    // http://www.cell.com/immunity/references/S1074-7613(16)00030-3
    let id   = match[3];
    let type = match[2];

    if (id && (match = /^[a-zA-z]((([0-9a-zA-Z])+)-([0-9a-zA-Z])+)\(/.exec(id)) !== null) {
      result.unitid = id;
      result.title_id = match[1];
    }

    switch (type) {
    case 'fulltext':
      result.rtype = 'ARTICLE';
      result.mime = 'HTML';
      break;

    case 'abstract':
      result.rtype = 'ABS';
      result.mime = 'MISC';
      break;

    case 'references':
      result.rtype = 'REF';
      result.mime = 'HTML';
      break;

    case 'pdfExtended':
      result.rtype = 'ARTICLE';
      result.mime = 'PDFPLUS';
      break;

    case 'pdf':
      result.rtype = 'ARTICLE';
      result.mime = 'PDF';
      break;

    case 'ppt':
      result.rtype = 'ARTICLE';
      result.mime = 'PPT';
      break;
    }
  }

  return result;
});
