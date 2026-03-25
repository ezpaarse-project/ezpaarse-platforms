#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Le Moniteur
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  let match;

  if (/^\/rechercher\/?$/i.test(path)) {
    // https://www.lemoniteur.fr/rechercher/?query=co%C3%BBt%20construction
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';

  } else if ((match = /^\/mes-magazines\/([a-z-]+\/([0-9]{4}))\/?$/i.exec(path)) !== null) {
    // https://www.lemoniteur.fr/mes-magazines/magazine-le-moniteur/2026/
    result.rtype  = 'TOC';
    result.mime   = 'HTML';
    result.unitid = match[1];
    result.publication_date = match[2];

  } else if ((match = /^\/[a-z-]+\/[a-z-]+\/[a-z-]+\.([A-Z0-9]+)\.html$/i.exec(path)) !== null) {
    // https://www.lemoniteur.fr/provence-alpes-cote-d-azur/bouches-du-rhone/bouches-du-rhone-validation-du-premier-troncon-de-la-grande-traversee-verte-entre-la-ciotat-et-allauch.JUTLLG3NKZFUHCYMXX2UXII3ZE.html
    result.rtype  = 'ARTICLE';
    result.mime   = 'HTML';
    result.unitid = match[1];
  }

  return result;
});
