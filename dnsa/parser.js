#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Digital National Security Archive
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var query  = parsedUrl.query;
  var path   = parsedUrl.pathname;

  var match;

  if (path == '/cat/displayItem.do') {
    // http://nsarchive.chadwyck.com/cat/displayItem.do?queryType=cat&&ResultsID=1462E16F5A11&ItemNumber=1
    result.rtype  = 'ABS';
    result.mime   = 'HTML';
    result.unitid = query.ResultsID;
  } else if (path == '/cat/displayItemImages.do') {
    // http://nsarchive.chadwyck.com/cat/displayItemImages.do?queryType=cat&ResultsID=1462E16F5A11&ItemNumber=1&ItemID=CKR00045
    result.rtype    = 'ARTICLE';
    result.mime     = 'MISC';
    result.title_id = query.ItemID;
    result.unitid   = query.ResultsID;
  } else if (path == '/markedList/displayDownloadRecord.do') {
    // http://nsarchive.chadwyck.com/markedList/displayDownloadRecord.do?markedList=fullrec&ItemID=CKR00045&category=cat&id=CKR00045&title=Breakfast+Meeting+with+Korean+Foreign+Minister+Lee+Bum+Suk
    result.rtype    = 'RECORD_VIEW';
    result.mime     = 'MISC';
    result.title_id = query.ItemID;
    result.unitid   = query.ItemID;
  } else if ((match = /^\/nsa\/documents\/([a-z]+)\/([0-9]+)\/all\.pdf$/i.exec(path)) !== null) {
    // http://nsarchive.chadwyck.com/nsa/documents/KR/00045/all.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[1] + match[2];
    result.unitid   = result.title_id;
  }

  return result;
});

