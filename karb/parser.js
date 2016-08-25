#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Kluwer Arbitration
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  var param  = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  var match;

  if ((match = /^\/CommonUI\/(([a-z\-]*).aspx)$/.exec(path)) !== null) {
    //CommonUI/books.aspx
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid = match[1];
    if (param.book) {
      result.unitid = param.book;
    }
    if (param.id) {
      result.unitid = param.id;
      result.rtype    = 'ARTICLE';
    }
    if (param.format && param.format == 'pdf') {
      result.unitid = param.ids;
      result.rtype    = 'ARTICLE';
      result.mime     = 'PDF';
    }
    if (param.journal) {
      result.unitid = param.journal;
    }
    if (/([a-z]+)\-tool/.test(match[2])) {
      result.rtype    = 'TOOL';
    }
  } else if ((match = /^\/([0-9]{4})\/([0-9]+)\/([0-9]+)\/([a-z0-9\-]*)\/?$/.exec(path)) !== null) {
    //2016/08/22/even-innocent-clients-may-not-benefit-from-the-fraud-of-their-attorney-second-circuit-upholds-rico-judgment-in-favor-of-chevron/
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.publication_date = match[1];
    result.unitid = match[4];
  }

  return result;
});
