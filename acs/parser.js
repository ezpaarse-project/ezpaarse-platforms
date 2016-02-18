#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 180*/

/**
 * parser for acs platform
 * http://analogist.couperin.org/platforms/acs/
 */
'use strict';
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  var result = {};
  var path   = parsedUrl.pathname;

  var match;

  if ((match = /^\/(journal|loi|toc)\/([a-z]+[0-9]?)(\/current)?$/.exec(path)) !== null) {
    // /journal/achre4
    // /toc/achre4/current
    result.title_id = match[2];
    result.unitid   = match[2] + (match[3] || '');
    result.rtype    = 'TOC';
    result.mime     = 'MISC';

  } else if ((match = /^\/toc\/([a-z]+[0-9]?)\/([0-9]+)\/([0-9]+)$/.exec(path)) !== null) {
    // /toc/achre4/46/4
    result.unitid   = match[1] + '/' + match[2] + '/' + match[3];
    result.title_id = match[1];
    result.rtype    = 'TOC';
    result.mime     = 'MISC';
    result.vol      = match[2] ;
    result.issue    = match[3];

  } else if ((match = /^\/doi\/(abs|pdf|ipdf|pdfplus|full)\/([0-9]{2}\.[0-9]{4}\/([a-z0-9]+))$/.exec(path)) !== null) {
    // /doi/abs/10.1021/ar400025e
    // /doi/abs/10.1021/i100024a002
    // no safe way to extract the title_id, it's not always present and can end with numbers

    result.doi      = match[2];
    result.unitid   = match[3];

    switch (match[1]) {
    case 'abs':
      result.rtype = 'ABS';
      result.mime  = 'MISC';
      break;
    case 'ipdf':
    case 'pdfplus':
      result.rtype = 'ARTICLE';
      result.mime  = 'PDFPLUS';
      break;
    case 'pdf':
      result.rtype = 'ARTICLE';
      result.mime  = 'PDF';
      break;
    case 'full':
      result.rtype = 'ARTICLE';
      result.mime  = 'HTML';
      break;
    }

  } else if ((match = /^\/isbn\/([0-9]{13})$/.exec(parsedUrl.pathname)) !== null) {
    // /isbn/9780841229105
    result.title_id         = match[1];
    result.unitid           = match[1];
    result.print_identifier = match[1];
    result.rtype            = 'TOC';
    result.mime             = 'MISC';

  } else if ((match = /^\/doi\/(abs|pdf|ipdf|pdfplus|full)\/([0-9]{2}\.[0-9]{4}\/(([a-z0-9]+)-([0-9]{4})-[0-9]+\.ch0*([0-9]+)))$/.exec(path)) !== null) {
    // /doi/pdf/10.1021/bk-2012-1121.ch001
    result.doi              = match[2];
    result.unitid           = match[3];
    result.title_id         = match[4];
    result.publication_date = match[5];
    result.chapter          = match[6];

    switch (match[1]) {
    case 'abs':
      result.rtype = 'ABS';
      result.mime  = 'HTML';
      break;
    case 'pdf':
      result.rtype = 'BOOK_CHAPTER';
      result.mime  = 'PDF';
      break;
    case 'ipdf':
    case 'pdfplus':
      result.rtype = 'BOOK_CHAPTER';
      result.mime  = 'PDFPLUS';
      break;
    case 'full':
      result.rtype = 'BOOK_CHAPTER';
      result.mime  = 'HTML';
      break;
    }

  } else if ((match = /^\/doi\/(abs|pdf|pdfplus|ipdf|full)\/([0-9]{2}\.[0-9]{4}\/(acs.([a-z]+)\.[a-z0-9]+))$/.exec(path)) !== null) {
    // http://pubs.acs.org.gate1.inist.fr/doi/pdf/10.1021/acs.biochem.5b00764
    // http://pubs.acs.org.gate1.inist.fr/doi/full/10.1021/acs.biochem.5b00514
    // http://pubs.acs.org.gate1.inist.fr/doi/ipdf/10.1021/acs.biochem.5b00764
    result.doi      = match[2];
    result.unitid   = match[3];
    result.title_id = match[4];

    switch (match[1]) {
    case 'abs':
      result.rtype = 'ABS';
      result.mime  = 'HTML';
      break;
    case 'pdf':
      result.rtype = 'ARTICLE';
      result.mime  = 'PDF';
      break;
    case 'pdfplus':
    case 'ipdf':
      result.rtype = 'ARTICLE';
      result.mime  = 'PDFPLUS';
      break;
    case 'full':
      result.rtype = 'ARTICLE';
      result.mime  = 'HTML';
      break;
    }
  }

  return result;
});
