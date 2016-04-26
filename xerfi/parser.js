#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Xerfi
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
  if ((match = /^\/([a-z]+)\/([a-z\-]+)\/([A-Za-z\-]+)$/.exec(path)) !== null) {
    //xerfifrance/extrait-video-report/Les-marches-du-luxe-et-la-consommation-collaborative
    result.rtype    = 'VIDEO';
    result.mime     = 'MISC';
    result.unitid   = match[3];
  } else if ((match = /^\/([A-Za-z\_]+)\/([a-z0-9]+)\/pdf\/([A-Za-z0-9\-]+).pdf$/.exec(path)) !== null) {
    //Etudes_sectorielles_non_imprimablesE/secteur700doc/pdf/4DIS28-jyJAXyVY.pdf
    result.rtype    = 'ETUDE_SECTORIELLE';
    result.mime     = 'PDF';
    result.unitid   = match[3];
  }

  return result;
});

