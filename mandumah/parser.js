#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform DarAlMandumah
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
  if ((match = /^\/Download$/.exec(path)) !== null) {
    // https://search.mandumah.com/Download?file=myKKhfKhydDL0/C3P70vRDa4AcZ3yTcQaiPlBVyE9ew=&id=688618
    // http://search.mandumah.com/Download?file=uv37ILCGhcj2gV4PvVhTK5CE+24syhv3CeGpjz1DqWs=&id=646753&show=1
    result.rtype    = 'ARTICLE';
    if (param.show) {
      result.mime   = 'HTML';
    } else {
      result.mime   = 'PDF';
    }
    result.unitid   = param.id;
  } else if ((match = /^\/Record\/([0-9]+)$/.exec(path)) !== null) {
    // https://search.mandumah.com/Record/126627
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    //see the comment block above
    result.unitid   = match[1];
  }

  return result;
});

