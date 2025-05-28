#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Tribune de l'Art
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param = parsedUrl.query || {};

  let match;

  if ((match = /^\/spip.php$/i.exec(path)) !== null && param.page === 'recherche') {
    // /spip.php?page=recherche&recherche=baroque
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/([a-z0-9-]+)$/i.exec(path)) !== null) {
    // /un-panneau-d-hans-baldung-grien-pour-l-alte-pinakothek-de-munich
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  }

  return result;
});
