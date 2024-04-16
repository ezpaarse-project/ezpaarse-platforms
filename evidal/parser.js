#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Elsevier Elibrary
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;
  let param = parsedUrl.query || {};

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/recherche/i.exec(path)) !== null) {
    // https://evidal.vidal.fr/recherche.html?q=DOLIPRANE%20500%20MG%20G%C3%89L
    result.rtype    = 'SEARCH';
    result.mime     = 'HTML';

  } else if ((match = /^\/medicament\/.+-(\d+)\.html$/i.exec(path)) !== null) {
    // https://evidal.vidal.fr/medicament/doliprane_500_mg_gel-5480.html
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if ((match = /^\/medicament\/html\/(\d+)\/.+\.html$/i.exec(path)) !== null) {
    // https://evidal.vidal.fr/medicament/html/5480/doliprane_500_mg_gel.html
    result.rtype    = 'RECORD';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if ((match = /^\/medicament\/pdf\.html/i.exec(path)) !== null) {
    // https://evidal.vidal.fr/medicament/pdf.html?id=5480
    result.rtype    = 'RECORD';
    result.mime     = 'PDF';
    result.unitid   = param.id;

  } else if ((match = /^\/recos\/details\/(\d+)\/.+$/i.exec(path)) !== null) {
    // https://evidal.vidal.fr/recos/details/2720/grippe_saisonniere/prise_en_charge
    result.rtype    = 'GRAPH';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if ((match = /^\/baseDocumentaire\/pdf\.html/i.exec(path)) !== null) {
    // https://evidal.vidal.fr/baseDocumentaire/pdf.html?id=2720&permalink=grippe_saisonniere
    result.rtype    = 'ARTICLE';
    result.mime     = 'PDF';
    result.unitid   = param.id;

  } else if ((match = /^\/actualites\/details\/id:(\d+)/i.exec(path)) !== null) {
    // https://evidal-vidal-fr/actualites/details/id:28957/permalink:glaucome_xiop_nouvelle_specialite_a_base_de_latanoprost_en_unidose_et_sans_conservateur/
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if (/^\/analyse-ordonnance\.html$/i.test(path)) {
    // https://evidal-vidal-fr/analyse-ordonnance.html
    result.rtype    = 'ANALYSIS';
    result.mime     = 'HTML';

  }

  return result;
});
