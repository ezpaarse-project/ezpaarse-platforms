#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Cyberlibris
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
   var param  = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(path);

  var match;

  if ((match = /^\/book\/([0-9]+)$/.exec(path)) !== null) {
    // http://univ-paris1.cyberlibris.com/book/88826141
    result.rtype    = 'ABS';
    result.mime     = 'MISC';
    result.title_id = match[1];
    result.unitid   = match[1];
  } else if ((match = /^\/reader\/([a-z]+)\/([a-z]+)\/([0-9]+)\/([a-z]+)\/([0-9]+)$/.exec(path)) !== null) {
    // http://univ-paris1.cyberlibris.com/reader/istream/docid/88826141/page/1
    // http://univ-paris1.cyberlibris.com/reader/local/docid/88826141/page/1
    result.rtype    = 'BOOK';
    result.mime     = 'HTML';
    result.title_id = match[3];
    result.unitid   = match[3]+'/'+match[4]+'/'+match[5];
  }else if ((match = /^\/reader\/([a-z]+)\/*/.exec(path)) !== null) {
    // http://univ-paris1.cyberlibris.com/reader/advprint/?DocID=88826141&pages=0
 
    result.mime     = 'MISC';
    if (param.DocID) {
       result.title_id = param.DocID;
       result.unitid = param.DocID;
    };
 
  }

  return result;
});

