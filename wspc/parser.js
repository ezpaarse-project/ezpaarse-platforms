#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform World Scientific Publishing Company
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
  // console.error(parsedUrl);

  var match;

  if ((match = /^\/doi\/([a-z]+)\/([0-9]{2}\.[0-9]{4})\/(([A-Z]{1})([0-9]+)([A-Z]{1})([0-9]+))$/.exec(path)) !== null) {
    //doi/pdf/10.1142/S0217751X16300222
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.print_identifier = match[5].substr(0, 4) + '-' + match[5].substr(4) + match[6];
    result.unitid   = match[3];
    result.doi   = match[2] + '/' + match[3];
    switch (match[1]) {
    case 'abs' :
      result.rtype    = 'ABS';
      result.mime     = 'HTML';
      break;
    case 'ref' :
      result.rtype    = 'RECORD_VIEW';
      result.mime     = 'HTML';
      break;
    case 'pdfplus' :
      result.mime     = 'PDFPLUS';
      break;
    }
  } else if ((match = /^\/toc\/([a-z]+)\/([0-9]+)\/([0-9]+)$/.exec(path)) !== null) {
    // /toc/ijmpa/31/18
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
    result.unitid   = match[1] + '/' + match[2] + '/' + match[3];
  }

  return result;
});

