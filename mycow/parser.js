#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform My Cow
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

  if ((match = /^\/([a-z\-]*)\/([a-zA-Z0-9\-]*)$/.exec(path)) !== null) {
    // /article-a-lire-et-a-ecouter-en-anglais/sur-pourquoi-le-cerveau-reve
    result.rtype    = 'ARTICLE';
    result.mime     = 'MISC';
    result.unitid   = match[2];
    if (/videos[\w\W]/.test(match[1])) {
      result.rtype    = 'VIDEO';
    }
  }

  return result;
});

