#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme BUREAU DE RECHERCHES GÉOLOGIQUES ET MINIÈRES
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path   = parsedUrl.pathname;
  var hostname = parsedUrl.hostname;
  // uncomment this line if you need parameters
  // var param  = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  var match;

  if ((match = /^\/liste-revues$/.exec(path)) !== null) {
    // http://geolfrance.brgm.fr.:80/liste-revues
    result.rtype    = 'TOC';
    result.mime     = 'MISC';
    result.unitid   = hostname.split('.')[0];
  } else if ((match = /^\/([a-z\-]+)$/.exec(path)) !== null) {
    // variscan-belt-correlations-and-plate-dynamics-special-meeting-french-spanish-geological-societies
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.title_id = hostname.split('.')[0];
    result.unitid   = match[1];
  } else if ((match = /^\/sites\/([a-z]+)\/([a-z]+)\/([a-z]+)\/([a-z]+)\/([a-z0-9\_]+).pdf$/.exec(path)) !== null) {
    //sites/default/files/upload/documents/revues_articles_gf1_1_2015.pdf
    var pathunitid = match[5].split('_');
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.publication_date = pathunitid[4];
    result.unitid   = pathunitid[2] + '_' + pathunitid[3] + '_' + pathunitid[4];
  }

  return result;
});

