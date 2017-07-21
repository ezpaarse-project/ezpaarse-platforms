#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme BUREAU DE RECHERCHES GÉOLOGIQUES ET MINIÈRES
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result   = {};
  let path     = parsedUrl.pathname;
  let hostname = parsedUrl.hostname;
  let match;

  if (/^\/liste-revues$/.test(path)) {
    // http://geolfrance.brgm.fr.:80/liste-revues
    result.rtype    = 'TOC';
    result.mime     = 'MISC';
    result.unitid   = hostname.split('.')[0];

  } else if ((match = /^\/([a-z-]+)$/.exec(path)) !== null) {
    // letiscan-belt-correlations-and-plate-dynamics-special-meeting-french-spanish-geological-societies
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = hostname.split('.')[0];
    result.unitid   = match[1];

  } else if ((match = /^\/sites\/([a-z]+)\/([a-z]+)\/([a-z]+)\/([a-z]+)\/([a-z0-9_]+).pdf$/.exec(path)) !== null) {
    //sites/default/files/upload/documents/revues_articles_gf1_1_2015.pdf
    let pathunitid = match[5].split('_');

    result.rtype  = 'ARTICLE';
    result.mime   = 'PDF';
    result.unitid = pathunitid[2] + '_' + pathunitid[3] + '_' + pathunitid[4];
    result.publication_date = pathunitid[4];
  }

  return result;
});

