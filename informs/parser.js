#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform INFORMS
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

  if ((match = /^\/toc\/([a-z]+)\/([0-9]+)\/([0-9]+)$/.exec(path)) !== null) {
    // /toc/deca/13/1
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = match[1];
  } else if ((match = /^\/doi\/([a-z]+)\/([0-9]{2}\.[0-9]{4,5})\/(([a-z]+)\.([0-9]+)\.([0-9]+))$/.exec(path)) !== null) {
    ///doi/abs/10.1287/deca.2015.0324
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.title_id = match[4];
    result.doi = match[2] + '/' + match[3];
    switch (match[1]) {
    case 'abs':
      result.rtype    = 'ABS';
      result.mime     = 'HTML';
      break;
    case 'pdf':
      result.rtype    = 'ARTICLE';
      result.mime     = 'PDF';
      break;
    case 'ref':
      result.rtype    = 'RECORD_VIEW';
      result.mime     = 'HTML';
      break;
    }
  }

  return result;
});

