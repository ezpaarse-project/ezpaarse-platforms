#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Oxford Very Short Introductions
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

  if ((match = /^\/([a-z]+)$/.exec(path)) !== null) {
    //browse?t0=VSIO_SUBJECTS:AHU00020
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    if (param.t0) {
      result.unitid   = param.t0;
    }

  } else if ((match = /^\/view\/([0-9]{2}\.[0-9]{4})\/([a-z]+)\/([0-9\.]+)\/(([a-z]+)\-([0-9]+)([a-z0-9\-]+)?)$/.exec(path)) !== null) {
    //view/10.1093/actrade/9780190458164.001.0001/actrade-9780190458164-chapter-1
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[4];
    result.doi = match[1] + '/' + match[3];
    if (match[7]) {
      result.rtype    = 'BOOK_SECTION';
    }
  }

  return result;
});

