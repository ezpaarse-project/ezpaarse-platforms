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

  //console.log(path);

  var match;

  if ((match = /\/stable\/([0-9]{2}\.[0-9]{4})\/([0-9]+)$/.exec(path)) !== null) {
    // /stable/10.1086/665036
    result.title_id = match[2];
    result.rtype = 'TOC';
    result.mime = 'MISC';
    result.unitid = match[2];
    result.doi = match[1] +'/'+ match[2];
  } else if ((match = /\/stable\/([0-9]{2}\.[0-9]{4})\/([a-z]+)\.([0-9]{4})\.([0-9]+)\.([^.]+)$/.exec(path)) !== null) {
    // /stable/10.1525/cmr.2013.55.issue-2
    result.title_id = match[2];
    result.unitid=  match[2] + '.' + match[3] + '.' + match[4] + '.' + match[5];
    result.doi =  match[1] +'/'+ match[2] + '.' + match[3] + '.' + match[4] + '.' + match[5];
    result.rtype = 'TOC';
    result.mime = 'MISC';
  } else if ((match = /^\/stable\/([0-9]{2}\.[0-9]{4})\/([^.]+)$/.exec(path)) !== null) {
    // /stable/10.7312/cari13424
    result.title_id = match[2];
    result.unitid =  match[2];
    result.doi =  match[1] +'/'+ match[2];
    result.rtype = 'TOC';
    result.mime = 'MISC';
  } else if ((match = /^\/stable\/(i[0-9]+)$/.exec(path)) !== null) {
    // /stable/i25703249
    result.title_id = match[1];
    result.unitid = match[1] ;
    result.rtype = 'TOC';
    result.mime = 'MISC';
  } else if ((match = /^\/action\/showPublication/.exec(path)) !== null) {
    // /action/showPublication?journalCode=harvardreview
    if (query.journalCode) {
      result.title_id = query.journalCode;
      result.unitid =  query.journalCode;
      result.rtype = 'TOC';
      result.mime = 'MISC';
    }
  } else if ((match = /\/stable\/([0-9]{2}\.[0-9]{4})\/([a-z]+)\.([0-9]+)\.([0-9]+)\.([^.]+)$/.exec(path)) !== null) {
    // /stable/10.5325/jmedirelicult.39.2.issue-2
    result.title_id = match[2];
    result.unitid=  match[2] + '.' + match[3] + '.' + match[4] + '.' + match[5];
    result.doi =  match[1] +'/'+ match[2] + '.' + match[3] + '.' + match[4] + '.' + match[5];
    result.rtype = 'TOC';
    result.mime = 'MISC';
  } else if ((match = /\/stable\/(pdfplus|pdf)\/([0-9]+)\.pdf/.exec(path)) !== null) {
    // /stable/pdfplus/690326.pdf
    result.title_id = match[2];
    result.unitid = match[2];
    result.rtype = 'ARTICLE';
    if (match[1] === 'pdfplus') {
      result.mime = 'PDFPLUS';
    } else {
      result.mime = 'PDF';
    }
  } else if ((match = /\/stable\/info\/([0-9]+)$/.exec(path)) !== null) {
    // /stable/info/25703252
    result.title_id = match[1];
    result.unitid = 'info' +'/'+ match[1];
    result.rtype = 'ABS';
    result.mime = 'MISC';
  } else if ((match = /\/stable\/view\/([0-9]+)$/.exec(path)) !== null) {
    // /stable/view/25703252
    result.title_id = match[1];
    result.unitid = 'view' +'/'+ match[1];
    result.rtype = 'PREVIEW';
    result.mime = 'MISC';
  } else if ((match = /\/stable\/([0-9]{2}\.[0-9]{4})\/(([a-z]+)\.([0-9]+)\.([0-9]+)\.([0-9]+)\.([^.]+))$/.exec(path)) !== null) {
    // /stable/10.7312/cari13424

    result.unitid =  match[2];
    result.doi =  match[1] +'/'+ match[2];
    result.rtype = 'ARTICLE';
    result.mime = 'HTML';
  } else if ((match = /\/stable\/pdf\/([0-9]{2}\.[0-9]{4})\/(([a-z]+)\.([0-9]+)\.([0-9]+)\.([0-9]+)\.([^.]+)).pdf$/.exec(path)) !== null) {
    // /stable/10.7312/cari13424

    result.unitid =  match[2];
    result.doi =  match[1] +'/'+ match[2];
    result.rtype = 'ARTICLE';
    result.mime = 'PDF';
  }
  return result;
});
