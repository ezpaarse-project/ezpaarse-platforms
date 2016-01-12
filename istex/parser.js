#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme Istex
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
  // console.error(parsedUrl);

  var match;

  if ((match = /^\/document\/([0-9A-Z]+)\/([a-z]+)\/([a-zA-Z]+)([^.]?)/.exec(path)) !== null) {
    result.mime     = match[3].toUpperCase();
    
    if (match[2] != 'fulltext') {
      result.rtype    = match[2];
    }

    switch(match[3]) {
    case 'txt':
        result.mime     = 'TEXT';
        break;
    case 'mrc':
        result.mime     = 'MARC';
        break;
    case 'catWos':
        result.mime     = 'TEI';
        break;
    case 'original':
        if (match[2] != 'fulltext') 
          {result.mime     = 'XML';}
          else {
            result.mime     = '';
          }
        break;
  } 


    result.unitid   = match[1];
  } 

  return result;
});

