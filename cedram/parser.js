#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Centre de diffusion de revues Académiques Mathématiques
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

  if ((match = /^\/([a-z\-]+)\/([a-z]+)\/(([A-Z]+)([0-9\_]+)).(pdf|tex)$/.exec(path)) !== null) {
    //http://jep.cedram.org/cedram-bin/article/JEP_2015__2__1_0.pdf
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    if (match[6] === 'tex') {
      result.mime = 'TEX';
    }
    result.title_id = match[4];
    result.unitid   = match[3];
  } else if ((match = /^\/([a-z\-]+)\/([a-z]+)$/.exec(path)) !== null) {
    // http://jep.cedram.org/cgi-bin/feuilleter?id=JEP_2015__2_
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    if (match[2] !== 'feuilleter') {
      result.rtype    = 'REF';
    }
    if (param.id) {
      result.title_id = param.id.split('_')[0];
      result.unitid   = param.id;
    }
  }

  return result;
});

