#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Cap Financials
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  // let param = parsedUrl.query || {};

  // console.error(parsedUrl);

  let match;

  if ((match = /^\/company\/([0-9]+)$/i.exec(path)) !== null) {
    // /company/408024719
    result.rtype = 'FICHE_ENTREPRISE';
    result.mime = 'HTML';
    result.unitid = match[1];

  } else if (/^\/search\/simple$/i.test(path)) {
    // /search/simple?query=danone
    result.rtype = 'SEARCH';
    result.mime = 'HTML';
  }

  return result;
});
