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

  if ((match = /\/journal\/([a-z]+[0-9]?)$/.exec(path)) !== null) {
    // /journal/achre4
    result.title_id   = match[1];
    result.rtype = 'TOC';
    result.mime  = 'MISC';
  } else if ((match = /\/loi\/([a-z]+[0-9]?)$/.exec(path)) !== null) {
    // /loi/achre4
    result.title_id   = match[1];
    result.rtype = 'TOC';
    result.mime  = 'MISC';
  } else if ((match = /\/toc\/([a-z]+[0-9]?)\/current$/.exec(path)) !== null) {
    // /toc/achre4/current
    result.unitid = match[1] + "/current";
    result.title_id    = match[1];
    result.rtype  = 'TOC';
    result.mime   = 'MISC';
  } else if ((match = /\/toc\/([a-z]+[0-9]?)\/([0-9]+)\/([0-9]+)$/.exec(path)) !== null) {
    // /toc/achre4/46/4
    result.unitid = match[1] + "/" + match[2] + '/' + match[3];
    result.title_id    = match[1];
    result.rtype  = 'TOC';
    result.mime   = 'MISC';
  } else if ((match = /^\/doi\/abs\/([0-9]{2}\.[0-9]{4})\/([^.]+)$/.exec(path)) !== null) {
    // /doi/abs/10.1021/ar400025e
    result.unitid = match[1] + "/" + match[2];
    result.title_id    = match[2].slice(0, 2);
    result.rtype  = 'ABS';
    result.mime   = 'MISC';
  } else if ((match = /^\/doi\/ipdf\/([0-9]{2}\.[0-9]{4})\/([^.]+)$/.exec(path)) !== null) {
    // /doi/ipdf/10.1021/ar400025e
    result.unitid = match[1] + "/" + match[2];
    result.title_id    = match[2].slice(0, 2);
    result.rtype  = 'ARTICLE';
    result.mime   = 'MISC';
  } else if ((match = /^\/doi\/pdf\/([0-9]{2}\.[0-9]{4})\/([^.]+)$/.exec(path)) !== null) {
    // /doi/pdf/10.1021/ar400025e
    result.unitid = match[1] + "/" + match[2];
    result.title_id    = match[2].slice(0, 2);
    result.rtype  = 'ARTICLE';
    result.mime   = 'PDF';
  } else if ((match = /^\/doi\/pdfplus\/([0-9]{2}\.[0-9]{4})\/([^.]+)$/.exec(path)) !== null) {
    // /doi/pdfplus/10.1021/ar400025e
    result.unitid = match[1] + "/" + match[2];
    result.title_id    = match[2].slice(0, 2);
    result.rtype  = 'ARTICLE';
    result.mime   = 'PDF';
  } else if ((match = /^\/doi\/full\/([0-9]{2}\.[0-9]{4})\/([^.]+)$/.exec(path)) !== null) {
    // /doi/full/10.1021/ar400025e
    result.unitid = match[1] + "/" + match[2];
    result.title_id    = match[2].slice(0, 2);
    result.rtype  = 'ARTICLE';
    result.mime   = 'HTML';
  } else if ((match = /^\/isbn\/([0-9]{13})$/.exec(parsedUrl.pathname)) !== null) {
    // /isbn/9780841229105
    result.title_id   = match[1];
    result.rtype = 'TOC';
    result.mime  = 'MISC';
  } else if ((match = /^\/doi\/pdf\/([0-9]{2}\.[0-9]{4})\/bk-([0-9]{4})-([0-9]+)\.([a-z0-9]+)$/.exec(path)) !== null) {
    // /doi/pdf/10.1021/bk-2012-1121.ch001
    result.title_id   = match[1];
    result.rtype = 'BOOK_SECTION';
    result.mime  = 'PDF';
  } else if ((match = /^\/doi\/pdfplus\/([0-9]{2}\.[0-9]{4})\/bk-([0-9]{4})-([0-9]+)\.([a-z0-9]+)$/.exec(path)) !== null) {
    // /doi/pdfplus/10.1021/bk-2012-1121.ch001
    result.title_id   = match[1];
    result.rtype = 'BOOK_SECTION';
    result.mime  = 'PDF';
  } else if ((match = /^\/doi\/full\/([0-9]{2}\.[0-9]{4})\/bk-([0-9]{4})-([0-9]+)\.([a-z0-9]+)$/.exec(path)) !== null) {
    // /doi/full/10.1021/bk-2012-1121.ch001
    result.title_id   = match[1];
    result.rtype = 'BOOK_SECTION';
    result.mime  = 'HTML';
  }
  return result;
});
