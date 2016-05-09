#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform American Mathematical Society
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

  if ((match = /^\/([a-z]+)\/search\/([a-z]+).html$/.exec(path)) !== null) {
    // http://www.ams.org/mathscinet/search/publications.html?
    //http://www.ams.org/mathscinet/search/journaldoc.html?cn=Theory_and_Decision
    //http://www.ams.org/mathscinet/search/publdoc.htm
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';
    if (/([a-z]+)doc/.test(match[2])) {
      result.rtype    = 'REF';
    }
    //result.title_id = match[1];
    //result.unitid   = match[2];
  } else if ((match = /^\/([a-z]+)\/pdf\/([0-9]+).pdf$/.exec(path)) !== null) {
    // http://www.ams.org/mathscinet/pdf/3477652.pdf?
    result.rtype    = 'REF';
    result.mime     = 'PDF';
    result.unitid   = match[2];
  }

  return result;
});

