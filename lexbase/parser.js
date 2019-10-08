#!/usr/bin/env node

'use strict';
const Parser = require('../.lib/parser.js');

/**
 * Recognizes the accesses to the platform Lexbase
 * @param  {Object} parsedUrl an object representing the URL to analyze
 *                            main attributes: pathname, query, hostname
 * @param  {Object} ec        an object representing the EC whose URL is being analyzed
 * @return {Object} the result
 */
module.exports = new Parser(function analyseEC(parsedUrl, ec) {
  let result = {};
  let path   = parsedUrl.pathname;

  // use console.error for debuging
  // console.error(parsedUrl);

  let match;

  if ((match = /^\/sommaire.*\/(\d+).+$/i.exec(path)) !== null) {
    // http://www.lexbase-academie.fr/sommaire-texte-de-loi/53952976-art.-annexe-1-1-code-de-l-action-sociale-et-des-familles
    result.rtype    = 'TOC';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if ((match = /^\/revues-juridiques\/(\d+).+$/i.exec(path)) !== null) {
    // http://www.lexbase-academie.fr/revues-juridiques/6864100-focus-le-comite-europeen-des-regulateurs-des-marches-de-valeurs-mobilieres-finalise-son-processus-d
    result.rtype    = 'ARTICLE';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if ((match = /^\/texte-de-loi\/(\d+).+$/i.exec(path)) !== null) {
    // http://www.lexbase.fr/texte-de-loi/53952979-art.-r115-1-code-de-l-action-sociale-et-des-familles
    result.rtype    = 'CODE_JURIDIQUE';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if ((match = /^\/.*encyclopedie-juridique\/(\d+).+$/i.exec(path)) !== null) {
    // http://www.lexbase-academie.fr/encyclopedie-juridique/43025-etude-le-principe-de-non-discrimination-a-l-embauche
    result.rtype    = 'ENCYCLOPAEDIA_ENTRY';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if ((match = /^\/jurisprudence\/(\d+).+$/i.exec(path)) !== null) {
    // http://www.lexbase-academie.fr/jurisprudence/53996710-cons.-const.-decision-n-2019-806-qpc-du-04-10-2019
    result.rtype    = 'JURISPRUDENCE';
    result.mime     = 'HTML';
    result.unitid   = match[1];

  } else if ((match = /^\/infographie-juridique\/(\d+).+$/i.exec(path)) !== null) {
    // http://www.lexbase-academie.fr/infographie-juridique/52483817-info179-les-referes-devant-les-juridictions-administratives-administratif
    result.rtype    = 'OTHER';
    result.mime     = 'PDF';
    result.unitid   = match[1];
  }

  return result;
});
