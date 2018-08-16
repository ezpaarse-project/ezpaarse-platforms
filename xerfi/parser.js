#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Xerfi
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let match;

  if ((match = /^\/[a-z]+\/[a-z-]+\/([A-Za-z-]+)$/.exec(path)) !== null) {
    //xerfifrance/extrait-video-report/Les-marches-du-luxe-et-la-consommation-collaborative
    result.rtype  = 'VIDEO';
    result.mime   = 'MISC';
    result.unitid = match[1];
  } else if ((match = /^\/[A-Za-z_]+\/[a-z0-9]+\/pdf\/([A-Za-z0-9-]+).pdf$/.exec(path)) !== null) {
    //Etudes_sectorielles_non_imprimablesE/secteur700doc/pdf/4DIS28-jyJAXyVY.pdf
    result.rtype  = 'REPORT';
    result.mime   = 'PDF';
    result.unitid = match[1];
  }

  return result;
});

