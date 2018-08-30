#!/usr/bin/env node

/**
 * parser for acs platform
 * http://analyses.ezpaarse.org/platforms/acs/
 */
'use strict';
const Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  let result = {};
  let path   = parsedUrl.pathname;
  let match;

  if ((match = /^\/(journal|loi|toc)\/([a-z]+[0-9]?)(\/current)?$/i.exec(path)) !== null) {
    // /journal/achre4
    // /toc/achre4/current
    result.title_id = match[2];
    result.unitid   = `${match[2]}${match[3] || ''}`;
    result.rtype    = 'TOC';
    result.mime     = 'MISC';

  } else if ((match = /^\/toc\/(([a-z]+[0-9]?)\/([0-9]+)\/([0-9]+))$/i.exec(path)) !== null) {
    // /toc/achre4/46/4
    result.rtype    = 'TOC';
    result.mime     = 'MISC';
    result.unitid   = match[1];
    result.title_id = match[2];
    result.vol      = match[3];
    result.issue    = match[4];

  } else if ((match = /^\/isbn\/([0-9]{13})$/i.exec(parsedUrl.pathname)) !== null) {
    // /isbn/9780841229105
    result.title_id         = match[1];
    result.unitid           = match[1];
    result.print_identifier = match[1];
    result.rtype            = 'TOC';
    result.mime             = 'MISC';

  } else if ((match = /^\/doi(?:\/(abs|pdf|pdfplus|ipdf|full))?\/(10\.[0-9]+\/([a-z0-9.-]+))$/i.exec(path)) !== null) {
    // http://pubs.acs.org/doi/pdf/10.1021/acs.biochem.5b00764
    // http://pubs.acs.org/doi/full/10.1021/acs.biochem.5b00514
    // http://pubs.acs.org/doi/ipdf/10.1021/acs.biochem.5b00764
    result.doi    = match[2];
    result.unitid = match[3];

    switch (result.unitid) {
    case 'undefined':
    case 'build-info.json':
      return {};
    }

    let doiMatch;

    if ((doiMatch = /^10\.[0-9]+\/([a-z0-9]+)-([0-9]{4})-[0-9]+\.ch0*([0-9]+)$/.exec(result.doi)) !== null) {
      // DOI de type 10.1021/bk-2012-1121.ch001
      result.title_id         = doiMatch[1];
      result.publication_date = doiMatch[2];
      result.chapter          = doiMatch[3];

    } else if ((doiMatch = /^10\.[0-9]+\/acs.([a-z]+)\.[a-z0-9]+$/.exec(result.doi)) !== null) {
      // DOI de type 10.1021/acs.biochem.5b00764
      result.title_id = doiMatch[1];
    }

    switch (match[1]) {
    case 'abs':
      result.rtype = 'ABS';
      result.mime  = 'HTML';
      break;
    case 'pdf':
      result.rtype = result.chapter ? 'BOOK_CHAPTER' : 'ARTICLE';
      result.mime  = 'PDF';
      break;
    case 'pdfplus':
    case 'ipdf':
      result.rtype = result.chapter ? 'BOOK_CHAPTER' : 'ARTICLE';
      result.mime  = 'PDFPLUS';
      break;
    case 'full':
      result.rtype = result.chapter ? 'BOOK_CHAPTER' : 'ARTICLE';
      result.mime  = 'HTML';
      break;
    default:
      result.rtype = 'ARTICLE';
      result.mime  = 'HTML';
    }
  }

  return result;
});
