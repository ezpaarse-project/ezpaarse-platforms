#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Kompass
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

  if ((match = /^\/([a-z]+)$/.exec(path)) !== null) {
    //    http://fr.kompass.com/easybusiness#/detail/10/0
    result.rtype    = 'FICHE_ENTREPRISE';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if ((match = /^\/([a-z\-]+)\/([a-z]+)\/([a-z]+)/.exec(path)) !== null) {
    // https://fr.kompass.com/my-account/easybusiness/history#/
    result.rtype    = 'FICHE_ENTREPRISE';
    result.mime     = 'HTML';
    result.unitid   = match[2];
  }

  return result;
});

