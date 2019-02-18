#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Intranet thèses générique
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  // uncomment this line if you need parameters
  // let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/(\d{6}.*TH)\.pdf$/i.exec(path)) !== null) {
    // http://theses.univ-amu.fr.lama.univ-amu.fr/180514_NOISETTE_674v669xqz465fbg594kgqs_TH.pdf
    result.rtype    = 'PHD_THESIS';
    result.mime     = 'PDF';
    result.unitid   = match[1];

  } else if ((match = /^\/(\d{4}\w{4}\d{4})\.pdf$/i.exec(path)) !== null) {
    // http://theses.univ-amu.fr.lama.univ-amu.fr/1999AIX20662.pdf
    result.rtype    = 'PHD_THESIS';
    result.mime     = 'PDF';
    result.unitid   = match[1];
  }

  return result;
});
