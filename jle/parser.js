#!/usr/bin/env node

// ##EZPAARSE

/*jslint maxlen: 150*/
'use strict';
var Parser = require('../.lib/parser.js');

/**
 * Identifie les consultations de la plateforme John Libbery Eurotext
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  var result = {};
  var path = parsedUrl.pathname;
  // uncomment this line if you need parameters
  var param = parsedUrl.query || {};

  var match;

  if ((match = /^\/[a-z]{2}\/revues\/(.+)\/e-docs\/(\w+)_(\d+)\/article\.phtml$/.exec(path)) !== null) {
    // http://www.jle.com/fr/revues/ipe/e-docs/proposition_dune_grille_danalyse_des_representations_sociales_pour_la_prise_en_charge_des_auteurs_dagression_sexuelle_304480/article.phtml?tab=texte
    switch (param.tab) {
    case 'texte':
      result.rtype = 'ARTICLE';
      result.mime = 'HTML';
      break;
    case 'references':
      result.rtype = 'RECORD_VIEW';
      result.mime = 'HTML';
      break;
    case 'images':
      result.rtype = 'IMAGE';
      result.mime = 'HTML';
      break;
    case 'download':
      if (param.pj_key) {
        result.rtype = 'SUPPL';
        result.mime = 'PDF';
      }
      break;
    default:
      result.rtype = 'ABS';
      result.mime = 'HTML';
      break;
    }
    result.title_id = match[1];
    result.unitid = match[3];

  } else if ((match = /^\/download\/([a-z]{3,4})-(\d+)-.*\.pdf$/.exec(path)) !== null) {
    // http://www.jle.com/download/ipe-304480-proposition_dune_grille_danalyse_des_representations_sociales_pour_la_prise_en_charge_des_auteurs_dagression_sexuelle-scd_lille_2-Vt2DzX8AAQEAAHKJNncAAAAG-u.pdf
    result.rtype = 'ARTICLE';
    result.mime = 'PDF';
    result.title_id = match[1];
    result.unitid = match[2];

  } else if ((match = /^\/[a-z]{2}\/revues\/(.+)\/sommaire\.phtml$/.exec(path)) !== null) {
    // http://www.jle.com/fr/revues/ipe/sommaire.phtml?cle_parution=4295
    result.rtype = 'TOC';
    result.mime = 'HTML';
    result.title_id = match[1];
    result.unitid = param.cle_parution;

  } else if ((match = /^\/(10\.[0-9]+\/(([a-z]+)\..+))$/.exec(path)) !== null) {
    // /10.1684/vir.2022.0966
    result.rtype = 'ABS';
    result.mime = 'HTML';
    result.doi = match[1];
    result.unitid = match[2];
    result.title_id = match[3];
  }

  return result;
});
