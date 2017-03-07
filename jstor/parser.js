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
  var query  = parsedUrl.query;

  var match;

  if ((match = /^\/journal\/([a-z0-9]+)$/i.exec(path)) !== null) {
    result.rtype    = 'TOC';
    result.mime     = 'MISC';
    result.unitid   = match[1];
    result.title_id = match[1];

  } else if ((match = /^\/stable\/([0-9]{2}\.[0-9]{4})\/([0-9]+)$/i.exec(path)) !== null) {
    // /stable/10.1086/665036
    result.title_id = match[2];
    result.rtype    = 'TOC';
    result.mime     = 'MISC';
    result.unitid   = match[2];
    result.doi      = match[1] +'/'+ match[2];

  } else if ((match = /^\/stable\/([0-9]{2}\.[0-9]{4})\/([a-z]+)\.([0-9]{4})\.([0-9]+)\.([^.]+)$/i.exec(path)) !== null) {
    // /stable/10.1525/cmr.2013.55.issue-2
    result.title_id = match[2];
    result.unitid   = match[2] + '.' + match[3] + '.' + match[4] + '.' + match[5];
    result.doi      = match[1] +'/'+ match[2] + '.' + match[3] + '.' + match[4] + '.' + match[5];
    result.rtype    = 'TOC';
    result.mime     = 'MISC';

  } else if ((match = /^\/stable\/([0-9]{2}\.[0-9]{4})\/([^.]+)$/i.exec(path)) !== null) {
    // /stable/10.7312/cari13424
    result.title_id = match[2];
    result.unitid   = match[2];
    result.doi      = match[1] +'/'+ match[2];
    result.rtype    = 'TOC';
    result.mime     = 'MISC';

  } else if ((match = /^\/stable\/(i[0-9]+)$/i.exec(path)) !== null) {
    // /stable/i25703249
    result.title_id = match[1];
    result.unitid   = match[1] ;
    result.rtype    = 'TOC';
    result.mime     = 'MISC';

  } else if ((match = /^\/action\/showPublication$/i.exec(path)) !== null) {
    // /action/showPublication?journalCode=harvardreview
    if (query.journalCode) {
      result.title_id = query.journalCode;
      result.unitid   = query.journalCode;
      result.rtype    = 'TOC';
      result.mime     = 'MISC';
    }
  } else if ((match = /^\/stable\/([0-9]{2}\.[0-9]+\/(([a-z]+)\.[0-9]+\.[0-9]+\.[^.]+))$/i.exec(path)) !== null) {
    // /stable/10.5325/jmedirelicult.39.2.issue-2
    result.title_id = match[3];
    result.unitid   = match[2];
    result.doi      = match[1];
    result.rtype    = 'TOC';
    result.mime     = 'MISC';

  } else if ((match = /^\/stable\/(pdfplus|pdf)\/([0-9]+)\.pdf$/i.exec(path)) !== null) {
    // /stable/pdfplus/690326.pdf
    result.title_id = match[2];
    result.unitid   = match[2];
    result.rtype    = 'ARTICLE';
    result.mime     = match[1] === 'pdfplus' ? 'PDFPLUS' : 'PDF';

  } else if ((match = /^\/stable\/(info|view)\/([0-9]+)$/i.exec(path)) !== null) {
    // /stable/info/25703252
    // /stable/view/25703252
    result.title_id = match[2];
    result.unitid   = match[2];
    result.rtype    = match[1] === 'info' ? 'ABS' : 'PREVIEW';
    result.mime     = 'MISC';

  } else if ((match = /^\/stable\/(pdf\/)?([0-9]{2}\.[0-9]+\/([a-z]+\.?[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+))(?:\.pdf)?$/i.exec(path)) !== null) {
    // /stable/10.7312/cari13424
    // /stable/pdf/10.13110/merrpalmquar1982.59.2.0198.pdf
    // /stable/10.1525/gfc.2010.10.3.14
    result.unitid = match[3];
    result.doi    = match[2];
    result.rtype  = 'ARTICLE';
    result.mime   = match[1] ? 'PDF' : 'HTML';

  }
  return result;
});
