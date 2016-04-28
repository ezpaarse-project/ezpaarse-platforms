#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform OpenEdition Journals
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
  if ((match = /^\/([0-9]+)$/.exec(path)) !== null) {
    //http://www.openedition.org/13191
    result.rtype    = 'TOC';
    if (parsedUrl.host.split('.')[0] !== 'www') {
      result.rtype    = 'ARTICLE';
      if (parsedUrl.hash && parsedUrl.hash === '#abstract') {
        result.rtype    = 'ABS'
      }
      result.title_id = parsedUrl.host.split('.')[0];
    }

    result.mime     = 'HTML';
    result.unitid   = match[1];
  } else if ((match = /^\/pdf\/([0-9]+)$/.exec(path)) !== null) {
    // http://socio.revues.org/pdf/1882
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.title_id = parsedUrl.host.split('.')[0];
    result.unitid   = match[1];
  }

  return result;
});

