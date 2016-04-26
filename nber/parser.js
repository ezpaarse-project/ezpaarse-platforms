#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform NBER
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

  if ((match = /^\/([a-z]+)\/([a-z0-9]+)$/.exec(path)) !== null) {
    // http://www.nber.org/papers/w20518
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.unitid   = match[2];
  } else if ((match = /^\/([a-z]+)\/([a-z0-9]+).pdf$/.exec(path)) !== null) {
    // http://www.nber.org/papers/w20518.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = match[2];
  } else if ((match = /^\/([a-z]+).html$/.exec(path)) !== null) {
    // http://www.nber.org/papers/w20518.pdf
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];
  }

  return result;
});

