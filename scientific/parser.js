#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Scientific
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
  if ((match = /^\/(([A-Z]+).([0-9]+))$/.exec(path)) !== null) {
    // http://www.scientific.net/MSF.817
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id   = match[2];
    result.unitid   = match[1];
  } else if ((match = /^\/(([A-Z]+).([0-9\-\.]+))$/.exec(path)) !== null) {
    //http://www.scientific.net/AMR.560-561.830
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.title_id   = match[2];
    result.unitid   = match[1];
  } else if ((match = /^\/(([A-Z]+).([0-9\-\.]+)).pdf$/.exec(path)) !== null) {
    //http://www.scientific.net/AMR.560-561.830
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id   = match[2];
    result.unitid   = match[1];
    result.doi = '10.4028/' + parsedUrl.host + '/' + match[1]
  }

  return result;
});

