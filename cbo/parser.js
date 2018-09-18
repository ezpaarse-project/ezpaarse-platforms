#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 180*/

/**
 * parser for cbo platform
 * http://analyses.ezpaarse.org/platforms/cambridge-books-online/start
 */
'use strict';
var Parser = require('../.lib/parser.js');

module.exports = new Parser(function analyseEC(parsedUrl) {
  var result = {};
  var path   = parsedUrl.pathname;
  var query  = parsedUrl.query || {};

  var match;

  if (path == '/ebook.jsf') {
    if (query.bid) {
      // http://ebooks.cambridge.org/ebook.jsf?bid=CBO9781139547307
      result.title_id          = query.bid;
      result.unitid            = query.bid;
      result.online_identifier = query.bid.substr(3, 13);
      result.rtype             = 'TOC';
      result.mime              = 'HTML';
    }
  } else if (path == '/chapter.jsf') {
    // https://ebooks.cambridge.org/chapter.jsf?bid=CBO9780511511288&cid=CBO9780511511288A010&tabName=Chapter&imageExtract=
    if (query.cid) {
      result.unitid            = query.cid;
      result.title_id          = query.cid.substr(0, 16);
      result.online_identifier = query.cid.substr(3, 13);
      result.rtype             = 'BOOK_SECTION';
      result.mime              = 'HTML';
    }
  } else if (path == '/pdf_viewer.jsf') {
    // https://ebooks.cambridge.org/pdf_viewer.jsf?cid=CBO9780511511288A010&hithighlight=on&ref=true&pubCode=CUP&urlPrefix=cambridge&productCode=cbo
    if (query.cid) {
      result.unitid            = query.cid;
      result.title_id          = query.cid.substr(0, 16);
      result.online_identifier = query.cid.substr(3, 13);
      result.rtype             = 'BOOK_SECTION';
      result.mime              = 'PDF';
    }
  } else if ((match = /^\/open_pdf\/([A-Z0-9]+)$/.exec(path)) !== null) {
    // http://ebooks.cambridge.org/open_pdf/CBO9780511697036A004?pubCode=CUP&urlPrefix=cambridge&productCode=cbo
    result.unitid            = match[1];
    result.title_id          = match[1].substr(0, 16);
    result.online_identifier = match[1].substr(3, 13);
    result.rtype             = 'BOOK_SECTION';
    result.mime              = 'PDF';
  }

  return result;
});
