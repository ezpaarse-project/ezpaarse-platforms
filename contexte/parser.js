#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Contexte
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path = parsedUrl.pathname;
  let match;


  if ((match = /^\/(?:article|actualite)\/[a-z0-9_-]+\/([a-z0-9._-]+)\.html$/i.exec(path)) !== null) {
    // /article/pouvoirs/les-failles-des-regles-deontologiques-au-parlement-europeen-au-revelateur-du-qatargate_160880.html
    // /actualite/agro/la-confederation-paysanne-et-le-modef-vent-debout-face-aux-pistes-devolution-de-la-mise-a-labri-des-volailles-de-lepizootie-dinfluenza_160958.html
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if (/^\/chercher$/i.test(path)) {
    // /chercher?q=pouvoirs&sort=publication_date-desc
    result.rtype = 'SEARCH';
    result.mime  = 'HTML';
  }

  return result;
});
