#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Publie.net
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // var param  = parsedUrl.query || {};

  // use console.error for debuging
  //console.error(parsedUrl);

  var match;

  if ((match = /^\/[a-z]{1,4}\/read_book\/([A-Z0-9]{7})$/.exec(path)) !== null) {
     //http://bnus.publie.net/fr/read_book/GYZBC26#pct0
    result.rtype    = 'BOOK';
    result.mime     = 'PDFPLUS';
    result.title_id = match[1];
    result.unitid = match[1];

  } else if ((match = /^\/[a-z]{1,4}\/ebook\/([0-9]{13})\/[-a-z]+$/.exec(path)) !== null) {
      //http://bnus.publie.net/fr/ebook/9782371771529/les-classiques-connectes

    result.rtype    = 'BOOK';
    result.mime     = 'HTML';
    result.unitid = match[1];
    //see the comment block above
    result.online_identifier   = match[1];
  }

  return result;
});

