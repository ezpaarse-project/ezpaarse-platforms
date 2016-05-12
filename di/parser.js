#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Delphes Indexpresse0
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

  if ((match = /^\/([a-z\-]+)\/([a-z]+)\/([0-9]+)\/([0-9]+)\/(([\w\W]+).pdf)$/.exec(path)) !== null) {
    // wp-content/uploads/2014/01/Delphes2014_Liste_the%CC%81matique.pdf
    result.rtype    = 'LISTE';
    result.mime     = 'PDF';
    result.title_id = match[6].split('_')[0];
    result.unitid   = match[5];
  } else if ((match = /^\/([a-z]+).asp$/.exec(path)) !== null) {
    //http://www.delphes-indexpresse.com/resultat.asp?connecteur=y&BI=1157678
    result.rtype    = 'REF';
    result.mime     = 'HTML';
    if (param.BI) {
      result.title_id = param.BI;
      result.unitid   = param.BI;
    }
  }

  return result;
});

