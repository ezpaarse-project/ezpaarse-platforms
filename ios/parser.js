#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme IOS press
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // var param  = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  var match;

  if ((match = /^\/articles\/([a-z\-]+)\/(([a-z]+)([0-9]+))$/.exec(path)) !== null) {
    // articles/journal-of-pediatric-infectious-diseases/
    // jpi00094?resultNumber=0&totalResults=1834&start=0&q=disease&resultsPageSize=10&rows=10
    result.rtype    = 'ABS';
    result.mime     = 'HTML';
    result.title_id = match[1];

    result.unitid   = match[2];

  } else if ((match = /^\/download\/([a-z\-]+)\/(([a-z]+)([0-9]+))$/.exec(path)) !== null) {
    // download/journal-of-pediatric-infectious-diseases/jpi00094?id=journal-of-pediatric-infectious-diseases%2Fjpi00094
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = match[1];
    //see the comment block above
    result.unitid   = match[2];
  } else if ((match = /^\/journals\/([a-z]+)\/([0-9]+)\/([0-9]+)$/.exec(path)) !== null) {
    // journals/biofactors/30/4
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.vol = match[2];
    result.issue = match[3];
    result.title_id = match[1];
    //see the comment block above
    result.unitid   = "journals/" +   match[1]  + '/' + match[2] + '/' + match[3];
  }

  return result;
});

